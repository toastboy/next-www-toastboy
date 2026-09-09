# Team Picker

How `footy` splits a game day's confirmed players into two balanced sides, and
the changes made under SYS-572 to fix odd-sided games and to verify the picker
against ~20 years of historical team sheets.

- **Code:** `src/lib/core/submitPicker/submitPicker.ts` (pure logic),
  `src/actions/submitPicker.ts` (server action wrapper).
- **Domain model:** `docs/ontology.yaml` → `processes.pickerAlgorithm`.
- **Parity test:** `src/lib/core/submitPicker/submitPicker.integration.vitest.spec.ts`.

## What the picker optimises

The picker is **recent-results based, not skill-rating (Arse) based**. For each
confirmed player it builds a candidate row:

| field     | meaning                                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `average` | recency-weighted mean of the player's last `GameDay.pickerGamesHistory` match points (win 3 / draw 1 / loss 0), via `Outcome.getRecentAverage`. Missing history games are backfilled with a neutral **1.45**. |
| `goalie`  | whether the player is a recognised keeper for this game (`Outcome.goalie`).                                                                                                                                   |
| `age`     | approximate age from `Player.born`, **only** for players born before 1995; older birth data is treated as unknown and excluded from the age balance.                                                          |

`findBestSplit` then **exhaustively** evaluates every way to divide the squad
into two sides differing in size by at most one, and picks the split that
minimises, in strict priority order:

1. `| Δ goalie count |`
2. `| Δ team average |`
3. `| Δ count of unknown-age players |`
4. `| Δ total age |`

Ties are broken by the lexicographically smallest team-A bitmask, so the result
is deterministic. Re-running the picker for a game day first clears every
existing team assignment, so a re-pick after a late withdrawal is always safe.

## Odd squads: the substitute-aware objective

When an odd number of players confirm, the game is played `⌊n / 2⌋`-a-side and
the larger "team" rotates a substitute — 9 players is 4-a-side with the 5-man
side resting one player at a time; 11 is 5-a-side with a 6-man side.

### Before

One non-goalie "middle" player was set aside, the rest were split evenly, and
the middle player was then dropped onto whichever team had the lower total
average. This was a heuristic, not an optimisation, and it was **the single
worst part of the picker** — replaying history showed it left the age balance
_worse_ than the stored teams 56 % of the time and produced a less fair split
than a human would have in 39 % of odd games.

### After

There is no "middle player" step. `findBestSplit` handles any parity directly by
scaling each side's cumulative metrics (average, age, unknown-age count) by that
side's **time-averaged on-pitch share**, `onPitch / teamSize`:

- A team of `⌊n / 2⌋` players (no rotation) has scale `1`.
- A team of `⌊n / 2⌋ + 1` players has scale `⌊n / 2⌋ / (⌊n / 2⌋ + 1)` — each
  player is on the pitch that fraction of the game.

So the objective compares the strength **actually on the pitch at any moment**,
not raw squad totals. The consequence is that the larger side is deliberately
loaded with more total rating — roughly `(N + 1) / N` — because each of its
players contributes less playing time.

Goalie **count** is a structural constraint, not a pitch-time quantity, so it is
still compared unscaled.

For an even squad both scales are `1` and the formula is identical to the
previous summed-difference comparison — **even-sided picks are unchanged**.

### Assumption: uniform rotation

The model assumes everyone on the larger side rests equally, keeper included. If
in practice the keeper plays the whole game and only outfielders rotate, a
goalie on the larger side should be weighted `1` rather than
`onPitch / teamSize`. This variant is not implemented; the current behaviour
matches "a rotating team of four with one sitting out".

## Verifying against history

`submitPicker.integration.vitest.spec.ts` replays the current picker against
every historical game day that has stored teams (~930) and checks whether it
reproduces the recorded split (allowing for the arbitrary A/B labelling).

To make the replay faithful to what the picker saw on the day, the harness
reconstructs pick-time state rather than reading current data:

- **Roster** — `Outcome.getAdminByGameDay` takes an optional `asOf` date. The
  harness passes the game day's own date so a player who has since left the club
  is still included for games they were around for. (`getAdminByGameDay` with no
  `asOf` is unchanged: active players only.)
- **Responses** — a player with a stored team was `'Yes'` at pick time by
  definition; a later `Flaked` / `Injured` / `Excused` amendment is ignored.
- **Games played** — "all-time games played" is reinterpreted as "games before
  this game day", so a player's count is not inflated by games they have played
  since.

Age is **not** reconstructable — `Player.born` has no "entered on" timestamp and
there is no persisted record of the age the legacy picker used — so age-driven
divergences are treated as a soft signal.

### Running it

The parity suite is opt-in and needs a database with the historical data:

```bash
RUN_PICKER_INTEGRATION=true \
  op run --env-file ./.env -- npm run test:picker:integration
```

By default it checks every game day with a stored split; set
`PICKER_PARITY_GAME_IDS=1249,1300` to narrow it. On a mismatch it prints a
diagnostics block per game — the historical and picked tuples, every player who
changed sides with their trailing-average breakdown, and where the historical
split ranks among all possible splits.

There is also a VS Code task, **"Picker parity integration test (1Password
env)"**.

### `diff_played`: deliberately not implemented

The legacy PHP `picker_best_teams` ranked `| Δ total games played |` **second**,
above average. It is deliberately omitted here. Adding it back was tried and
measured: it moved teams _further_ from the stored splits (breaking 54 verified
matches to fix 9) because it forces newcomers to be spread evenly before skill
is even considered, and it adds no fairness the recent-average metric does not
already capture. The comment in `compareDiffs` records this.

## Fairness: is the new picker better than history?

Across the ~930 games with stored teams, the picker reproduces history exactly
in ~30 % and picks different teams in ~70 %. Of the games where it diverges:

### Even-sided games

| metric (mean \|Δ\|) | historical | picker | optimal |
| ------------------- | ---------: | -----: | ------: |
| Δ goalies           |       0.69 |   0.57 |    0.57 |
| Δ average           |       0.39 |   0.09 |    0.09 |
| Δ unknown-age count |       0.43 |   0.41 |    0.41 |
| Δ age               |       15.6 |    4.1 |     4.1 |

The picker is **strictly fairer in ~89 %**, an exact tie in ~11 %, and **never
worse**. It reaches the provable optimum in 100 % of them. Dropping the age
terms entirely — comparing only goalies and average, which are not exposed to
DOB-timing noise — the picker is still **never worse** and strictly fairer in
~41 %.

### Odd-sided games

The substitute-aware objective brings odd games in line with even games. Mean
`|Δ|` rows read _historical → picker_.

| measure                 | old (middle-player) | new (time-averaged) |
| ----------------------- | ------------------- | ------------------- |
| picker fairer than hist | 61 %                | 99 %                |
| picker worse            | 39 %                | 0 %                 |
| picker == provable opt. | n/a (heuristic)     | 100 %               |
| mean \|Δ average\|      | 1.54 → 1.40         | 0.41 → 0.06         |
| mean \|Δ age\|          | 35.2 → 37.4 (worse) | 13.9 → 4.2          |

The historical teams were frequently well short of optimal — typically several
dozen splits beat them — consistent with manual tinkering and early-era picker
versions. Where age data is trustworthy the picker is clearly better on age
too; we simply cannot prove which historical mismatches are real versus a DOB
entered after the game.
