import { z } from 'zod';
import type { Prisma } from '../prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ArseScalarFieldEnumSchema = z.enum(['id','stamp','inGoal','running','shooting','passing','ballSkill','attacking','defending','playerId','raterId']);

export const ClubScalarFieldEnumSchema = z.enum(['id','soccerwayId','clubName','uri','country']);

export const ClubSupporterScalarFieldEnumSchema = z.enum(['playerId','clubId']);

export const CountryScalarFieldEnumSchema = z.enum(['isoCode','name']);

export const CountrySupporterScalarFieldEnumSchema = z.enum(['playerId','countryISOCode']);

export const DiffsScalarFieldEnumSchema = z.enum(['id','a','b','diffAge','diffUnknownAge','diffGoalies','diffAverage','diffPlayed']);

export const GameChatScalarFieldEnumSchema = z.enum(['id','gameDay','stamp','player','body']);

export const GameDayScalarFieldEnumSchema = z.enum(['id','year','date','game','mailSent','comment','bibs','pickerGamesHistory']);

export const InvitationScalarFieldEnumSchema = z.enum(['uuid','playerId','gameDayId']);

export const OutcomeScalarFieldEnumSchema = z.enum(['id','response','responseInterval','points','team','comment','pub','paid','goalie','gameDayId','playerId']);

export const PickerScalarFieldEnumSchema = z.enum(['playerId','playerName','age','average','goalie','played']);

export const PickerTeamsScalarFieldEnumSchema = z.enum(['playerId','team']);

export const PlayerScalarFieldEnumSchema = z.enum(['id','login','isAdmin','firstName','lastName','name','anonymous','email','joined','finished','born','comment','introducedBy']);

export const PlayerRecordScalarFieldEnumSchema = z.enum(['id','year','responses','played','won','drawn','lost','points','averages','stalwart','pub','rankPoints','rankAverages','rankAveragesUnqualified','rankStalwart','rankSpeedy','rankSpeedyUnqualified','rankPub','speedy','playerId','gameDayId']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','createdAt','updatedAt','role','banned','banReason','banExpires']);

export const SessionScalarFieldEnumSchema = z.enum(['id','expiresAt','token','createdAt','updatedAt','ipAddress','userAgent','userId','impersonatedBy']);

export const AccountScalarFieldEnumSchema = z.enum(['id','accountId','providerId','userId','accessToken','refreshToken','idToken','accessTokenExpiresAt','refreshTokenExpiresAt','scope','password','createdAt','updatedAt']);

export const VerificationScalarFieldEnumSchema = z.enum(['id','identifier','value','expiresAt','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);

export const ClubOrderByRelevanceFieldEnumSchema = z.enum(['clubName','uri','country']);

export const CountryOrderByRelevanceFieldEnumSchema = z.enum(['isoCode','name']);

export const CountrySupporterOrderByRelevanceFieldEnumSchema = z.enum(['countryISOCode']);

export const DiffsOrderByRelevanceFieldEnumSchema = z.enum(['a','b']);

export const GameChatOrderByRelevanceFieldEnumSchema = z.enum(['body']);

export const GameDayOrderByRelevanceFieldEnumSchema = z.enum(['comment']);

export const InvitationOrderByRelevanceFieldEnumSchema = z.enum(['uuid']);

export const OutcomeOrderByRelevanceFieldEnumSchema = z.enum(['comment']);

export const PickerOrderByRelevanceFieldEnumSchema = z.enum(['playerName']);

export const PlayerOrderByRelevanceFieldEnumSchema = z.enum(['login','firstName','lastName','name','email','comment']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id','name','email','image','role','banReason']);

export const SessionOrderByRelevanceFieldEnumSchema = z.enum(['id','token','ipAddress','userAgent','userId','impersonatedBy']);

export const AccountOrderByRelevanceFieldEnumSchema = z.enum(['id','accountId','providerId','userId','accessToken','refreshToken','idToken','scope','password']);

export const VerificationOrderByRelevanceFieldEnumSchema = z.enum(['id','identifier','value']);

export const TeamNameSchema = z.enum(['A','B']);

export type TeamNameType = `${z.infer<typeof TeamNameSchema>}`

export const PlayerResponseSchema = z.enum(['Yes','No','Dunno','Excused','Flaked','Injured']);

export type PlayerResponseType = `${z.infer<typeof PlayerResponseSchema>}`

export const TableNameSchema = z.enum(['points','averages','stalwart','speedy','pub']);

export type TableNameType = `${z.infer<typeof TableNameSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ARSE SCHEMA
/////////////////////////////////////////

export const ArseSchema = z.object({
  id: z.number().int(),
  stamp: z.coerce.date(),
  inGoal: z.number().int().nullable(),
  running: z.number().int().nullable(),
  shooting: z.number().int().nullable(),
  passing: z.number().int().nullable(),
  ballSkill: z.number().int().nullable(),
  attacking: z.number().int().nullable(),
  defending: z.number().int().nullable(),
  playerId: z.number().int(),
  raterId: z.number().int(),
})

export type Arse = z.infer<typeof ArseSchema>

/////////////////////////////////////////
// CLUB SCHEMA
/////////////////////////////////////////

export const ClubSchema = z.object({
  id: z.number().int(),
  soccerwayId: z.number().int().nullable(),
  clubName: z.string(),
  uri: z.string().nullable(),
  country: z.string().nullable(),
})

export type Club = z.infer<typeof ClubSchema>

/////////////////////////////////////////
// CLUB SUPPORTER SCHEMA
/////////////////////////////////////////

export const ClubSupporterSchema = z.object({
  playerId: z.number().int(),
  clubId: z.number().int(),
})

export type ClubSupporter = z.infer<typeof ClubSupporterSchema>

/////////////////////////////////////////
// COUNTRY SCHEMA
/////////////////////////////////////////

export const CountrySchema = z.object({
  isoCode: z.string(),
  name: z.string(),
})

export type Country = z.infer<typeof CountrySchema>

/////////////////////////////////////////
// COUNTRY SUPPORTER SCHEMA
/////////////////////////////////////////

export const CountrySupporterSchema = z.object({
  playerId: z.number().int(),
  countryISOCode: z.string(),
})

export type CountrySupporter = z.infer<typeof CountrySupporterSchema>

/////////////////////////////////////////
// DIFFS SCHEMA
/////////////////////////////////////////

export const DiffsSchema = z.object({
  id: z.number().int(),
  a: z.string().nullable(),
  b: z.string().nullable(),
  diffAge: z.number().nullable(),
  diffUnknownAge: z.number().int().nullable(),
  diffGoalies: z.number().int().nullable(),
  diffAverage: z.number().nullable(),
  diffPlayed: z.number().int().nullable(),
})

export type Diffs = z.infer<typeof DiffsSchema>

/////////////////////////////////////////
// GAME CHAT SCHEMA
/////////////////////////////////////////

export const GameChatSchema = z.object({
  id: z.number().int(),
  gameDay: z.number().int(),
  stamp: z.coerce.date(),
  player: z.number().int(),
  body: z.string().nullable(),
})

export type GameChat = z.infer<typeof GameChatSchema>

/////////////////////////////////////////
// GAME DAY SCHEMA
/////////////////////////////////////////

export const GameDaySchema = z.object({
  bibs: TeamNameSchema.nullable(),
  id: z.number().int(),
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean(),
  mailSent: z.coerce.date().nullable(),
  comment: z.string().nullable(),
  pickerGamesHistory: z.number().int().nullable(),
})

export type GameDay = z.infer<typeof GameDaySchema>

/////////////////////////////////////////
// INVITATION SCHEMA
/////////////////////////////////////////

export const InvitationSchema = z.object({
  uuid: z.string(),
  playerId: z.number().int(),
  gameDayId: z.number().int(),
})

export type Invitation = z.infer<typeof InvitationSchema>

/////////////////////////////////////////
// OUTCOME SCHEMA
/////////////////////////////////////////

export const OutcomeSchema = z.object({
  response: PlayerResponseSchema.nullable(),
  team: TeamNameSchema.nullable(),
  id: z.number().int(),
  responseInterval: z.number().int().nullable(),
  points: z.number().int().nullable(),
  comment: z.string().nullable(),
  pub: z.number().int().nullable(),
  paid: z.boolean().nullable(),
  goalie: z.boolean().nullable(),
  gameDayId: z.number().int(),
  playerId: z.number().int(),
})

export type Outcome = z.infer<typeof OutcomeSchema>

/////////////////////////////////////////
// PICKER SCHEMA
/////////////////////////////////////////

export const PickerSchema = z.object({
  playerId: z.number().int(),
  playerName: z.string().nullable(),
  age: z.number().int().nullable(),
  average: z.number().nullable(),
  goalie: z.number().int().nullable(),
  played: z.number().int().nullable(),
})

export type Picker = z.infer<typeof PickerSchema>

/////////////////////////////////////////
// PICKER TEAMS SCHEMA
/////////////////////////////////////////

export const PickerTeamsSchema = z.object({
  team: TeamNameSchema.nullable(),
  playerId: z.number().int(),
})

export type PickerTeams = z.infer<typeof PickerTeamsSchema>

/////////////////////////////////////////
// PLAYER SCHEMA
/////////////////////////////////////////

export const PlayerSchema = z.object({
  id: z.number().int(),
  login: z.string(),
  isAdmin: z.boolean().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  name: z.string().nullable(),
  anonymous: z.boolean().nullable(),
  email: z.string().nullable(),
  joined: z.coerce.date().nullable(),
  finished: z.coerce.date().nullable(),
  born: z.coerce.date().nullable(),
  comment: z.string().nullable(),
  introducedBy: z.number().int().nullable(),
})

export type Player = z.infer<typeof PlayerSchema>

/////////////////////////////////////////
// PLAYER RECORD SCHEMA
/////////////////////////////////////////

export const PlayerRecordSchema = z.object({
  id: z.number().int(),
  year: z.number().int(),
  responses: z.number().int().nullable(),
  played: z.number().int().nullable(),
  won: z.number().int().nullable(),
  drawn: z.number().int().nullable(),
  lost: z.number().int().nullable(),
  points: z.number().int().nullable(),
  averages: z.number().nullable(),
  stalwart: z.number().int().nullable(),
  pub: z.number().int().nullable(),
  rankPoints: z.number().int().nullable(),
  rankAverages: z.number().int().nullable(),
  rankAveragesUnqualified: z.number().int().nullable(),
  rankStalwart: z.number().int().nullable(),
  rankSpeedy: z.number().int().nullable(),
  rankSpeedyUnqualified: z.number().int().nullable(),
  rankPub: z.number().int().nullable(),
  speedy: z.number().int().nullable(),
  playerId: z.number().int(),
  gameDayId: z.number().int(),
})

export type PlayerRecord = z.infer<typeof PlayerRecordSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().nullable(),
  banned: z.boolean().nullable(),
  banReason: z.string().nullable(),
  banExpires: z.coerce.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().nullable(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  idToken: z.string().nullable(),
  accessTokenExpiresAt: z.coerce.date().nullable(),
  refreshTokenExpiresAt: z.coerce.date().nullable(),
  scope: z.string().nullable(),
  password: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
})

export type Verification = z.infer<typeof VerificationSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ARSE
//------------------------------------------------------

export const ArseIncludeSchema: z.ZodType<Prisma.ArseInclude> = z.object({
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
  rater: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
}).strict()

export const ArseArgsSchema: z.ZodType<Prisma.ArseDefaultArgs> = z.object({
  select: z.lazy(() => ArseSelectSchema).optional(),
  include: z.lazy(() => ArseIncludeSchema).optional(),
}).strict();

export const ArseSelectSchema: z.ZodType<Prisma.ArseSelect> = z.object({
  id: z.boolean().optional(),
  stamp: z.boolean().optional(),
  inGoal: z.boolean().optional(),
  running: z.boolean().optional(),
  shooting: z.boolean().optional(),
  passing: z.boolean().optional(),
  ballSkill: z.boolean().optional(),
  attacking: z.boolean().optional(),
  defending: z.boolean().optional(),
  playerId: z.boolean().optional(),
  raterId: z.boolean().optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
  rater: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
}).strict()

// CLUB
//------------------------------------------------------

export const ClubIncludeSchema: z.ZodType<Prisma.ClubInclude> = z.object({
  supporters: z.union([z.boolean(),z.lazy(() => ClubSupporterFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClubCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ClubArgsSchema: z.ZodType<Prisma.ClubDefaultArgs> = z.object({
  select: z.lazy(() => ClubSelectSchema).optional(),
  include: z.lazy(() => ClubIncludeSchema).optional(),
}).strict();

export const ClubCountOutputTypeArgsSchema: z.ZodType<Prisma.ClubCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ClubCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ClubCountOutputTypeSelectSchema: z.ZodType<Prisma.ClubCountOutputTypeSelect> = z.object({
  supporters: z.boolean().optional(),
}).strict();

export const ClubSelectSchema: z.ZodType<Prisma.ClubSelect> = z.object({
  id: z.boolean().optional(),
  soccerwayId: z.boolean().optional(),
  clubName: z.boolean().optional(),
  uri: z.boolean().optional(),
  country: z.boolean().optional(),
  supporters: z.union([z.boolean(),z.lazy(() => ClubSupporterFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ClubCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CLUB SUPPORTER
//------------------------------------------------------

export const ClubSupporterIncludeSchema: z.ZodType<Prisma.ClubSupporterInclude> = z.object({
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
  club: z.union([z.boolean(),z.lazy(() => ClubArgsSchema)]).optional(),
}).strict()

export const ClubSupporterArgsSchema: z.ZodType<Prisma.ClubSupporterDefaultArgs> = z.object({
  select: z.lazy(() => ClubSupporterSelectSchema).optional(),
  include: z.lazy(() => ClubSupporterIncludeSchema).optional(),
}).strict();

export const ClubSupporterSelectSchema: z.ZodType<Prisma.ClubSupporterSelect> = z.object({
  playerId: z.boolean().optional(),
  clubId: z.boolean().optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
  club: z.union([z.boolean(),z.lazy(() => ClubArgsSchema)]).optional(),
}).strict()

// COUNTRY
//------------------------------------------------------

export const CountryIncludeSchema: z.ZodType<Prisma.CountryInclude> = z.object({
  supporters: z.union([z.boolean(),z.lazy(() => CountrySupporterFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CountryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CountryArgsSchema: z.ZodType<Prisma.CountryDefaultArgs> = z.object({
  select: z.lazy(() => CountrySelectSchema).optional(),
  include: z.lazy(() => CountryIncludeSchema).optional(),
}).strict();

export const CountryCountOutputTypeArgsSchema: z.ZodType<Prisma.CountryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CountryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CountryCountOutputTypeSelectSchema: z.ZodType<Prisma.CountryCountOutputTypeSelect> = z.object({
  supporters: z.boolean().optional(),
}).strict();

export const CountrySelectSchema: z.ZodType<Prisma.CountrySelect> = z.object({
  isoCode: z.boolean().optional(),
  name: z.boolean().optional(),
  supporters: z.union([z.boolean(),z.lazy(() => CountrySupporterFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CountryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COUNTRY SUPPORTER
//------------------------------------------------------

export const CountrySupporterIncludeSchema: z.ZodType<Prisma.CountrySupporterInclude> = z.object({
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
}).strict()

export const CountrySupporterArgsSchema: z.ZodType<Prisma.CountrySupporterDefaultArgs> = z.object({
  select: z.lazy(() => CountrySupporterSelectSchema).optional(),
  include: z.lazy(() => CountrySupporterIncludeSchema).optional(),
}).strict();

export const CountrySupporterSelectSchema: z.ZodType<Prisma.CountrySupporterSelect> = z.object({
  playerId: z.boolean().optional(),
  countryISOCode: z.boolean().optional(),
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
}).strict()

// DIFFS
//------------------------------------------------------

export const DiffsSelectSchema: z.ZodType<Prisma.DiffsSelect> = z.object({
  id: z.boolean().optional(),
  a: z.boolean().optional(),
  b: z.boolean().optional(),
  diffAge: z.boolean().optional(),
  diffUnknownAge: z.boolean().optional(),
  diffGoalies: z.boolean().optional(),
  diffAverage: z.boolean().optional(),
  diffPlayed: z.boolean().optional(),
}).strict()

// GAME CHAT
//------------------------------------------------------

export const GameChatSelectSchema: z.ZodType<Prisma.GameChatSelect> = z.object({
  id: z.boolean().optional(),
  gameDay: z.boolean().optional(),
  stamp: z.boolean().optional(),
  player: z.boolean().optional(),
  body: z.boolean().optional(),
}).strict()

// GAME DAY
//------------------------------------------------------

export const GameDayIncludeSchema: z.ZodType<Prisma.GameDayInclude> = z.object({
  outcomes: z.union([z.boolean(),z.lazy(() => OutcomeFindManyArgsSchema)]).optional(),
  playerRecords: z.union([z.boolean(),z.lazy(() => PlayerRecordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => GameDayCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const GameDayArgsSchema: z.ZodType<Prisma.GameDayDefaultArgs> = z.object({
  select: z.lazy(() => GameDaySelectSchema).optional(),
  include: z.lazy(() => GameDayIncludeSchema).optional(),
}).strict();

export const GameDayCountOutputTypeArgsSchema: z.ZodType<Prisma.GameDayCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => GameDayCountOutputTypeSelectSchema).nullish(),
}).strict();

export const GameDayCountOutputTypeSelectSchema: z.ZodType<Prisma.GameDayCountOutputTypeSelect> = z.object({
  outcomes: z.boolean().optional(),
  playerRecords: z.boolean().optional(),
}).strict();

export const GameDaySelectSchema: z.ZodType<Prisma.GameDaySelect> = z.object({
  id: z.boolean().optional(),
  year: z.boolean().optional(),
  date: z.boolean().optional(),
  game: z.boolean().optional(),
  mailSent: z.boolean().optional(),
  comment: z.boolean().optional(),
  bibs: z.boolean().optional(),
  pickerGamesHistory: z.boolean().optional(),
  outcomes: z.union([z.boolean(),z.lazy(() => OutcomeFindManyArgsSchema)]).optional(),
  playerRecords: z.union([z.boolean(),z.lazy(() => PlayerRecordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => GameDayCountOutputTypeArgsSchema)]).optional(),
}).strict()

// INVITATION
//------------------------------------------------------

export const InvitationSelectSchema: z.ZodType<Prisma.InvitationSelect> = z.object({
  uuid: z.boolean().optional(),
  playerId: z.boolean().optional(),
  gameDayId: z.boolean().optional(),
}).strict()

// OUTCOME
//------------------------------------------------------

export const OutcomeIncludeSchema: z.ZodType<Prisma.OutcomeInclude> = z.object({
  gameDay: z.union([z.boolean(),z.lazy(() => GameDayArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
}).strict()

export const OutcomeArgsSchema: z.ZodType<Prisma.OutcomeDefaultArgs> = z.object({
  select: z.lazy(() => OutcomeSelectSchema).optional(),
  include: z.lazy(() => OutcomeIncludeSchema).optional(),
}).strict();

export const OutcomeSelectSchema: z.ZodType<Prisma.OutcomeSelect> = z.object({
  id: z.boolean().optional(),
  response: z.boolean().optional(),
  responseInterval: z.boolean().optional(),
  points: z.boolean().optional(),
  team: z.boolean().optional(),
  comment: z.boolean().optional(),
  pub: z.boolean().optional(),
  paid: z.boolean().optional(),
  goalie: z.boolean().optional(),
  gameDayId: z.boolean().optional(),
  playerId: z.boolean().optional(),
  gameDay: z.union([z.boolean(),z.lazy(() => GameDayArgsSchema)]).optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
}).strict()

// PICKER
//------------------------------------------------------

export const PickerSelectSchema: z.ZodType<Prisma.PickerSelect> = z.object({
  playerId: z.boolean().optional(),
  playerName: z.boolean().optional(),
  age: z.boolean().optional(),
  average: z.boolean().optional(),
  goalie: z.boolean().optional(),
  played: z.boolean().optional(),
}).strict()

// PICKER TEAMS
//------------------------------------------------------

export const PickerTeamsSelectSchema: z.ZodType<Prisma.PickerTeamsSelect> = z.object({
  playerId: z.boolean().optional(),
  team: z.boolean().optional(),
}).strict()

// PLAYER
//------------------------------------------------------

export const PlayerIncludeSchema: z.ZodType<Prisma.PlayerInclude> = z.object({
  arsesOfPlayer: z.union([z.boolean(),z.lazy(() => ArseFindManyArgsSchema)]).optional(),
  arsesByPlayer: z.union([z.boolean(),z.lazy(() => ArseFindManyArgsSchema)]).optional(),
  clubs: z.union([z.boolean(),z.lazy(() => ClubSupporterFindManyArgsSchema)]).optional(),
  countries: z.union([z.boolean(),z.lazy(() => CountrySupporterFindManyArgsSchema)]).optional(),
  outcomes: z.union([z.boolean(),z.lazy(() => OutcomeFindManyArgsSchema)]).optional(),
  playerRecords: z.union([z.boolean(),z.lazy(() => PlayerRecordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PlayerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PlayerArgsSchema: z.ZodType<Prisma.PlayerDefaultArgs> = z.object({
  select: z.lazy(() => PlayerSelectSchema).optional(),
  include: z.lazy(() => PlayerIncludeSchema).optional(),
}).strict();

export const PlayerCountOutputTypeArgsSchema: z.ZodType<Prisma.PlayerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PlayerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PlayerCountOutputTypeSelectSchema: z.ZodType<Prisma.PlayerCountOutputTypeSelect> = z.object({
  arsesOfPlayer: z.boolean().optional(),
  arsesByPlayer: z.boolean().optional(),
  clubs: z.boolean().optional(),
  countries: z.boolean().optional(),
  outcomes: z.boolean().optional(),
  playerRecords: z.boolean().optional(),
}).strict();

export const PlayerSelectSchema: z.ZodType<Prisma.PlayerSelect> = z.object({
  id: z.boolean().optional(),
  login: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  name: z.boolean().optional(),
  anonymous: z.boolean().optional(),
  email: z.boolean().optional(),
  joined: z.boolean().optional(),
  finished: z.boolean().optional(),
  born: z.boolean().optional(),
  comment: z.boolean().optional(),
  introducedBy: z.boolean().optional(),
  arsesOfPlayer: z.union([z.boolean(),z.lazy(() => ArseFindManyArgsSchema)]).optional(),
  arsesByPlayer: z.union([z.boolean(),z.lazy(() => ArseFindManyArgsSchema)]).optional(),
  clubs: z.union([z.boolean(),z.lazy(() => ClubSupporterFindManyArgsSchema)]).optional(),
  countries: z.union([z.boolean(),z.lazy(() => CountrySupporterFindManyArgsSchema)]).optional(),
  outcomes: z.union([z.boolean(),z.lazy(() => OutcomeFindManyArgsSchema)]).optional(),
  playerRecords: z.union([z.boolean(),z.lazy(() => PlayerRecordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PlayerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PLAYER RECORD
//------------------------------------------------------

export const PlayerRecordIncludeSchema: z.ZodType<Prisma.PlayerRecordInclude> = z.object({
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
  gameDay: z.union([z.boolean(),z.lazy(() => GameDayArgsSchema)]).optional(),
}).strict()

export const PlayerRecordArgsSchema: z.ZodType<Prisma.PlayerRecordDefaultArgs> = z.object({
  select: z.lazy(() => PlayerRecordSelectSchema).optional(),
  include: z.lazy(() => PlayerRecordIncludeSchema).optional(),
}).strict();

export const PlayerRecordSelectSchema: z.ZodType<Prisma.PlayerRecordSelect> = z.object({
  id: z.boolean().optional(),
  year: z.boolean().optional(),
  responses: z.boolean().optional(),
  played: z.boolean().optional(),
  won: z.boolean().optional(),
  drawn: z.boolean().optional(),
  lost: z.boolean().optional(),
  points: z.boolean().optional(),
  averages: z.boolean().optional(),
  stalwart: z.boolean().optional(),
  pub: z.boolean().optional(),
  rankPoints: z.boolean().optional(),
  rankAverages: z.boolean().optional(),
  rankAveragesUnqualified: z.boolean().optional(),
  rankStalwart: z.boolean().optional(),
  rankSpeedy: z.boolean().optional(),
  rankSpeedyUnqualified: z.boolean().optional(),
  rankPub: z.boolean().optional(),
  speedy: z.boolean().optional(),
  playerId: z.boolean().optional(),
  gameDayId: z.boolean().optional(),
  player: z.union([z.boolean(),z.lazy(() => PlayerArgsSchema)]).optional(),
  gameDay: z.union([z.boolean(),z.lazy(() => GameDayArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  sessions: z.boolean().optional(),
  accounts: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  role: z.boolean().optional(),
  banned: z.boolean().optional(),
  banReason: z.boolean().optional(),
  banExpires: z.boolean().optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  token: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  userId: z.boolean().optional(),
  impersonatedBy: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  accountId: z.boolean().optional(),
  providerId: z.boolean().optional(),
  userId: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  idToken: z.boolean().optional(),
  accessTokenExpiresAt: z.boolean().optional(),
  refreshTokenExpiresAt: z.boolean().optional(),
  scope: z.boolean().optional(),
  password: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// VERIFICATION
//------------------------------------------------------

export const VerificationSelectSchema: z.ZodType<Prisma.VerificationSelect> = z.object({
  id: z.boolean().optional(),
  identifier: z.boolean().optional(),
  value: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ArseWhereInputSchema: z.ZodType<Prisma.ArseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ArseWhereInputSchema),z.lazy(() => ArseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArseWhereInputSchema),z.lazy(() => ArseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inGoal: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  running: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  shooting: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  passing: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  ballSkill: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  attacking: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  defending: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  raterId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
  rater: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
}).strict();

export const ArseOrderByWithRelationInputSchema: z.ZodType<Prisma.ArseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  running: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  shooting: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  passing: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ballSkill: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attacking: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  defending: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => PlayerOrderByWithRelationInputSchema).optional(),
  rater: z.lazy(() => PlayerOrderByWithRelationInputSchema).optional()
}).strict();

export const ArseWhereUniqueInputSchema: z.ZodType<Prisma.ArseWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    playerId_raterId: z.lazy(() => ArsePlayerIdRaterIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    playerId_raterId: z.lazy(() => ArsePlayerIdRaterIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  playerId_raterId: z.lazy(() => ArsePlayerIdRaterIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ArseWhereInputSchema),z.lazy(() => ArseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArseWhereInputSchema),z.lazy(() => ArseWhereInputSchema).array() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inGoal: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  running: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  shooting: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  passing: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  ballSkill: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  attacking: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  defending: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  raterId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
  rater: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
}).strict());

export const ArseOrderByWithAggregationInputSchema: z.ZodType<Prisma.ArseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  running: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  shooting: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  passing: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ballSkill: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  attacking: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  defending: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ArseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ArseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ArseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ArseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ArseSumOrderByAggregateInputSchema).optional()
}).strict();

export const ArseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ArseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ArseScalarWhereWithAggregatesInputSchema),z.lazy(() => ArseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArseScalarWhereWithAggregatesInputSchema),z.lazy(() => ArseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  inGoal: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  running: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  shooting: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  passing: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  ballSkill: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  attacking: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  defending: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  raterId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ClubWhereInputSchema: z.ZodType<Prisma.ClubWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClubWhereInputSchema),z.lazy(() => ClubWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubWhereInputSchema),z.lazy(() => ClubWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  soccerwayId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  clubName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uri: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  supporters: z.lazy(() => ClubSupporterListRelationFilterSchema).optional()
}).strict();

export const ClubOrderByWithRelationInputSchema: z.ZodType<Prisma.ClubOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  clubName: z.lazy(() => SortOrderSchema).optional(),
  uri: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  supporters: z.lazy(() => ClubSupporterOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => ClubOrderByRelevanceInputSchema).optional()
}).strict();

export const ClubWhereUniqueInputSchema: z.ZodType<Prisma.ClubWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ClubWhereInputSchema),z.lazy(() => ClubWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubWhereInputSchema),z.lazy(() => ClubWhereInputSchema).array() ]).optional(),
  soccerwayId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  clubName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uri: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  supporters: z.lazy(() => ClubSupporterListRelationFilterSchema).optional()
}).strict());

export const ClubOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClubOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  clubName: z.lazy(() => SortOrderSchema).optional(),
  uri: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ClubCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClubAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClubMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClubMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClubSumOrderByAggregateInputSchema).optional()
}).strict();

export const ClubScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClubScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClubScalarWhereWithAggregatesInputSchema),z.lazy(() => ClubScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubScalarWhereWithAggregatesInputSchema),z.lazy(() => ClubScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  soccerwayId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  clubName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uri: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ClubSupporterWhereInputSchema: z.ZodType<Prisma.ClubSupporterWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClubSupporterWhereInputSchema),z.lazy(() => ClubSupporterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubSupporterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubSupporterWhereInputSchema),z.lazy(() => ClubSupporterWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clubId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
  club: z.union([ z.lazy(() => ClubScalarRelationFilterSchema),z.lazy(() => ClubWhereInputSchema) ]).optional(),
}).strict();

export const ClubSupporterOrderByWithRelationInputSchema: z.ZodType<Prisma.ClubSupporterOrderByWithRelationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => PlayerOrderByWithRelationInputSchema).optional(),
  club: z.lazy(() => ClubOrderByWithRelationInputSchema).optional()
}).strict();

export const ClubSupporterWhereUniqueInputSchema: z.ZodType<Prisma.ClubSupporterWhereUniqueInput> = z.object({
  playerId_clubId: z.lazy(() => ClubSupporterPlayerIdClubIdCompoundUniqueInputSchema)
})
.and(z.object({
  playerId_clubId: z.lazy(() => ClubSupporterPlayerIdClubIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ClubSupporterWhereInputSchema),z.lazy(() => ClubSupporterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubSupporterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubSupporterWhereInputSchema),z.lazy(() => ClubSupporterWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  clubId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
  club: z.union([ z.lazy(() => ClubScalarRelationFilterSchema),z.lazy(() => ClubWhereInputSchema) ]).optional(),
}).strict());

export const ClubSupporterOrderByWithAggregationInputSchema: z.ZodType<Prisma.ClubSupporterOrderByWithAggregationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ClubSupporterCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ClubSupporterAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ClubSupporterMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ClubSupporterMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ClubSupporterSumOrderByAggregateInputSchema).optional()
}).strict();

export const ClubSupporterScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ClubSupporterScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ClubSupporterScalarWhereWithAggregatesInputSchema),z.lazy(() => ClubSupporterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubSupporterScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubSupporterScalarWhereWithAggregatesInputSchema),z.lazy(() => ClubSupporterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  clubId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const CountryWhereInputSchema: z.ZodType<Prisma.CountryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  isoCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  supporters: z.lazy(() => CountrySupporterListRelationFilterSchema).optional()
}).strict();

export const CountryOrderByWithRelationInputSchema: z.ZodType<Prisma.CountryOrderByWithRelationInput> = z.object({
  isoCode: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  supporters: z.lazy(() => CountrySupporterOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => CountryOrderByRelevanceInputSchema).optional()
}).strict();

export const CountryWhereUniqueInputSchema: z.ZodType<Prisma.CountryWhereUniqueInput> = z.union([
  z.object({
    isoCode: z.string(),
    name: z.string()
  }),
  z.object({
    isoCode: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  isoCode: z.string().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  supporters: z.lazy(() => CountrySupporterListRelationFilterSchema).optional()
}).strict());

export const CountryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CountryOrderByWithAggregationInput> = z.object({
  isoCode: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CountryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CountryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CountryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CountryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CountryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CountryScalarWhereWithAggregatesInputSchema),z.lazy(() => CountryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryScalarWhereWithAggregatesInputSchema),z.lazy(() => CountryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  isoCode: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CountrySupporterWhereInputSchema: z.ZodType<Prisma.CountrySupporterWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CountrySupporterWhereInputSchema),z.lazy(() => CountrySupporterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountrySupporterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountrySupporterWhereInputSchema),z.lazy(() => CountrySupporterWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  countryISOCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => CountryScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
}).strict();

export const CountrySupporterOrderByWithRelationInputSchema: z.ZodType<Prisma.CountrySupporterOrderByWithRelationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  countryISOCode: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => CountryOrderByWithRelationInputSchema).optional(),
  player: z.lazy(() => PlayerOrderByWithRelationInputSchema).optional(),
  _relevance: z.lazy(() => CountrySupporterOrderByRelevanceInputSchema).optional()
}).strict();

export const CountrySupporterWhereUniqueInputSchema: z.ZodType<Prisma.CountrySupporterWhereUniqueInput> = z.object({
  playerId_countryISOCode: z.lazy(() => CountrySupporterPlayerIdCountryISOCodeCompoundUniqueInputSchema)
})
.and(z.object({
  playerId_countryISOCode: z.lazy(() => CountrySupporterPlayerIdCountryISOCodeCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CountrySupporterWhereInputSchema),z.lazy(() => CountrySupporterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountrySupporterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountrySupporterWhereInputSchema),z.lazy(() => CountrySupporterWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  countryISOCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => CountryScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
}).strict());

export const CountrySupporterOrderByWithAggregationInputSchema: z.ZodType<Prisma.CountrySupporterOrderByWithAggregationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  countryISOCode: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CountrySupporterCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CountrySupporterAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CountrySupporterMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CountrySupporterMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CountrySupporterSumOrderByAggregateInputSchema).optional()
}).strict();

export const CountrySupporterScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CountrySupporterScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CountrySupporterScalarWhereWithAggregatesInputSchema),z.lazy(() => CountrySupporterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountrySupporterScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountrySupporterScalarWhereWithAggregatesInputSchema),z.lazy(() => CountrySupporterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  countryISOCode: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const DiffsWhereInputSchema: z.ZodType<Prisma.DiffsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DiffsWhereInputSchema),z.lazy(() => DiffsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DiffsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DiffsWhereInputSchema),z.lazy(() => DiffsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  a: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  b: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  diffAge: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  diffUnknownAge: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  diffGoalies: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  diffAverage: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  diffPlayed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const DiffsOrderByWithRelationInputSchema: z.ZodType<Prisma.DiffsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  a: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  b: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffAge: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffUnknownAge: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffGoalies: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffAverage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffPlayed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _relevance: z.lazy(() => DiffsOrderByRelevanceInputSchema).optional()
}).strict();

export const DiffsWhereUniqueInputSchema: z.ZodType<Prisma.DiffsWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DiffsWhereInputSchema),z.lazy(() => DiffsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DiffsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DiffsWhereInputSchema),z.lazy(() => DiffsWhereInputSchema).array() ]).optional(),
  a: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  b: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  diffAge: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  diffUnknownAge: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  diffGoalies: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  diffAverage: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  diffPlayed: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
}).strict());

export const DiffsOrderByWithAggregationInputSchema: z.ZodType<Prisma.DiffsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  a: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  b: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffAge: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffUnknownAge: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffGoalies: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffAverage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  diffPlayed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => DiffsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DiffsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DiffsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DiffsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DiffsSumOrderByAggregateInputSchema).optional()
}).strict();

export const DiffsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DiffsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DiffsScalarWhereWithAggregatesInputSchema),z.lazy(() => DiffsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DiffsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DiffsScalarWhereWithAggregatesInputSchema),z.lazy(() => DiffsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  a: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  b: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  diffAge: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  diffUnknownAge: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  diffGoalies: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  diffAverage: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  diffPlayed: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const GameChatWhereInputSchema: z.ZodType<Prisma.GameChatWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GameChatWhereInputSchema),z.lazy(() => GameChatWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameChatWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameChatWhereInputSchema),z.lazy(() => GameChatWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  gameDay: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  player: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  body: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const GameChatOrderByWithRelationInputSchema: z.ZodType<Prisma.GameChatOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional(),
  body: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _relevance: z.lazy(() => GameChatOrderByRelevanceInputSchema).optional()
}).strict();

export const GameChatWhereUniqueInputSchema: z.ZodType<Prisma.GameChatWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => GameChatWhereInputSchema),z.lazy(() => GameChatWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameChatWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameChatWhereInputSchema),z.lazy(() => GameChatWhereInputSchema).array() ]).optional(),
  gameDay: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  player: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  body: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict());

export const GameChatOrderByWithAggregationInputSchema: z.ZodType<Prisma.GameChatOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional(),
  body: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => GameChatCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => GameChatAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GameChatMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GameChatMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => GameChatSumOrderByAggregateInputSchema).optional()
}).strict();

export const GameChatScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GameChatScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GameChatScalarWhereWithAggregatesInputSchema),z.lazy(() => GameChatScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameChatScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameChatScalarWhereWithAggregatesInputSchema),z.lazy(() => GameChatScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  gameDay: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  player: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  body: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const GameDayWhereInputSchema: z.ZodType<Prisma.GameDayWhereInput> = z.object({
  AND: z.union([ z.lazy(() => GameDayWhereInputSchema),z.lazy(() => GameDayWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameDayWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameDayWhereInputSchema),z.lazy(() => GameDayWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  game: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  mailSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  outcomes: z.lazy(() => OutcomeListRelationFilterSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordListRelationFilterSchema).optional()
}).strict();

export const GameDayOrderByWithRelationInputSchema: z.ZodType<Prisma.GameDayOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  game: z.lazy(() => SortOrderSchema).optional(),
  mailSent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bibs: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pickerGamesHistory: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  outcomes: z.lazy(() => OutcomeOrderByRelationAggregateInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => GameDayOrderByRelevanceInputSchema).optional()
}).strict();

export const GameDayWhereUniqueInputSchema: z.ZodType<Prisma.GameDayWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => GameDayWhereInputSchema),z.lazy(() => GameDayWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameDayWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameDayWhereInputSchema),z.lazy(() => GameDayWhereInputSchema).array() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  game: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  mailSent: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  outcomes: z.lazy(() => OutcomeListRelationFilterSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordListRelationFilterSchema).optional()
}).strict());

export const GameDayOrderByWithAggregationInputSchema: z.ZodType<Prisma.GameDayOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  game: z.lazy(() => SortOrderSchema).optional(),
  mailSent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bibs: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pickerGamesHistory: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => GameDayCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => GameDayAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GameDayMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GameDayMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => GameDaySumOrderByAggregateInputSchema).optional()
}).strict();

export const GameDayScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.GameDayScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => GameDayScalarWhereWithAggregatesInputSchema),z.lazy(() => GameDayScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => GameDayScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => GameDayScalarWhereWithAggregatesInputSchema),z.lazy(() => GameDayScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  year: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  game: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  mailSent: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => EnumTeamNameNullableWithAggregatesFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const InvitationWhereInputSchema: z.ZodType<Prisma.InvitationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InvitationWhereInputSchema),z.lazy(() => InvitationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InvitationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InvitationWhereInputSchema),z.lazy(() => InvitationWhereInputSchema).array() ]).optional(),
  uuid: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const InvitationOrderByWithRelationInputSchema: z.ZodType<Prisma.InvitationOrderByWithRelationInput> = z.object({
  uuid: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  _relevance: z.lazy(() => InvitationOrderByRelevanceInputSchema).optional()
}).strict();

export const InvitationWhereUniqueInputSchema: z.ZodType<Prisma.InvitationWhereUniqueInput> = z.object({
  uuid: z.string()
})
.and(z.object({
  uuid: z.string().optional(),
  AND: z.union([ z.lazy(() => InvitationWhereInputSchema),z.lazy(() => InvitationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InvitationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InvitationWhereInputSchema),z.lazy(() => InvitationWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
}).strict());

export const InvitationOrderByWithAggregationInputSchema: z.ZodType<Prisma.InvitationOrderByWithAggregationInput> = z.object({
  uuid: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => InvitationCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InvitationAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InvitationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InvitationMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InvitationSumOrderByAggregateInputSchema).optional()
}).strict();

export const InvitationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InvitationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InvitationScalarWhereWithAggregatesInputSchema),z.lazy(() => InvitationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InvitationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InvitationScalarWhereWithAggregatesInputSchema),z.lazy(() => InvitationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  uuid: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const OutcomeWhereInputSchema: z.ZodType<Prisma.OutcomeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OutcomeWhereInputSchema),z.lazy(() => OutcomeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OutcomeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OutcomeWhereInputSchema),z.lazy(() => OutcomeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  response: z.union([ z.lazy(() => EnumPlayerResponseNullableFilterSchema),z.lazy(() => PlayerResponseSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  paid: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  gameDay: z.union([ z.lazy(() => GameDayScalarRelationFilterSchema),z.lazy(() => GameDayWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
}).strict();

export const OutcomeOrderByWithRelationInputSchema: z.ZodType<Prisma.OutcomeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  response: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  responseInterval: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  points: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  team: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pub: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  goalie: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => GameDayOrderByWithRelationInputSchema).optional(),
  player: z.lazy(() => PlayerOrderByWithRelationInputSchema).optional(),
  _relevance: z.lazy(() => OutcomeOrderByRelevanceInputSchema).optional()
}).strict();

export const OutcomeWhereUniqueInputSchema: z.ZodType<Prisma.OutcomeWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    gameDayId_playerId: z.lazy(() => OutcomeGameDayIdPlayerIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    gameDayId_playerId: z.lazy(() => OutcomeGameDayIdPlayerIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  gameDayId_playerId: z.lazy(() => OutcomeGameDayIdPlayerIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => OutcomeWhereInputSchema),z.lazy(() => OutcomeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OutcomeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OutcomeWhereInputSchema),z.lazy(() => OutcomeWhereInputSchema).array() ]).optional(),
  response: z.union([ z.lazy(() => EnumPlayerResponseNullableFilterSchema),z.lazy(() => PlayerResponseSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  paid: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  gameDay: z.union([ z.lazy(() => GameDayScalarRelationFilterSchema),z.lazy(() => GameDayWhereInputSchema) ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
}).strict());

export const OutcomeOrderByWithAggregationInputSchema: z.ZodType<Prisma.OutcomeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  response: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  responseInterval: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  points: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  team: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pub: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  paid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  goalie: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OutcomeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OutcomeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OutcomeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OutcomeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OutcomeSumOrderByAggregateInputSchema).optional()
}).strict();

export const OutcomeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OutcomeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OutcomeScalarWhereWithAggregatesInputSchema),z.lazy(() => OutcomeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OutcomeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OutcomeScalarWhereWithAggregatesInputSchema),z.lazy(() => OutcomeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  response: z.union([ z.lazy(() => EnumPlayerResponseNullableWithAggregatesFilterSchema),z.lazy(() => PlayerResponseSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableWithAggregatesFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  paid: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  gameDayId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const PickerWhereInputSchema: z.ZodType<Prisma.PickerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PickerWhereInputSchema),z.lazy(() => PickerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickerWhereInputSchema),z.lazy(() => PickerWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  playerName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  age: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  average: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const PickerOrderByWithRelationInputSchema: z.ZodType<Prisma.PickerOrderByWithRelationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  playerName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  age: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  average: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  goalie: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  played: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _relevance: z.lazy(() => PickerOrderByRelevanceInputSchema).optional()
}).strict();

export const PickerWhereUniqueInputSchema: z.ZodType<Prisma.PickerWhereUniqueInput> = z.object({
  playerId: z.number().int()
})
.and(z.object({
  playerId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PickerWhereInputSchema),z.lazy(() => PickerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickerWhereInputSchema),z.lazy(() => PickerWhereInputSchema).array() ]).optional(),
  playerName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  age: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  average: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
}).strict());

export const PickerOrderByWithAggregationInputSchema: z.ZodType<Prisma.PickerOrderByWithAggregationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  playerName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  age: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  average: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  goalie: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  played: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PickerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PickerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PickerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PickerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PickerSumOrderByAggregateInputSchema).optional()
}).strict();

export const PickerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PickerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PickerScalarWhereWithAggregatesInputSchema),z.lazy(() => PickerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickerScalarWhereWithAggregatesInputSchema),z.lazy(() => PickerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  playerName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  age: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  average: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const PickerTeamsWhereInputSchema: z.ZodType<Prisma.PickerTeamsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PickerTeamsWhereInputSchema),z.lazy(() => PickerTeamsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickerTeamsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickerTeamsWhereInputSchema),z.lazy(() => PickerTeamsWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
}).strict();

export const PickerTeamsOrderByWithRelationInputSchema: z.ZodType<Prisma.PickerTeamsOrderByWithRelationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  team: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const PickerTeamsWhereUniqueInputSchema: z.ZodType<Prisma.PickerTeamsWhereUniqueInput> = z.object({
  playerId: z.number().int()
})
.and(z.object({
  playerId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PickerTeamsWhereInputSchema),z.lazy(() => PickerTeamsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickerTeamsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickerTeamsWhereInputSchema),z.lazy(() => PickerTeamsWhereInputSchema).array() ]).optional(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
}).strict());

export const PickerTeamsOrderByWithAggregationInputSchema: z.ZodType<Prisma.PickerTeamsOrderByWithAggregationInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  team: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PickerTeamsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PickerTeamsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PickerTeamsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PickerTeamsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PickerTeamsSumOrderByAggregateInputSchema).optional()
}).strict();

export const PickerTeamsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PickerTeamsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PickerTeamsScalarWhereWithAggregatesInputSchema),z.lazy(() => PickerTeamsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickerTeamsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickerTeamsScalarWhereWithAggregatesInputSchema),z.lazy(() => PickerTeamsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableWithAggregatesFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
}).strict();

export const PlayerWhereInputSchema: z.ZodType<Prisma.PlayerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PlayerWhereInputSchema),z.lazy(() => PlayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerWhereInputSchema),z.lazy(() => PlayerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  login: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  anonymous: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  joined: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  finished: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  born: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  introducedBy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseListRelationFilterSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseListRelationFilterSchema).optional(),
  clubs: z.lazy(() => ClubSupporterListRelationFilterSchema).optional(),
  countries: z.lazy(() => CountrySupporterListRelationFilterSchema).optional(),
  outcomes: z.lazy(() => OutcomeListRelationFilterSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordListRelationFilterSchema).optional()
}).strict();

export const PlayerOrderByWithRelationInputSchema: z.ZodType<Prisma.PlayerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  login: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  anonymous: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  joined: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  finished: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  born: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  introducedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  arsesOfPlayer: z.lazy(() => ArseOrderByRelationAggregateInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseOrderByRelationAggregateInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterOrderByRelationAggregateInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterOrderByRelationAggregateInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeOrderByRelationAggregateInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => PlayerOrderByRelevanceInputSchema).optional()
}).strict();

export const PlayerWhereUniqueInputSchema: z.ZodType<Prisma.PlayerWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    login: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    login: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  login: z.string().optional(),
  AND: z.union([ z.lazy(() => PlayerWhereInputSchema),z.lazy(() => PlayerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerWhereInputSchema),z.lazy(() => PlayerWhereInputSchema).array() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  anonymous: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  joined: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  finished: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  born: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  introducedBy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseListRelationFilterSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseListRelationFilterSchema).optional(),
  clubs: z.lazy(() => ClubSupporterListRelationFilterSchema).optional(),
  countries: z.lazy(() => CountrySupporterListRelationFilterSchema).optional(),
  outcomes: z.lazy(() => OutcomeListRelationFilterSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordListRelationFilterSchema).optional()
}).strict());

export const PlayerOrderByWithAggregationInputSchema: z.ZodType<Prisma.PlayerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  login: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  anonymous: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  joined: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  finished: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  born: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  introducedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PlayerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PlayerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlayerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlayerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PlayerSumOrderByAggregateInputSchema).optional()
}).strict();

export const PlayerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PlayerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PlayerScalarWhereWithAggregatesInputSchema),z.lazy(() => PlayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerScalarWhereWithAggregatesInputSchema),z.lazy(() => PlayerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  login: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  anonymous: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  joined: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  finished: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  born: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  introducedBy: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const PlayerRecordWhereInputSchema: z.ZodType<Prisma.PlayerRecordWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PlayerRecordWhereInputSchema),z.lazy(() => PlayerRecordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerRecordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerRecordWhereInputSchema),z.lazy(() => PlayerRecordWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  responses: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  won: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  drawn: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  lost: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  averages: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  stalwart: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankPoints: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankAverages: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankStalwart: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankSpeedy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankPub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  speedy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
  gameDay: z.union([ z.lazy(() => GameDayScalarRelationFilterSchema),z.lazy(() => GameDayWhereInputSchema) ]).optional(),
}).strict();

export const PlayerRecordOrderByWithRelationInputSchema: z.ZodType<Prisma.PlayerRecordOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  played: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  won: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  drawn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lost: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  points: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  averages: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stalwart: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pub: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankPoints: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankAverages: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankAveragesUnqualified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankStalwart: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankSpeedy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankSpeedyUnqualified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankPub: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  speedy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => PlayerOrderByWithRelationInputSchema).optional(),
  gameDay: z.lazy(() => GameDayOrderByWithRelationInputSchema).optional()
}).strict();

export const PlayerRecordWhereUniqueInputSchema: z.ZodType<Prisma.PlayerRecordWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    playerId_year_gameDayId: z.lazy(() => PlayerRecordPlayerIdYearGameDayIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    playerId_year_gameDayId: z.lazy(() => PlayerRecordPlayerIdYearGameDayIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  playerId_year_gameDayId: z.lazy(() => PlayerRecordPlayerIdYearGameDayIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PlayerRecordWhereInputSchema),z.lazy(() => PlayerRecordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerRecordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerRecordWhereInputSchema),z.lazy(() => PlayerRecordWhereInputSchema).array() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  responses: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  won: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  drawn: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  lost: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  averages: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  stalwart: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankPoints: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankAverages: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankStalwart: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankSpeedy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  rankPub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  speedy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  player: z.union([ z.lazy(() => PlayerScalarRelationFilterSchema),z.lazy(() => PlayerWhereInputSchema) ]).optional(),
  gameDay: z.union([ z.lazy(() => GameDayScalarRelationFilterSchema),z.lazy(() => GameDayWhereInputSchema) ]).optional(),
}).strict());

export const PlayerRecordOrderByWithAggregationInputSchema: z.ZodType<Prisma.PlayerRecordOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  played: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  won: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  drawn: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lost: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  points: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  averages: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stalwart: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  pub: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankPoints: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankAverages: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankAveragesUnqualified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankStalwart: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankSpeedy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankSpeedyUnqualified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rankPub: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  speedy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PlayerRecordCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PlayerRecordAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PlayerRecordMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PlayerRecordMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PlayerRecordSumOrderByAggregateInputSchema).optional()
}).strict();

export const PlayerRecordScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PlayerRecordScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PlayerRecordScalarWhereWithAggregatesInputSchema),z.lazy(() => PlayerRecordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerRecordScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerRecordScalarWhereWithAggregatesInputSchema),z.lazy(() => PlayerRecordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  year: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  responses: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  won: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  drawn: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  lost: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  averages: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  stalwart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankPoints: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankAverages: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankStalwart: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankSpeedy: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rankPub: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  speedy: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  banned: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  banReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  banExpires: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  banned: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  banReason: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  banExpires: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  _relevance: z.lazy(() => UserOrderByRelevanceInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  banned: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  banReason: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  banExpires: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  banned: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  banReason: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  banExpires: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  banned: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  banReason: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  banExpires: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  impersonatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  impersonatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  _relevance: z.lazy(() => SessionOrderByRelevanceInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    token: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    token: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  impersonatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  impersonatedBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  impersonatedBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  idToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accessTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  _relevance: z.lazy(() => AccountOrderByRelevanceInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  idToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  accessTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationWhereInputSchema: z.ZodType<Prisma.VerificationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const VerificationOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _relevance: z.lazy(() => VerificationOrderByRelevanceInputSchema).optional()
}).strict();

export const VerificationWhereUniqueInputSchema: z.ZodType<Prisma.VerificationWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationWhereInputSchema),z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict());

export const VerificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => VerificationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  updatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ArseCreateInputSchema: z.ZodType<Prisma.ArseCreateInput> = z.object({
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  player: z.lazy(() => PlayerCreateNestedOneWithoutArsesOfPlayerInputSchema),
  rater: z.lazy(() => PlayerCreateNestedOneWithoutArsesByPlayerInputSchema)
}).strict();

export const ArseUncheckedCreateInputSchema: z.ZodType<Prisma.ArseUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  playerId: z.number().int(),
  raterId: z.number().int()
}).strict();

export const ArseUpdateInputSchema: z.ZodType<Prisma.ArseUpdateInput> = z.object({
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutArsesOfPlayerNestedInputSchema).optional(),
  rater: z.lazy(() => PlayerUpdateOneRequiredWithoutArsesByPlayerNestedInputSchema).optional()
}).strict();

export const ArseUncheckedUpdateInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArseCreateManyInputSchema: z.ZodType<Prisma.ArseCreateManyInput> = z.object({
  id: z.number().int().optional(),
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  playerId: z.number().int(),
  raterId: z.number().int()
}).strict();

export const ArseUpdateManyMutationInputSchema: z.ZodType<Prisma.ArseUpdateManyMutationInput> = z.object({
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ArseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  raterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClubCreateInputSchema: z.ZodType<Prisma.ClubCreateInput> = z.object({
  soccerwayId: z.number().int().optional().nullable(),
  clubName: z.string(),
  uri: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  supporters: z.lazy(() => ClubSupporterCreateNestedManyWithoutClubInputSchema).optional()
}).strict();

export const ClubUncheckedCreateInputSchema: z.ZodType<Prisma.ClubUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  soccerwayId: z.number().int().optional().nullable(),
  clubName: z.string(),
  uri: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  supporters: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutClubInputSchema).optional()
}).strict();

export const ClubUpdateInputSchema: z.ZodType<Prisma.ClubUpdateInput> = z.object({
  soccerwayId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clubName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uri: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  supporters: z.lazy(() => ClubSupporterUpdateManyWithoutClubNestedInputSchema).optional()
}).strict();

export const ClubUncheckedUpdateInputSchema: z.ZodType<Prisma.ClubUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  soccerwayId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clubName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uri: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  supporters: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutClubNestedInputSchema).optional()
}).strict();

export const ClubCreateManyInputSchema: z.ZodType<Prisma.ClubCreateManyInput> = z.object({
  id: z.number().int().optional(),
  soccerwayId: z.number().int().optional().nullable(),
  clubName: z.string(),
  uri: z.string().optional().nullable(),
  country: z.string().optional().nullable()
}).strict();

export const ClubUpdateManyMutationInputSchema: z.ZodType<Prisma.ClubUpdateManyMutationInput> = z.object({
  soccerwayId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clubName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uri: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClubUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClubUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  soccerwayId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clubName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uri: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClubSupporterCreateInputSchema: z.ZodType<Prisma.ClubSupporterCreateInput> = z.object({
  player: z.lazy(() => PlayerCreateNestedOneWithoutClubsInputSchema),
  club: z.lazy(() => ClubCreateNestedOneWithoutSupportersInputSchema)
}).strict();

export const ClubSupporterUncheckedCreateInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedCreateInput> = z.object({
  playerId: z.number().int(),
  clubId: z.number().int()
}).strict();

export const ClubSupporterUpdateInputSchema: z.ZodType<Prisma.ClubSupporterUpdateInput> = z.object({
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutClubsNestedInputSchema).optional(),
  club: z.lazy(() => ClubUpdateOneRequiredWithoutSupportersNestedInputSchema).optional()
}).strict();

export const ClubSupporterUncheckedUpdateInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clubId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClubSupporterCreateManyInputSchema: z.ZodType<Prisma.ClubSupporterCreateManyInput> = z.object({
  playerId: z.number().int(),
  clubId: z.number().int()
}).strict();

export const ClubSupporterUpdateManyMutationInputSchema: z.ZodType<Prisma.ClubSupporterUpdateManyMutationInput> = z.object({
}).strict();

export const ClubSupporterUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateManyInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  clubId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountryCreateInputSchema: z.ZodType<Prisma.CountryCreateInput> = z.object({
  isoCode: z.string(),
  name: z.string(),
  supporters: z.lazy(() => CountrySupporterCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateInputSchema: z.ZodType<Prisma.CountryUncheckedCreateInput> = z.object({
  isoCode: z.string(),
  name: z.string(),
  supporters: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUpdateInputSchema: z.ZodType<Prisma.CountryUpdateInput> = z.object({
  isoCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  supporters: z.lazy(() => CountrySupporterUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateInput> = z.object({
  isoCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  supporters: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryCreateManyInputSchema: z.ZodType<Prisma.CountryCreateManyInput> = z.object({
  isoCode: z.string(),
  name: z.string()
}).strict();

export const CountryUpdateManyMutationInputSchema: z.ZodType<Prisma.CountryUpdateManyMutationInput> = z.object({
  isoCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateManyInput> = z.object({
  isoCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountrySupporterCreateInputSchema: z.ZodType<Prisma.CountrySupporterCreateInput> = z.object({
  country: z.lazy(() => CountryCreateNestedOneWithoutSupportersInputSchema),
  player: z.lazy(() => PlayerCreateNestedOneWithoutCountriesInputSchema)
}).strict();

export const CountrySupporterUncheckedCreateInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedCreateInput> = z.object({
  playerId: z.number().int(),
  countryISOCode: z.string()
}).strict();

export const CountrySupporterUpdateInputSchema: z.ZodType<Prisma.CountrySupporterUpdateInput> = z.object({
  country: z.lazy(() => CountryUpdateOneRequiredWithoutSupportersNestedInputSchema).optional(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutCountriesNestedInputSchema).optional()
}).strict();

export const CountrySupporterUncheckedUpdateInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  countryISOCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountrySupporterCreateManyInputSchema: z.ZodType<Prisma.CountrySupporterCreateManyInput> = z.object({
  playerId: z.number().int(),
  countryISOCode: z.string()
}).strict();

export const CountrySupporterUpdateManyMutationInputSchema: z.ZodType<Prisma.CountrySupporterUpdateManyMutationInput> = z.object({
}).strict();

export const CountrySupporterUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateManyInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  countryISOCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DiffsCreateInputSchema: z.ZodType<Prisma.DiffsCreateInput> = z.object({
  a: z.string().optional().nullable(),
  b: z.string().optional().nullable(),
  diffAge: z.number().optional().nullable(),
  diffUnknownAge: z.number().int().optional().nullable(),
  diffGoalies: z.number().int().optional().nullable(),
  diffAverage: z.number().optional().nullable(),
  diffPlayed: z.number().int().optional().nullable()
}).strict();

export const DiffsUncheckedCreateInputSchema: z.ZodType<Prisma.DiffsUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  a: z.string().optional().nullable(),
  b: z.string().optional().nullable(),
  diffAge: z.number().optional().nullable(),
  diffUnknownAge: z.number().int().optional().nullable(),
  diffGoalies: z.number().int().optional().nullable(),
  diffAverage: z.number().optional().nullable(),
  diffPlayed: z.number().int().optional().nullable()
}).strict();

export const DiffsUpdateInputSchema: z.ZodType<Prisma.DiffsUpdateInput> = z.object({
  a: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  b: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAge: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffUnknownAge: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffGoalies: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAverage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffPlayed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DiffsUncheckedUpdateInputSchema: z.ZodType<Prisma.DiffsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  a: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  b: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAge: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffUnknownAge: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffGoalies: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAverage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffPlayed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DiffsCreateManyInputSchema: z.ZodType<Prisma.DiffsCreateManyInput> = z.object({
  id: z.number().int().optional(),
  a: z.string().optional().nullable(),
  b: z.string().optional().nullable(),
  diffAge: z.number().optional().nullable(),
  diffUnknownAge: z.number().int().optional().nullable(),
  diffGoalies: z.number().int().optional().nullable(),
  diffAverage: z.number().optional().nullable(),
  diffPlayed: z.number().int().optional().nullable()
}).strict();

export const DiffsUpdateManyMutationInputSchema: z.ZodType<Prisma.DiffsUpdateManyMutationInput> = z.object({
  a: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  b: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAge: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffUnknownAge: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffGoalies: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAverage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffPlayed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DiffsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DiffsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  a: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  b: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAge: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffUnknownAge: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffGoalies: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffAverage: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  diffPlayed: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameChatCreateInputSchema: z.ZodType<Prisma.GameChatCreateInput> = z.object({
  gameDay: z.number().int(),
  stamp: z.coerce.date().optional(),
  player: z.number().int(),
  body: z.string().optional().nullable()
}).strict();

export const GameChatUncheckedCreateInputSchema: z.ZodType<Prisma.GameChatUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  gameDay: z.number().int(),
  stamp: z.coerce.date().optional(),
  player: z.number().int(),
  body: z.string().optional().nullable()
}).strict();

export const GameChatUpdateInputSchema: z.ZodType<Prisma.GameChatUpdateInput> = z.object({
  gameDay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  player: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameChatUncheckedUpdateInputSchema: z.ZodType<Prisma.GameChatUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  player: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameChatCreateManyInputSchema: z.ZodType<Prisma.GameChatCreateManyInput> = z.object({
  id: z.number().int().optional(),
  gameDay: z.number().int(),
  stamp: z.coerce.date().optional(),
  player: z.number().int(),
  body: z.string().optional().nullable()
}).strict();

export const GameChatUpdateManyMutationInputSchema: z.ZodType<Prisma.GameChatUpdateManyMutationInput> = z.object({
  gameDay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  player: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameChatUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GameChatUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDay: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  player: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  body: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameDayCreateInputSchema: z.ZodType<Prisma.GameDayCreateInput> = z.object({
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutGameDayInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutGameDayInputSchema).optional()
}).strict();

export const GameDayUncheckedCreateInputSchema: z.ZodType<Prisma.GameDayUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutGameDayInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutGameDayInputSchema).optional()
}).strict();

export const GameDayUpdateInputSchema: z.ZodType<Prisma.GameDayUpdateInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutGameDayNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutGameDayNestedInputSchema).optional()
}).strict();

export const GameDayUncheckedUpdateInputSchema: z.ZodType<Prisma.GameDayUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutGameDayNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutGameDayNestedInputSchema).optional()
}).strict();

export const GameDayCreateManyInputSchema: z.ZodType<Prisma.GameDayCreateManyInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable()
}).strict();

export const GameDayUpdateManyMutationInputSchema: z.ZodType<Prisma.GameDayUpdateManyMutationInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const GameDayUncheckedUpdateManyInputSchema: z.ZodType<Prisma.GameDayUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const InvitationCreateInputSchema: z.ZodType<Prisma.InvitationCreateInput> = z.object({
  uuid: z.string(),
  playerId: z.number().int(),
  gameDayId: z.number().int()
}).strict();

export const InvitationUncheckedCreateInputSchema: z.ZodType<Prisma.InvitationUncheckedCreateInput> = z.object({
  uuid: z.string(),
  playerId: z.number().int(),
  gameDayId: z.number().int()
}).strict();

export const InvitationUpdateInputSchema: z.ZodType<Prisma.InvitationUpdateInput> = z.object({
  uuid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InvitationUncheckedUpdateInputSchema: z.ZodType<Prisma.InvitationUncheckedUpdateInput> = z.object({
  uuid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InvitationCreateManyInputSchema: z.ZodType<Prisma.InvitationCreateManyInput> = z.object({
  uuid: z.string(),
  playerId: z.number().int(),
  gameDayId: z.number().int()
}).strict();

export const InvitationUpdateManyMutationInputSchema: z.ZodType<Prisma.InvitationUpdateManyMutationInput> = z.object({
  uuid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InvitationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InvitationUncheckedUpdateManyInput> = z.object({
  uuid: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OutcomeCreateInputSchema: z.ZodType<Prisma.OutcomeCreateInput> = z.object({
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  gameDay: z.lazy(() => GameDayCreateNestedOneWithoutOutcomesInputSchema),
  player: z.lazy(() => PlayerCreateNestedOneWithoutOutcomesInputSchema)
}).strict();

export const OutcomeUncheckedCreateInputSchema: z.ZodType<Prisma.OutcomeUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  gameDayId: z.number().int(),
  playerId: z.number().int()
}).strict();

export const OutcomeUpdateInputSchema: z.ZodType<Prisma.OutcomeUpdateInput> = z.object({
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDay: z.lazy(() => GameDayUpdateOneRequiredWithoutOutcomesNestedInputSchema).optional(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutOutcomesNestedInputSchema).optional()
}).strict();

export const OutcomeUncheckedUpdateInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OutcomeCreateManyInputSchema: z.ZodType<Prisma.OutcomeCreateManyInput> = z.object({
  id: z.number().int().optional(),
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  gameDayId: z.number().int(),
  playerId: z.number().int()
}).strict();

export const OutcomeUpdateManyMutationInputSchema: z.ZodType<Prisma.OutcomeUpdateManyMutationInput> = z.object({
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const OutcomeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PickerCreateInputSchema: z.ZodType<Prisma.PickerCreateInput> = z.object({
  playerId: z.number().int(),
  playerName: z.string().optional().nullable(),
  age: z.number().int().optional().nullable(),
  average: z.number().optional().nullable(),
  goalie: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable()
}).strict();

export const PickerUncheckedCreateInputSchema: z.ZodType<Prisma.PickerUncheckedCreateInput> = z.object({
  playerId: z.number().int(),
  playerName: z.string().optional().nullable(),
  age: z.number().int().optional().nullable(),
  average: z.number().optional().nullable(),
  goalie: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable()
}).strict();

export const PickerUpdateInputSchema: z.ZodType<Prisma.PickerUpdateInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  playerName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  average: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerUncheckedUpdateInputSchema: z.ZodType<Prisma.PickerUncheckedUpdateInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  playerName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  average: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerCreateManyInputSchema: z.ZodType<Prisma.PickerCreateManyInput> = z.object({
  playerId: z.number().int(),
  playerName: z.string().optional().nullable(),
  age: z.number().int().optional().nullable(),
  average: z.number().optional().nullable(),
  goalie: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable()
}).strict();

export const PickerUpdateManyMutationInputSchema: z.ZodType<Prisma.PickerUpdateManyMutationInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  playerName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  average: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PickerUncheckedUpdateManyInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  playerName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  age: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  average: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerTeamsCreateInputSchema: z.ZodType<Prisma.PickerTeamsCreateInput> = z.object({
  playerId: z.number().int(),
  team: z.lazy(() => TeamNameSchema).optional().nullable()
}).strict();

export const PickerTeamsUncheckedCreateInputSchema: z.ZodType<Prisma.PickerTeamsUncheckedCreateInput> = z.object({
  playerId: z.number().int(),
  team: z.lazy(() => TeamNameSchema).optional().nullable()
}).strict();

export const PickerTeamsUpdateInputSchema: z.ZodType<Prisma.PickerTeamsUpdateInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerTeamsUncheckedUpdateInputSchema: z.ZodType<Prisma.PickerTeamsUncheckedUpdateInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerTeamsCreateManyInputSchema: z.ZodType<Prisma.PickerTeamsCreateManyInput> = z.object({
  playerId: z.number().int(),
  team: z.lazy(() => TeamNameSchema).optional().nullable()
}).strict();

export const PickerTeamsUpdateManyMutationInputSchema: z.ZodType<Prisma.PickerTeamsUpdateManyMutationInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickerTeamsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PickerTeamsUncheckedUpdateManyInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PlayerCreateInputSchema: z.ZodType<Prisma.PlayerCreateInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUpdateInputSchema: z.ZodType<Prisma.PlayerUpdateInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerCreateManyInputSchema: z.ZodType<Prisma.PlayerCreateManyInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable()
}).strict();

export const PlayerUpdateManyMutationInputSchema: z.ZodType<Prisma.PlayerUpdateManyMutationInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PlayerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PlayerRecordCreateInputSchema: z.ZodType<Prisma.PlayerRecordCreateInput> = z.object({
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  player: z.lazy(() => PlayerCreateNestedOneWithoutPlayerRecordsInputSchema),
  gameDay: z.lazy(() => GameDayCreateNestedOneWithoutPlayerRecordsInputSchema)
}).strict();

export const PlayerRecordUncheckedCreateInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  playerId: z.number().int(),
  gameDayId: z.number().int()
}).strict();

export const PlayerRecordUpdateInputSchema: z.ZodType<Prisma.PlayerRecordUpdateInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutPlayerRecordsNestedInputSchema).optional(),
  gameDay: z.lazy(() => GameDayUpdateOneRequiredWithoutPlayerRecordsNestedInputSchema).optional()
}).strict();

export const PlayerRecordUncheckedUpdateInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlayerRecordCreateManyInputSchema: z.ZodType<Prisma.PlayerRecordCreateManyInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  playerId: z.number().int(),
  gameDayId: z.number().int()
}).strict();

export const PlayerRecordUpdateManyMutationInputSchema: z.ZodType<Prisma.PlayerRecordUpdateManyMutationInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PlayerRecordUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  impersonatedBy: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().optional().nullable()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  userId: z.string(),
  impersonatedBy: z.string().optional().nullable()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationCreateInputSchema: z.ZodType<Prisma.VerificationCreateInput> = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable()
}).strict();

export const VerificationUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationUncheckedCreateInput> = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable()
}).strict();

export const VerificationUpdateInputSchema: z.ZodType<Prisma.VerificationUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationCreateManyInputSchema: z.ZodType<Prisma.VerificationCreateManyInput> = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable()
}).strict();

export const VerificationUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VerificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const PlayerScalarRelationFilterSchema: z.ZodType<Prisma.PlayerScalarRelationFilter> = z.object({
  is: z.lazy(() => PlayerWhereInputSchema).optional(),
  isNot: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ArsePlayerIdRaterIdCompoundUniqueInputSchema: z.ZodType<Prisma.ArsePlayerIdRaterIdCompoundUniqueInput> = z.object({
  playerId: z.number(),
  raterId: z.number()
}).strict();

export const ArseCountOrderByAggregateInputSchema: z.ZodType<Prisma.ArseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.lazy(() => SortOrderSchema).optional(),
  running: z.lazy(() => SortOrderSchema).optional(),
  shooting: z.lazy(() => SortOrderSchema).optional(),
  passing: z.lazy(() => SortOrderSchema).optional(),
  ballSkill: z.lazy(() => SortOrderSchema).optional(),
  attacking: z.lazy(() => SortOrderSchema).optional(),
  defending: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ArseAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.lazy(() => SortOrderSchema).optional(),
  running: z.lazy(() => SortOrderSchema).optional(),
  shooting: z.lazy(() => SortOrderSchema).optional(),
  passing: z.lazy(() => SortOrderSchema).optional(),
  ballSkill: z.lazy(() => SortOrderSchema).optional(),
  attacking: z.lazy(() => SortOrderSchema).optional(),
  defending: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ArseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.lazy(() => SortOrderSchema).optional(),
  running: z.lazy(() => SortOrderSchema).optional(),
  shooting: z.lazy(() => SortOrderSchema).optional(),
  passing: z.lazy(() => SortOrderSchema).optional(),
  ballSkill: z.lazy(() => SortOrderSchema).optional(),
  attacking: z.lazy(() => SortOrderSchema).optional(),
  defending: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArseMinOrderByAggregateInputSchema: z.ZodType<Prisma.ArseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.lazy(() => SortOrderSchema).optional(),
  running: z.lazy(() => SortOrderSchema).optional(),
  shooting: z.lazy(() => SortOrderSchema).optional(),
  passing: z.lazy(() => SortOrderSchema).optional(),
  ballSkill: z.lazy(() => SortOrderSchema).optional(),
  attacking: z.lazy(() => SortOrderSchema).optional(),
  defending: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArseSumOrderByAggregateInputSchema: z.ZodType<Prisma.ArseSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  inGoal: z.lazy(() => SortOrderSchema).optional(),
  running: z.lazy(() => SortOrderSchema).optional(),
  shooting: z.lazy(() => SortOrderSchema).optional(),
  passing: z.lazy(() => SortOrderSchema).optional(),
  ballSkill: z.lazy(() => SortOrderSchema).optional(),
  attacking: z.lazy(() => SortOrderSchema).optional(),
  defending: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  raterId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const ClubSupporterListRelationFilterSchema: z.ZodType<Prisma.ClubSupporterListRelationFilter> = z.object({
  every: z.lazy(() => ClubSupporterWhereInputSchema).optional(),
  some: z.lazy(() => ClubSupporterWhereInputSchema).optional(),
  none: z.lazy(() => ClubSupporterWhereInputSchema).optional()
}).strict();

export const ClubSupporterOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ClubSupporterOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubOrderByRelevanceInputSchema: z.ZodType<Prisma.ClubOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => ClubOrderByRelevanceFieldEnumSchema),z.lazy(() => ClubOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const ClubCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClubCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.lazy(() => SortOrderSchema).optional(),
  clubName: z.lazy(() => SortOrderSchema).optional(),
  uri: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClubAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClubMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.lazy(() => SortOrderSchema).optional(),
  clubName: z.lazy(() => SortOrderSchema).optional(),
  uri: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClubMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.lazy(() => SortOrderSchema).optional(),
  clubName: z.lazy(() => SortOrderSchema).optional(),
  uri: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubSumOrderByAggregateInputSchema: z.ZodType<Prisma.ClubSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  soccerwayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const ClubScalarRelationFilterSchema: z.ZodType<Prisma.ClubScalarRelationFilter> = z.object({
  is: z.lazy(() => ClubWhereInputSchema).optional(),
  isNot: z.lazy(() => ClubWhereInputSchema).optional()
}).strict();

export const ClubSupporterPlayerIdClubIdCompoundUniqueInputSchema: z.ZodType<Prisma.ClubSupporterPlayerIdClubIdCompoundUniqueInput> = z.object({
  playerId: z.number(),
  clubId: z.number()
}).strict();

export const ClubSupporterCountOrderByAggregateInputSchema: z.ZodType<Prisma.ClubSupporterCountOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubSupporterAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ClubSupporterAvgOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubSupporterMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ClubSupporterMaxOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubSupporterMinOrderByAggregateInputSchema: z.ZodType<Prisma.ClubSupporterMinOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ClubSupporterSumOrderByAggregateInputSchema: z.ZodType<Prisma.ClubSupporterSumOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  clubId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountrySupporterListRelationFilterSchema: z.ZodType<Prisma.CountrySupporterListRelationFilter> = z.object({
  every: z.lazy(() => CountrySupporterWhereInputSchema).optional(),
  some: z.lazy(() => CountrySupporterWhereInputSchema).optional(),
  none: z.lazy(() => CountrySupporterWhereInputSchema).optional()
}).strict();

export const CountrySupporterOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CountrySupporterOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryOrderByRelevanceInputSchema: z.ZodType<Prisma.CountryOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => CountryOrderByRelevanceFieldEnumSchema),z.lazy(() => CountryOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const CountryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CountryCountOrderByAggregateInput> = z.object({
  isoCode: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CountryMaxOrderByAggregateInput> = z.object({
  isoCode: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CountryMinOrderByAggregateInput> = z.object({
  isoCode: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryScalarRelationFilterSchema: z.ZodType<Prisma.CountryScalarRelationFilter> = z.object({
  is: z.lazy(() => CountryWhereInputSchema).optional(),
  isNot: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const CountrySupporterOrderByRelevanceInputSchema: z.ZodType<Prisma.CountrySupporterOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => CountrySupporterOrderByRelevanceFieldEnumSchema),z.lazy(() => CountrySupporterOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const CountrySupporterPlayerIdCountryISOCodeCompoundUniqueInputSchema: z.ZodType<Prisma.CountrySupporterPlayerIdCountryISOCodeCompoundUniqueInput> = z.object({
  playerId: z.number(),
  countryISOCode: z.string()
}).strict();

export const CountrySupporterCountOrderByAggregateInputSchema: z.ZodType<Prisma.CountrySupporterCountOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  countryISOCode: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountrySupporterAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CountrySupporterAvgOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountrySupporterMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CountrySupporterMaxOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  countryISOCode: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountrySupporterMinOrderByAggregateInputSchema: z.ZodType<Prisma.CountrySupporterMinOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  countryISOCode: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountrySupporterSumOrderByAggregateInputSchema: z.ZodType<Prisma.CountrySupporterSumOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DiffsOrderByRelevanceInputSchema: z.ZodType<Prisma.DiffsOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => DiffsOrderByRelevanceFieldEnumSchema),z.lazy(() => DiffsOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const DiffsCountOrderByAggregateInputSchema: z.ZodType<Prisma.DiffsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  a: z.lazy(() => SortOrderSchema).optional(),
  b: z.lazy(() => SortOrderSchema).optional(),
  diffAge: z.lazy(() => SortOrderSchema).optional(),
  diffUnknownAge: z.lazy(() => SortOrderSchema).optional(),
  diffGoalies: z.lazy(() => SortOrderSchema).optional(),
  diffAverage: z.lazy(() => SortOrderSchema).optional(),
  diffPlayed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DiffsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DiffsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  diffAge: z.lazy(() => SortOrderSchema).optional(),
  diffUnknownAge: z.lazy(() => SortOrderSchema).optional(),
  diffGoalies: z.lazy(() => SortOrderSchema).optional(),
  diffAverage: z.lazy(() => SortOrderSchema).optional(),
  diffPlayed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DiffsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DiffsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  a: z.lazy(() => SortOrderSchema).optional(),
  b: z.lazy(() => SortOrderSchema).optional(),
  diffAge: z.lazy(() => SortOrderSchema).optional(),
  diffUnknownAge: z.lazy(() => SortOrderSchema).optional(),
  diffGoalies: z.lazy(() => SortOrderSchema).optional(),
  diffAverage: z.lazy(() => SortOrderSchema).optional(),
  diffPlayed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DiffsMinOrderByAggregateInputSchema: z.ZodType<Prisma.DiffsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  a: z.lazy(() => SortOrderSchema).optional(),
  b: z.lazy(() => SortOrderSchema).optional(),
  diffAge: z.lazy(() => SortOrderSchema).optional(),
  diffUnknownAge: z.lazy(() => SortOrderSchema).optional(),
  diffGoalies: z.lazy(() => SortOrderSchema).optional(),
  diffAverage: z.lazy(() => SortOrderSchema).optional(),
  diffPlayed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DiffsSumOrderByAggregateInputSchema: z.ZodType<Prisma.DiffsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  diffAge: z.lazy(() => SortOrderSchema).optional(),
  diffUnknownAge: z.lazy(() => SortOrderSchema).optional(),
  diffGoalies: z.lazy(() => SortOrderSchema).optional(),
  diffAverage: z.lazy(() => SortOrderSchema).optional(),
  diffPlayed: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const GameChatOrderByRelevanceInputSchema: z.ZodType<Prisma.GameChatOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => GameChatOrderByRelevanceFieldEnumSchema),z.lazy(() => GameChatOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const GameChatCountOrderByAggregateInputSchema: z.ZodType<Prisma.GameChatCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameChatAvgOrderByAggregateInputSchema: z.ZodType<Prisma.GameChatAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameChatMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GameChatMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameChatMinOrderByAggregateInputSchema: z.ZodType<Prisma.GameChatMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  stamp: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional(),
  body: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameChatSumOrderByAggregateInputSchema: z.ZodType<Prisma.GameChatSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  gameDay: z.lazy(() => SortOrderSchema).optional(),
  player: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumTeamNameNullableFilterSchema: z.ZodType<Prisma.EnumTeamNameNullableFilter> = z.object({
  equals: z.lazy(() => TeamNameSchema).optional().nullable(),
  in: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  notIn: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NestedEnumTeamNameNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const OutcomeListRelationFilterSchema: z.ZodType<Prisma.OutcomeListRelationFilter> = z.object({
  every: z.lazy(() => OutcomeWhereInputSchema).optional(),
  some: z.lazy(() => OutcomeWhereInputSchema).optional(),
  none: z.lazy(() => OutcomeWhereInputSchema).optional()
}).strict();

export const PlayerRecordListRelationFilterSchema: z.ZodType<Prisma.PlayerRecordListRelationFilter> = z.object({
  every: z.lazy(() => PlayerRecordWhereInputSchema).optional(),
  some: z.lazy(() => PlayerRecordWhereInputSchema).optional(),
  none: z.lazy(() => PlayerRecordWhereInputSchema).optional()
}).strict();

export const OutcomeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OutcomeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerRecordOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PlayerRecordOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameDayOrderByRelevanceInputSchema: z.ZodType<Prisma.GameDayOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => GameDayOrderByRelevanceFieldEnumSchema),z.lazy(() => GameDayOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const GameDayCountOrderByAggregateInputSchema: z.ZodType<Prisma.GameDayCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  game: z.lazy(() => SortOrderSchema).optional(),
  mailSent: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  bibs: z.lazy(() => SortOrderSchema).optional(),
  pickerGamesHistory: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameDayAvgOrderByAggregateInputSchema: z.ZodType<Prisma.GameDayAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  pickerGamesHistory: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameDayMaxOrderByAggregateInputSchema: z.ZodType<Prisma.GameDayMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  game: z.lazy(() => SortOrderSchema).optional(),
  mailSent: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  bibs: z.lazy(() => SortOrderSchema).optional(),
  pickerGamesHistory: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameDayMinOrderByAggregateInputSchema: z.ZodType<Prisma.GameDayMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  game: z.lazy(() => SortOrderSchema).optional(),
  mailSent: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  bibs: z.lazy(() => SortOrderSchema).optional(),
  pickerGamesHistory: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const GameDaySumOrderByAggregateInputSchema: z.ZodType<Prisma.GameDaySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  pickerGamesHistory: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const EnumTeamNameNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTeamNameNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TeamNameSchema).optional().nullable(),
  in: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  notIn: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NestedEnumTeamNameNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTeamNameNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTeamNameNullableFilterSchema).optional()
}).strict();

export const InvitationOrderByRelevanceInputSchema: z.ZodType<Prisma.InvitationOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => InvitationOrderByRelevanceFieldEnumSchema),z.lazy(() => InvitationOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const InvitationCountOrderByAggregateInputSchema: z.ZodType<Prisma.InvitationCountOrderByAggregateInput> = z.object({
  uuid: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InvitationAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InvitationAvgOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InvitationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InvitationMaxOrderByAggregateInput> = z.object({
  uuid: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InvitationMinOrderByAggregateInputSchema: z.ZodType<Prisma.InvitationMinOrderByAggregateInput> = z.object({
  uuid: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InvitationSumOrderByAggregateInputSchema: z.ZodType<Prisma.InvitationSumOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPlayerResponseNullableFilterSchema: z.ZodType<Prisma.EnumPlayerResponseNullableFilter> = z.object({
  equals: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  in: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  notIn: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NestedEnumPlayerResponseNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const GameDayScalarRelationFilterSchema: z.ZodType<Prisma.GameDayScalarRelationFilter> = z.object({
  is: z.lazy(() => GameDayWhereInputSchema).optional(),
  isNot: z.lazy(() => GameDayWhereInputSchema).optional()
}).strict();

export const OutcomeOrderByRelevanceInputSchema: z.ZodType<Prisma.OutcomeOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => OutcomeOrderByRelevanceFieldEnumSchema),z.lazy(() => OutcomeOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const OutcomeGameDayIdPlayerIdCompoundUniqueInputSchema: z.ZodType<Prisma.OutcomeGameDayIdPlayerIdCompoundUniqueInput> = z.object({
  gameDayId: z.number(),
  playerId: z.number()
}).strict();

export const OutcomeCountOrderByAggregateInputSchema: z.ZodType<Prisma.OutcomeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  response: z.lazy(() => SortOrderSchema).optional(),
  responseInterval: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  team: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  paid: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OutcomeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OutcomeAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  responseInterval: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OutcomeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OutcomeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  response: z.lazy(() => SortOrderSchema).optional(),
  responseInterval: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  team: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  paid: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OutcomeMinOrderByAggregateInputSchema: z.ZodType<Prisma.OutcomeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  response: z.lazy(() => SortOrderSchema).optional(),
  responseInterval: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  team: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  paid: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OutcomeSumOrderByAggregateInputSchema: z.ZodType<Prisma.OutcomeSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  responseInterval: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPlayerResponseNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPlayerResponseNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  in: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  notIn: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NestedEnumPlayerResponseNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPlayerResponseNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPlayerResponseNullableFilterSchema).optional()
}).strict();

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const PickerOrderByRelevanceInputSchema: z.ZodType<Prisma.PickerOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => PickerOrderByRelevanceFieldEnumSchema),z.lazy(() => PickerOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const PickerCountOrderByAggregateInputSchema: z.ZodType<Prisma.PickerCountOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  playerName: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  average: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PickerAvgOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  average: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PickerMaxOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  playerName: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  average: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerMinOrderByAggregateInputSchema: z.ZodType<Prisma.PickerMinOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  playerName: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  average: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerSumOrderByAggregateInputSchema: z.ZodType<Prisma.PickerSumOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  average: z.lazy(() => SortOrderSchema).optional(),
  goalie: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerTeamsCountOrderByAggregateInputSchema: z.ZodType<Prisma.PickerTeamsCountOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  team: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerTeamsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PickerTeamsAvgOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerTeamsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PickerTeamsMaxOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  team: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerTeamsMinOrderByAggregateInputSchema: z.ZodType<Prisma.PickerTeamsMinOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional(),
  team: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickerTeamsSumOrderByAggregateInputSchema: z.ZodType<Prisma.PickerTeamsSumOrderByAggregateInput> = z.object({
  playerId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ArseListRelationFilterSchema: z.ZodType<Prisma.ArseListRelationFilter> = z.object({
  every: z.lazy(() => ArseWhereInputSchema).optional(),
  some: z.lazy(() => ArseWhereInputSchema).optional(),
  none: z.lazy(() => ArseWhereInputSchema).optional()
}).strict();

export const ArseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ArseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerOrderByRelevanceInputSchema: z.ZodType<Prisma.PlayerOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => PlayerOrderByRelevanceFieldEnumSchema),z.lazy(() => PlayerOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const PlayerCountOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  login: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  anonymous: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  joined: z.lazy(() => SortOrderSchema).optional(),
  finished: z.lazy(() => SortOrderSchema).optional(),
  born: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  introducedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  introducedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  login: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  anonymous: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  joined: z.lazy(() => SortOrderSchema).optional(),
  finished: z.lazy(() => SortOrderSchema).optional(),
  born: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  introducedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerMinOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  login: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  anonymous: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  joined: z.lazy(() => SortOrderSchema).optional(),
  finished: z.lazy(() => SortOrderSchema).optional(),
  born: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  introducedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerSumOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  introducedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerRecordPlayerIdYearGameDayIdCompoundUniqueInputSchema: z.ZodType<Prisma.PlayerRecordPlayerIdYearGameDayIdCompoundUniqueInput> = z.object({
  playerId: z.number(),
  year: z.number(),
  gameDayId: z.number()
}).strict();

export const PlayerRecordCountOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerRecordCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional(),
  won: z.lazy(() => SortOrderSchema).optional(),
  drawn: z.lazy(() => SortOrderSchema).optional(),
  lost: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  averages: z.lazy(() => SortOrderSchema).optional(),
  stalwart: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  rankPoints: z.lazy(() => SortOrderSchema).optional(),
  rankAverages: z.lazy(() => SortOrderSchema).optional(),
  rankAveragesUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankStalwart: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedy: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedyUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankPub: z.lazy(() => SortOrderSchema).optional(),
  speedy: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerRecordAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerRecordAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional(),
  won: z.lazy(() => SortOrderSchema).optional(),
  drawn: z.lazy(() => SortOrderSchema).optional(),
  lost: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  averages: z.lazy(() => SortOrderSchema).optional(),
  stalwart: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  rankPoints: z.lazy(() => SortOrderSchema).optional(),
  rankAverages: z.lazy(() => SortOrderSchema).optional(),
  rankAveragesUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankStalwart: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedy: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedyUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankPub: z.lazy(() => SortOrderSchema).optional(),
  speedy: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerRecordMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerRecordMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional(),
  won: z.lazy(() => SortOrderSchema).optional(),
  drawn: z.lazy(() => SortOrderSchema).optional(),
  lost: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  averages: z.lazy(() => SortOrderSchema).optional(),
  stalwart: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  rankPoints: z.lazy(() => SortOrderSchema).optional(),
  rankAverages: z.lazy(() => SortOrderSchema).optional(),
  rankAveragesUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankStalwart: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedy: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedyUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankPub: z.lazy(() => SortOrderSchema).optional(),
  speedy: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerRecordMinOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerRecordMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional(),
  won: z.lazy(() => SortOrderSchema).optional(),
  drawn: z.lazy(() => SortOrderSchema).optional(),
  lost: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  averages: z.lazy(() => SortOrderSchema).optional(),
  stalwart: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  rankPoints: z.lazy(() => SortOrderSchema).optional(),
  rankAverages: z.lazy(() => SortOrderSchema).optional(),
  rankAveragesUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankStalwart: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedy: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedyUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankPub: z.lazy(() => SortOrderSchema).optional(),
  speedy: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerRecordSumOrderByAggregateInputSchema: z.ZodType<Prisma.PlayerRecordSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  year: z.lazy(() => SortOrderSchema).optional(),
  responses: z.lazy(() => SortOrderSchema).optional(),
  played: z.lazy(() => SortOrderSchema).optional(),
  won: z.lazy(() => SortOrderSchema).optional(),
  drawn: z.lazy(() => SortOrderSchema).optional(),
  lost: z.lazy(() => SortOrderSchema).optional(),
  points: z.lazy(() => SortOrderSchema).optional(),
  averages: z.lazy(() => SortOrderSchema).optional(),
  stalwart: z.lazy(() => SortOrderSchema).optional(),
  pub: z.lazy(() => SortOrderSchema).optional(),
  rankPoints: z.lazy(() => SortOrderSchema).optional(),
  rankAverages: z.lazy(() => SortOrderSchema).optional(),
  rankAveragesUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankStalwart: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedy: z.lazy(() => SortOrderSchema).optional(),
  rankSpeedyUnqualified: z.lazy(() => SortOrderSchema).optional(),
  rankPub: z.lazy(() => SortOrderSchema).optional(),
  speedy: z.lazy(() => SortOrderSchema).optional(),
  playerId: z.lazy(() => SortOrderSchema).optional(),
  gameDayId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOrderByRelevanceInputSchema: z.ZodType<Prisma.UserOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => UserOrderByRelevanceFieldEnumSchema),z.lazy(() => UserOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  banReason: z.lazy(() => SortOrderSchema).optional(),
  banExpires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  banReason: z.lazy(() => SortOrderSchema).optional(),
  banExpires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  banned: z.lazy(() => SortOrderSchema).optional(),
  banReason: z.lazy(() => SortOrderSchema).optional(),
  banExpires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const SessionOrderByRelevanceInputSchema: z.ZodType<Prisma.SessionOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => SessionOrderByRelevanceFieldEnumSchema),z.lazy(() => SessionOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  impersonatedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  impersonatedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  impersonatedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountOrderByRelevanceInputSchema: z.ZodType<Prisma.AccountOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => AccountOrderByRelevanceFieldEnumSchema),z.lazy(() => AccountOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationOrderByRelevanceInputSchema: z.ZodType<Prisma.VerificationOrderByRelevanceInput> = z.object({
  fields: z.union([ z.lazy(() => VerificationOrderByRelevanceFieldEnumSchema),z.lazy(() => VerificationOrderByRelevanceFieldEnumSchema).array() ]),
  sort: z.lazy(() => SortOrderSchema),
  search: z.string()
}).strict();

export const VerificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PlayerCreateNestedOneWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerCreateNestedOneWithoutArsesOfPlayerInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesOfPlayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutArsesOfPlayerInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional()
}).strict();

export const PlayerCreateNestedOneWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerCreateNestedOneWithoutArsesByPlayerInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesByPlayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutArsesByPlayerInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const PlayerUpdateOneRequiredWithoutArsesOfPlayerNestedInputSchema: z.ZodType<Prisma.PlayerUpdateOneRequiredWithoutArsesOfPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesOfPlayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutArsesOfPlayerInputSchema).optional(),
  upsert: z.lazy(() => PlayerUpsertWithoutArsesOfPlayerInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlayerUpdateToOneWithWhereWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUpdateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutArsesOfPlayerInputSchema) ]).optional(),
}).strict();

export const PlayerUpdateOneRequiredWithoutArsesByPlayerNestedInputSchema: z.ZodType<Prisma.PlayerUpdateOneRequiredWithoutArsesByPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesByPlayerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutArsesByPlayerInputSchema).optional(),
  upsert: z.lazy(() => PlayerUpsertWithoutArsesByPlayerInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlayerUpdateToOneWithWhereWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUpdateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutArsesByPlayerInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ClubSupporterCreateNestedManyWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterCreateNestedManyWithoutClubInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateWithoutClubInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyClubInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClubSupporterUncheckedCreateNestedManyWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedCreateNestedManyWithoutClubInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateWithoutClubInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyClubInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const ClubSupporterUpdateManyWithoutClubNestedInputSchema: z.ZodType<Prisma.ClubSupporterUpdateManyWithoutClubNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateWithoutClubInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutClubInputSchema),z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutClubInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyClubInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutClubInputSchema),z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutClubInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutClubInputSchema),z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutClubInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClubSupporterScalarWhereInputSchema),z.lazy(() => ClubSupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClubSupporterUncheckedUpdateManyWithoutClubNestedInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateManyWithoutClubNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateWithoutClubInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutClubInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutClubInputSchema),z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutClubInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyClubInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutClubInputSchema),z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutClubInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutClubInputSchema),z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutClubInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClubSupporterScalarWhereInputSchema),z.lazy(() => ClubSupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlayerCreateNestedOneWithoutClubsInputSchema: z.ZodType<Prisma.PlayerCreateNestedOneWithoutClubsInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutClubsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutClubsInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional()
}).strict();

export const ClubCreateNestedOneWithoutSupportersInputSchema: z.ZodType<Prisma.ClubCreateNestedOneWithoutSupportersInput> = z.object({
  create: z.union([ z.lazy(() => ClubCreateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedCreateWithoutSupportersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClubCreateOrConnectWithoutSupportersInputSchema).optional(),
  connect: z.lazy(() => ClubWhereUniqueInputSchema).optional()
}).strict();

export const PlayerUpdateOneRequiredWithoutClubsNestedInputSchema: z.ZodType<Prisma.PlayerUpdateOneRequiredWithoutClubsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutClubsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutClubsInputSchema).optional(),
  upsert: z.lazy(() => PlayerUpsertWithoutClubsInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlayerUpdateToOneWithWhereWithoutClubsInputSchema),z.lazy(() => PlayerUpdateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutClubsInputSchema) ]).optional(),
}).strict();

export const ClubUpdateOneRequiredWithoutSupportersNestedInputSchema: z.ZodType<Prisma.ClubUpdateOneRequiredWithoutSupportersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClubCreateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedCreateWithoutSupportersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ClubCreateOrConnectWithoutSupportersInputSchema).optional(),
  upsert: z.lazy(() => ClubUpsertWithoutSupportersInputSchema).optional(),
  connect: z.lazy(() => ClubWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ClubUpdateToOneWithWhereWithoutSupportersInputSchema),z.lazy(() => ClubUpdateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedUpdateWithoutSupportersInputSchema) ]).optional(),
}).strict();

export const CountrySupporterCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterUncheckedCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.CountrySupporterUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountrySupporterScalarWhereInputSchema),z.lazy(() => CountrySupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterUncheckedUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountrySupporterScalarWhereInputSchema),z.lazy(() => CountrySupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountryCreateNestedOneWithoutSupportersInputSchema: z.ZodType<Prisma.CountryCreateNestedOneWithoutSupportersInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedCreateWithoutSupportersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutSupportersInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional()
}).strict();

export const PlayerCreateNestedOneWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerCreateNestedOneWithoutCountriesInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutCountriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutCountriesInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional()
}).strict();

export const CountryUpdateOneRequiredWithoutSupportersNestedInputSchema: z.ZodType<Prisma.CountryUpdateOneRequiredWithoutSupportersNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedCreateWithoutSupportersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutSupportersInputSchema).optional(),
  upsert: z.lazy(() => CountryUpsertWithoutSupportersInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CountryUpdateToOneWithWhereWithoutSupportersInputSchema),z.lazy(() => CountryUpdateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutSupportersInputSchema) ]).optional(),
}).strict();

export const PlayerUpdateOneRequiredWithoutCountriesNestedInputSchema: z.ZodType<Prisma.PlayerUpdateOneRequiredWithoutCountriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutCountriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutCountriesInputSchema).optional(),
  upsert: z.lazy(() => PlayerUpsertWithoutCountriesInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlayerUpdateToOneWithWhereWithoutCountriesInputSchema),z.lazy(() => PlayerUpdateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutCountriesInputSchema) ]).optional(),
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const OutcomeCreateNestedManyWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeCreateNestedManyWithoutGameDayInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateWithoutGameDayInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyGameDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordCreateNestedManyWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordCreateNestedManyWithoutGameDayInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyGameDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OutcomeUncheckedCreateNestedManyWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUncheckedCreateNestedManyWithoutGameDayInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateWithoutGameDayInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyGameDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordUncheckedCreateNestedManyWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedCreateNestedManyWithoutGameDayInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyGameDayInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const NullableEnumTeamNameFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumTeamNameFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TeamNameSchema).optional().nullable()
}).strict();

export const OutcomeUpdateManyWithoutGameDayNestedInputSchema: z.ZodType<Prisma.OutcomeUpdateManyWithoutGameDayNestedInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateWithoutGameDayInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyGameDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OutcomeUpdateManyWithWhereWithoutGameDayInputSchema),z.lazy(() => OutcomeUpdateManyWithWhereWithoutGameDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OutcomeScalarWhereInputSchema),z.lazy(() => OutcomeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordUpdateManyWithoutGameDayNestedInputSchema: z.ZodType<Prisma.PlayerRecordUpdateManyWithoutGameDayNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyGameDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutGameDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlayerRecordScalarWhereInputSchema),z.lazy(() => PlayerRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OutcomeUncheckedUpdateManyWithoutGameDayNestedInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateManyWithoutGameDayNestedInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateWithoutGameDayInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyGameDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OutcomeUpdateManyWithWhereWithoutGameDayInputSchema),z.lazy(() => OutcomeUpdateManyWithWhereWithoutGameDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OutcomeScalarWhereInputSchema),z.lazy(() => OutcomeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordUncheckedUpdateManyWithoutGameDayNestedInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateManyWithoutGameDayNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutGameDayInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyGameDayInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutGameDayInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutGameDayInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlayerRecordScalarWhereInputSchema),z.lazy(() => PlayerRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const GameDayCreateNestedOneWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayCreateNestedOneWithoutOutcomesInput> = z.object({
  create: z.union([ z.lazy(() => GameDayCreateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutOutcomesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GameDayCreateOrConnectWithoutOutcomesInputSchema).optional(),
  connect: z.lazy(() => GameDayWhereUniqueInputSchema).optional()
}).strict();

export const PlayerCreateNestedOneWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerCreateNestedOneWithoutOutcomesInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutOutcomesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutOutcomesInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional()
}).strict();

export const NullableEnumPlayerResponseFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumPlayerResponseFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PlayerResponseSchema).optional().nullable()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const GameDayUpdateOneRequiredWithoutOutcomesNestedInputSchema: z.ZodType<Prisma.GameDayUpdateOneRequiredWithoutOutcomesNestedInput> = z.object({
  create: z.union([ z.lazy(() => GameDayCreateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutOutcomesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GameDayCreateOrConnectWithoutOutcomesInputSchema).optional(),
  upsert: z.lazy(() => GameDayUpsertWithoutOutcomesInputSchema).optional(),
  connect: z.lazy(() => GameDayWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => GameDayUpdateToOneWithWhereWithoutOutcomesInputSchema),z.lazy(() => GameDayUpdateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedUpdateWithoutOutcomesInputSchema) ]).optional(),
}).strict();

export const PlayerUpdateOneRequiredWithoutOutcomesNestedInputSchema: z.ZodType<Prisma.PlayerUpdateOneRequiredWithoutOutcomesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutOutcomesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutOutcomesInputSchema).optional(),
  upsert: z.lazy(() => PlayerUpsertWithoutOutcomesInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlayerUpdateToOneWithWhereWithoutOutcomesInputSchema),z.lazy(() => PlayerUpdateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutOutcomesInputSchema) ]).optional(),
}).strict();

export const ArseCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.ArseCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutPlayerInputSchema),z.lazy(() => ArseCreateWithoutPlayerInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ArseCreateNestedManyWithoutRaterInputSchema: z.ZodType<Prisma.ArseCreateNestedManyWithoutRaterInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutRaterInputSchema),z.lazy(() => ArseCreateWithoutRaterInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema),z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyRaterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClubSupporterCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OutcomeCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateWithoutPlayerInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ArseUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutPlayerInputSchema),z.lazy(() => ArseCreateWithoutPlayerInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ArseUncheckedCreateNestedManyWithoutRaterInputSchema: z.ZodType<Prisma.ArseUncheckedCreateNestedManyWithoutRaterInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutRaterInputSchema),z.lazy(() => ArseCreateWithoutRaterInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema),z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyRaterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateWithoutPlayerInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedCreateNestedManyWithoutPlayerInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyPlayerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ArseUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.ArseUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutPlayerInputSchema),z.lazy(() => ArseCreateWithoutPlayerInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArseUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ArseUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArseUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ArseUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArseUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => ArseUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArseScalarWhereInputSchema),z.lazy(() => ArseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ArseUpdateManyWithoutRaterNestedInputSchema: z.ZodType<Prisma.ArseUpdateManyWithoutRaterNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutRaterInputSchema),z.lazy(() => ArseCreateWithoutRaterInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema),z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArseUpsertWithWhereUniqueWithoutRaterInputSchema),z.lazy(() => ArseUpsertWithWhereUniqueWithoutRaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyRaterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArseUpdateWithWhereUniqueWithoutRaterInputSchema),z.lazy(() => ArseUpdateWithWhereUniqueWithoutRaterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArseUpdateManyWithWhereWithoutRaterInputSchema),z.lazy(() => ArseUpdateManyWithWhereWithoutRaterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArseScalarWhereInputSchema),z.lazy(() => ArseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClubSupporterUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.ClubSupporterUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClubSupporterScalarWhereInputSchema),z.lazy(() => ClubSupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.CountrySupporterUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountrySupporterScalarWhereInputSchema),z.lazy(() => CountrySupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OutcomeUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.OutcomeUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateWithoutPlayerInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OutcomeUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => OutcomeUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OutcomeScalarWhereInputSchema),z.lazy(() => OutcomeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.PlayerRecordUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlayerRecordScalarWhereInputSchema),z.lazy(() => PlayerRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutPlayerInputSchema),z.lazy(() => ArseCreateWithoutPlayerInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ArseCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArseUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ArseUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArseUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ArseUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArseUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => ArseUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArseScalarWhereInputSchema),z.lazy(() => ArseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ArseUncheckedUpdateManyWithoutRaterNestedInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateManyWithoutRaterNestedInput> = z.object({
  create: z.union([ z.lazy(() => ArseCreateWithoutRaterInputSchema),z.lazy(() => ArseCreateWithoutRaterInputSchema).array(),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema),z.lazy(() => ArseCreateOrConnectWithoutRaterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ArseUpsertWithWhereUniqueWithoutRaterInputSchema),z.lazy(() => ArseUpsertWithWhereUniqueWithoutRaterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ArseCreateManyRaterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ArseWhereUniqueInputSchema),z.lazy(() => ArseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ArseUpdateWithWhereUniqueWithoutRaterInputSchema),z.lazy(() => ArseUpdateWithWhereUniqueWithoutRaterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ArseUpdateManyWithWhereWithoutRaterInputSchema),z.lazy(() => ArseUpdateManyWithWhereWithoutRaterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ArseScalarWhereInputSchema),z.lazy(() => ArseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => ClubSupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ClubSupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ClubSupporterWhereUniqueInputSchema),z.lazy(() => ClubSupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ClubSupporterScalarWhereInputSchema),z.lazy(() => ClubSupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema).array(),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => CountrySupporterCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountrySupporterCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountrySupporterWhereUniqueInputSchema),z.lazy(() => CountrySupporterWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountrySupporterScalarWhereInputSchema),z.lazy(() => CountrySupporterScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => OutcomeCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateWithoutPlayerInputSchema).array(),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => OutcomeCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => OutcomeUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OutcomeCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OutcomeWhereUniqueInputSchema),z.lazy(() => OutcomeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => OutcomeUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OutcomeUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => OutcomeUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OutcomeScalarWhereInputSchema),z.lazy(() => OutcomeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema).array(),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema),z.lazy(() => PlayerRecordCreateOrConnectWithoutPlayerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUpsertWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PlayerRecordCreateManyPlayerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PlayerRecordWhereUniqueInputSchema),z.lazy(() => PlayerRecordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUpdateWithWhereUniqueWithoutPlayerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUpdateManyWithWhereWithoutPlayerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PlayerRecordScalarWhereInputSchema),z.lazy(() => PlayerRecordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PlayerCreateNestedOneWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerCreateNestedOneWithoutPlayerRecordsInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutPlayerRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutPlayerRecordsInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional()
}).strict();

export const GameDayCreateNestedOneWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayCreateNestedOneWithoutPlayerRecordsInput> = z.object({
  create: z.union([ z.lazy(() => GameDayCreateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutPlayerRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GameDayCreateOrConnectWithoutPlayerRecordsInputSchema).optional(),
  connect: z.lazy(() => GameDayWhereUniqueInputSchema).optional()
}).strict();

export const PlayerUpdateOneRequiredWithoutPlayerRecordsNestedInputSchema: z.ZodType<Prisma.PlayerUpdateOneRequiredWithoutPlayerRecordsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PlayerCreateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutPlayerRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PlayerCreateOrConnectWithoutPlayerRecordsInputSchema).optional(),
  upsert: z.lazy(() => PlayerUpsertWithoutPlayerRecordsInputSchema).optional(),
  connect: z.lazy(() => PlayerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PlayerUpdateToOneWithWhereWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUpdateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutPlayerRecordsInputSchema) ]).optional(),
}).strict();

export const GameDayUpdateOneRequiredWithoutPlayerRecordsNestedInputSchema: z.ZodType<Prisma.GameDayUpdateOneRequiredWithoutPlayerRecordsNestedInput> = z.object({
  create: z.union([ z.lazy(() => GameDayCreateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutPlayerRecordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => GameDayCreateOrConnectWithoutPlayerRecordsInputSchema).optional(),
  upsert: z.lazy(() => GameDayUpsertWithoutPlayerRecordsInputSchema).optional(),
  connect: z.lazy(() => GameDayWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => GameDayUpdateToOneWithWhereWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUpdateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedUpdateWithoutPlayerRecordsInputSchema) ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumTeamNameNullableFilterSchema: z.ZodType<Prisma.NestedEnumTeamNameNullableFilter> = z.object({
  equals: z.lazy(() => TeamNameSchema).optional().nullable(),
  in: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  notIn: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NestedEnumTeamNameNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumTeamNameNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTeamNameNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TeamNameSchema).optional().nullable(),
  in: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  notIn: z.lazy(() => TeamNameSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NestedEnumTeamNameNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTeamNameNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTeamNameNullableFilterSchema).optional()
}).strict();

export const NestedEnumPlayerResponseNullableFilterSchema: z.ZodType<Prisma.NestedEnumPlayerResponseNullableFilter> = z.object({
  equals: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  in: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  notIn: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NestedEnumPlayerResponseNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumPlayerResponseNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPlayerResponseNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  in: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  notIn: z.lazy(() => PlayerResponseSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NestedEnumPlayerResponseNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPlayerResponseNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPlayerResponseNullableFilterSchema).optional()
}).strict();

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
}).strict();

export const PlayerCreateWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerCreateWithoutArsesOfPlayerInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesByPlayer: z.lazy(() => ArseCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateWithoutArsesOfPlayerInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesByPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerCreateOrConnectWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerCreateOrConnectWithoutArsesOfPlayerInput> = z.object({
  where: z.lazy(() => PlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesOfPlayerInputSchema) ]),
}).strict();

export const PlayerCreateWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerCreateWithoutArsesByPlayerInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseCreateNestedManyWithoutPlayerInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateWithoutArsesByPlayerInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerCreateOrConnectWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerCreateOrConnectWithoutArsesByPlayerInput> = z.object({
  where: z.lazy(() => PlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesByPlayerInputSchema) ]),
}).strict();

export const PlayerUpsertWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerUpsertWithoutArsesOfPlayerInput> = z.object({
  update: z.union([ z.lazy(() => PlayerUpdateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutArsesOfPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesOfPlayerInputSchema) ]),
  where: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const PlayerUpdateToOneWithWhereWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerUpdateToOneWithWhereWithoutArsesOfPlayerInput> = z.object({
  where: z.lazy(() => PlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlayerUpdateWithoutArsesOfPlayerInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutArsesOfPlayerInputSchema) ]),
}).strict();

export const PlayerUpdateWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerUpdateWithoutArsesOfPlayerInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesByPlayer: z.lazy(() => ArseUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateWithoutArsesOfPlayerInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateWithoutArsesOfPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesByPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUpsertWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerUpsertWithoutArsesByPlayerInput> = z.object({
  update: z.union([ z.lazy(() => PlayerUpdateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutArsesByPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerCreateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutArsesByPlayerInputSchema) ]),
  where: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const PlayerUpdateToOneWithWhereWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerUpdateToOneWithWhereWithoutArsesByPlayerInput> = z.object({
  where: z.lazy(() => PlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlayerUpdateWithoutArsesByPlayerInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutArsesByPlayerInputSchema) ]),
}).strict();

export const PlayerUpdateWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerUpdateWithoutArsesByPlayerInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUpdateManyWithoutPlayerNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateWithoutArsesByPlayerInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateWithoutArsesByPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const ClubSupporterCreateWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterCreateWithoutClubInput> = z.object({
  player: z.lazy(() => PlayerCreateNestedOneWithoutClubsInputSchema)
}).strict();

export const ClubSupporterUncheckedCreateWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedCreateWithoutClubInput> = z.object({
  playerId: z.number().int()
}).strict();

export const ClubSupporterCreateOrConnectWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterCreateOrConnectWithoutClubInput> = z.object({
  where: z.lazy(() => ClubSupporterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema) ]),
}).strict();

export const ClubSupporterCreateManyClubInputEnvelopeSchema: z.ZodType<Prisma.ClubSupporterCreateManyClubInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClubSupporterCreateManyClubInputSchema),z.lazy(() => ClubSupporterCreateManyClubInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClubSupporterUpsertWithWhereUniqueWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUpsertWithWhereUniqueWithoutClubInput> = z.object({
  where: z.lazy(() => ClubSupporterWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClubSupporterUpdateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedUpdateWithoutClubInputSchema) ]),
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutClubInputSchema) ]),
}).strict();

export const ClubSupporterUpdateWithWhereUniqueWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUpdateWithWhereUniqueWithoutClubInput> = z.object({
  where: z.lazy(() => ClubSupporterWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClubSupporterUpdateWithoutClubInputSchema),z.lazy(() => ClubSupporterUncheckedUpdateWithoutClubInputSchema) ]),
}).strict();

export const ClubSupporterUpdateManyWithWhereWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUpdateManyWithWhereWithoutClubInput> = z.object({
  where: z.lazy(() => ClubSupporterScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClubSupporterUpdateManyMutationInputSchema),z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutClubInputSchema) ]),
}).strict();

export const ClubSupporterScalarWhereInputSchema: z.ZodType<Prisma.ClubSupporterScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ClubSupporterScalarWhereInputSchema),z.lazy(() => ClubSupporterScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ClubSupporterScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ClubSupporterScalarWhereInputSchema),z.lazy(() => ClubSupporterScalarWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  clubId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const PlayerCreateWithoutClubsInputSchema: z.ZodType<Prisma.PlayerCreateWithoutClubsInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseCreateNestedManyWithoutRaterInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateWithoutClubsInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateWithoutClubsInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutRaterInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerCreateOrConnectWithoutClubsInputSchema: z.ZodType<Prisma.PlayerCreateOrConnectWithoutClubsInput> = z.object({
  where: z.lazy(() => PlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerCreateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutClubsInputSchema) ]),
}).strict();

export const ClubCreateWithoutSupportersInputSchema: z.ZodType<Prisma.ClubCreateWithoutSupportersInput> = z.object({
  soccerwayId: z.number().int().optional().nullable(),
  clubName: z.string(),
  uri: z.string().optional().nullable(),
  country: z.string().optional().nullable()
}).strict();

export const ClubUncheckedCreateWithoutSupportersInputSchema: z.ZodType<Prisma.ClubUncheckedCreateWithoutSupportersInput> = z.object({
  id: z.number().int().optional(),
  soccerwayId: z.number().int().optional().nullable(),
  clubName: z.string(),
  uri: z.string().optional().nullable(),
  country: z.string().optional().nullable()
}).strict();

export const ClubCreateOrConnectWithoutSupportersInputSchema: z.ZodType<Prisma.ClubCreateOrConnectWithoutSupportersInput> = z.object({
  where: z.lazy(() => ClubWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClubCreateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedCreateWithoutSupportersInputSchema) ]),
}).strict();

export const PlayerUpsertWithoutClubsInputSchema: z.ZodType<Prisma.PlayerUpsertWithoutClubsInput> = z.object({
  update: z.union([ z.lazy(() => PlayerUpdateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutClubsInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerCreateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutClubsInputSchema) ]),
  where: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const PlayerUpdateToOneWithWhereWithoutClubsInputSchema: z.ZodType<Prisma.PlayerUpdateToOneWithWhereWithoutClubsInput> = z.object({
  where: z.lazy(() => PlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlayerUpdateWithoutClubsInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutClubsInputSchema) ]),
}).strict();

export const PlayerUpdateWithoutClubsInputSchema: z.ZodType<Prisma.PlayerUpdateWithoutClubsInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUpdateManyWithoutRaterNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateWithoutClubsInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateWithoutClubsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutRaterNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const ClubUpsertWithoutSupportersInputSchema: z.ZodType<Prisma.ClubUpsertWithoutSupportersInput> = z.object({
  update: z.union([ z.lazy(() => ClubUpdateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedUpdateWithoutSupportersInputSchema) ]),
  create: z.union([ z.lazy(() => ClubCreateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedCreateWithoutSupportersInputSchema) ]),
  where: z.lazy(() => ClubWhereInputSchema).optional()
}).strict();

export const ClubUpdateToOneWithWhereWithoutSupportersInputSchema: z.ZodType<Prisma.ClubUpdateToOneWithWhereWithoutSupportersInput> = z.object({
  where: z.lazy(() => ClubWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ClubUpdateWithoutSupportersInputSchema),z.lazy(() => ClubUncheckedUpdateWithoutSupportersInputSchema) ]),
}).strict();

export const ClubUpdateWithoutSupportersInputSchema: z.ZodType<Prisma.ClubUpdateWithoutSupportersInput> = z.object({
  soccerwayId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clubName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uri: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ClubUncheckedUpdateWithoutSupportersInputSchema: z.ZodType<Prisma.ClubUncheckedUpdateWithoutSupportersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  soccerwayId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  clubName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uri: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CountrySupporterCreateWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterCreateWithoutCountryInput> = z.object({
  player: z.lazy(() => PlayerCreateNestedOneWithoutCountriesInputSchema)
}).strict();

export const CountrySupporterUncheckedCreateWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedCreateWithoutCountryInput> = z.object({
  playerId: z.number().int()
}).strict();

export const CountrySupporterCreateOrConnectWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterCreateOrConnectWithoutCountryInput> = z.object({
  where: z.lazy(() => CountrySupporterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const CountrySupporterCreateManyCountryInputEnvelopeSchema: z.ZodType<Prisma.CountrySupporterCreateManyCountryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CountrySupporterCreateManyCountryInputSchema),z.lazy(() => CountrySupporterCreateManyCountryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CountrySupporterUpsertWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUpsertWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => CountrySupporterWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CountrySupporterUpdateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedUpdateWithoutCountryInputSchema) ]),
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const CountrySupporterUpdateWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUpdateWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => CountrySupporterWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CountrySupporterUpdateWithoutCountryInputSchema),z.lazy(() => CountrySupporterUncheckedUpdateWithoutCountryInputSchema) ]),
}).strict();

export const CountrySupporterUpdateManyWithWhereWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUpdateManyWithWhereWithoutCountryInput> = z.object({
  where: z.lazy(() => CountrySupporterScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CountrySupporterUpdateManyMutationInputSchema),z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutCountryInputSchema) ]),
}).strict();

export const CountrySupporterScalarWhereInputSchema: z.ZodType<Prisma.CountrySupporterScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CountrySupporterScalarWhereInputSchema),z.lazy(() => CountrySupporterScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountrySupporterScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountrySupporterScalarWhereInputSchema),z.lazy(() => CountrySupporterScalarWhereInputSchema).array() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  countryISOCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CountryCreateWithoutSupportersInputSchema: z.ZodType<Prisma.CountryCreateWithoutSupportersInput> = z.object({
  isoCode: z.string(),
  name: z.string()
}).strict();

export const CountryUncheckedCreateWithoutSupportersInputSchema: z.ZodType<Prisma.CountryUncheckedCreateWithoutSupportersInput> = z.object({
  isoCode: z.string(),
  name: z.string()
}).strict();

export const CountryCreateOrConnectWithoutSupportersInputSchema: z.ZodType<Prisma.CountryCreateOrConnectWithoutSupportersInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountryCreateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedCreateWithoutSupportersInputSchema) ]),
}).strict();

export const PlayerCreateWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerCreateWithoutCountriesInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateWithoutCountriesInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerCreateOrConnectWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerCreateOrConnectWithoutCountriesInput> = z.object({
  where: z.lazy(() => PlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerCreateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutCountriesInputSchema) ]),
}).strict();

export const CountryUpsertWithoutSupportersInputSchema: z.ZodType<Prisma.CountryUpsertWithoutSupportersInput> = z.object({
  update: z.union([ z.lazy(() => CountryUpdateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutSupportersInputSchema) ]),
  create: z.union([ z.lazy(() => CountryCreateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedCreateWithoutSupportersInputSchema) ]),
  where: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const CountryUpdateToOneWithWhereWithoutSupportersInputSchema: z.ZodType<Prisma.CountryUpdateToOneWithWhereWithoutSupportersInput> = z.object({
  where: z.lazy(() => CountryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CountryUpdateWithoutSupportersInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutSupportersInputSchema) ]),
}).strict();

export const CountryUpdateWithoutSupportersInputSchema: z.ZodType<Prisma.CountryUpdateWithoutSupportersInput> = z.object({
  isoCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountryUncheckedUpdateWithoutSupportersInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateWithoutSupportersInput> = z.object({
  isoCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlayerUpsertWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerUpsertWithoutCountriesInput> = z.object({
  update: z.union([ z.lazy(() => PlayerUpdateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutCountriesInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerCreateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutCountriesInputSchema) ]),
  where: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const PlayerUpdateToOneWithWhereWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerUpdateToOneWithWhereWithoutCountriesInput> = z.object({
  where: z.lazy(() => PlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlayerUpdateWithoutCountriesInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutCountriesInputSchema) ]),
}).strict();

export const PlayerUpdateWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerUpdateWithoutCountriesInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateWithoutCountriesInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateWithoutCountriesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const OutcomeCreateWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeCreateWithoutGameDayInput> = z.object({
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  player: z.lazy(() => PlayerCreateNestedOneWithoutOutcomesInputSchema)
}).strict();

export const OutcomeUncheckedCreateWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUncheckedCreateWithoutGameDayInput> = z.object({
  id: z.number().int().optional(),
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  playerId: z.number().int()
}).strict();

export const OutcomeCreateOrConnectWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeCreateOrConnectWithoutGameDayInput> = z.object({
  where: z.lazy(() => OutcomeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OutcomeCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema) ]),
}).strict();

export const OutcomeCreateManyGameDayInputEnvelopeSchema: z.ZodType<Prisma.OutcomeCreateManyGameDayInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OutcomeCreateManyGameDayInputSchema),z.lazy(() => OutcomeCreateManyGameDayInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PlayerRecordCreateWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordCreateWithoutGameDayInput> = z.object({
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  player: z.lazy(() => PlayerCreateNestedOneWithoutPlayerRecordsInputSchema)
}).strict();

export const PlayerRecordUncheckedCreateWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedCreateWithoutGameDayInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  playerId: z.number().int()
}).strict();

export const PlayerRecordCreateOrConnectWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordCreateOrConnectWithoutGameDayInput> = z.object({
  where: z.lazy(() => PlayerRecordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema) ]),
}).strict();

export const PlayerRecordCreateManyGameDayInputEnvelopeSchema: z.ZodType<Prisma.PlayerRecordCreateManyGameDayInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PlayerRecordCreateManyGameDayInputSchema),z.lazy(() => PlayerRecordCreateManyGameDayInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OutcomeUpsertWithWhereUniqueWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUpsertWithWhereUniqueWithoutGameDayInput> = z.object({
  where: z.lazy(() => OutcomeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OutcomeUpdateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedUpdateWithoutGameDayInputSchema) ]),
  create: z.union([ z.lazy(() => OutcomeCreateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutGameDayInputSchema) ]),
}).strict();

export const OutcomeUpdateWithWhereUniqueWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUpdateWithWhereUniqueWithoutGameDayInput> = z.object({
  where: z.lazy(() => OutcomeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OutcomeUpdateWithoutGameDayInputSchema),z.lazy(() => OutcomeUncheckedUpdateWithoutGameDayInputSchema) ]),
}).strict();

export const OutcomeUpdateManyWithWhereWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUpdateManyWithWhereWithoutGameDayInput> = z.object({
  where: z.lazy(() => OutcomeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OutcomeUpdateManyMutationInputSchema),z.lazy(() => OutcomeUncheckedUpdateManyWithoutGameDayInputSchema) ]),
}).strict();

export const OutcomeScalarWhereInputSchema: z.ZodType<Prisma.OutcomeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OutcomeScalarWhereInputSchema),z.lazy(() => OutcomeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OutcomeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OutcomeScalarWhereInputSchema),z.lazy(() => OutcomeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  response: z.union([ z.lazy(() => EnumPlayerResponseNullableFilterSchema),z.lazy(() => PlayerResponseSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  team: z.union([ z.lazy(() => EnumTeamNameNullableFilterSchema),z.lazy(() => TeamNameSchema) ]).optional().nullable(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  paid: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  goalie: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const PlayerRecordUpsertWithWhereUniqueWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUpsertWithWhereUniqueWithoutGameDayInput> = z.object({
  where: z.lazy(() => PlayerRecordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PlayerRecordUpdateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedUpdateWithoutGameDayInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutGameDayInputSchema) ]),
}).strict();

export const PlayerRecordUpdateWithWhereUniqueWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUpdateWithWhereUniqueWithoutGameDayInput> = z.object({
  where: z.lazy(() => PlayerRecordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PlayerRecordUpdateWithoutGameDayInputSchema),z.lazy(() => PlayerRecordUncheckedUpdateWithoutGameDayInputSchema) ]),
}).strict();

export const PlayerRecordUpdateManyWithWhereWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUpdateManyWithWhereWithoutGameDayInput> = z.object({
  where: z.lazy(() => PlayerRecordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PlayerRecordUpdateManyMutationInputSchema),z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutGameDayInputSchema) ]),
}).strict();

export const PlayerRecordScalarWhereInputSchema: z.ZodType<Prisma.PlayerRecordScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PlayerRecordScalarWhereInputSchema),z.lazy(() => PlayerRecordScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PlayerRecordScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PlayerRecordScalarWhereInputSchema),z.lazy(() => PlayerRecordScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  year: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  responses: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  played: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  won: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  drawn: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  lost: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  points: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  averages: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  stalwart: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  pub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankPoints: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankAverages: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankStalwart: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankSpeedy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  rankPub: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  speedy: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  gameDayId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const GameDayCreateWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayCreateWithoutOutcomesInput> = z.object({
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutGameDayInputSchema).optional()
}).strict();

export const GameDayUncheckedCreateWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayUncheckedCreateWithoutOutcomesInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutGameDayInputSchema).optional()
}).strict();

export const GameDayCreateOrConnectWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayCreateOrConnectWithoutOutcomesInput> = z.object({
  where: z.lazy(() => GameDayWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GameDayCreateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutOutcomesInputSchema) ]),
}).strict();

export const PlayerCreateWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerCreateWithoutOutcomesInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateWithoutOutcomesInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerCreateOrConnectWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerCreateOrConnectWithoutOutcomesInput> = z.object({
  where: z.lazy(() => PlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerCreateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutOutcomesInputSchema) ]),
}).strict();

export const GameDayUpsertWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayUpsertWithoutOutcomesInput> = z.object({
  update: z.union([ z.lazy(() => GameDayUpdateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedUpdateWithoutOutcomesInputSchema) ]),
  create: z.union([ z.lazy(() => GameDayCreateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutOutcomesInputSchema) ]),
  where: z.lazy(() => GameDayWhereInputSchema).optional()
}).strict();

export const GameDayUpdateToOneWithWhereWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayUpdateToOneWithWhereWithoutOutcomesInput> = z.object({
  where: z.lazy(() => GameDayWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => GameDayUpdateWithoutOutcomesInputSchema),z.lazy(() => GameDayUncheckedUpdateWithoutOutcomesInputSchema) ]),
}).strict();

export const GameDayUpdateWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayUpdateWithoutOutcomesInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutGameDayNestedInputSchema).optional()
}).strict();

export const GameDayUncheckedUpdateWithoutOutcomesInputSchema: z.ZodType<Prisma.GameDayUncheckedUpdateWithoutOutcomesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutGameDayNestedInputSchema).optional()
}).strict();

export const PlayerUpsertWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerUpsertWithoutOutcomesInput> = z.object({
  update: z.union([ z.lazy(() => PlayerUpdateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutOutcomesInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerCreateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutOutcomesInputSchema) ]),
  where: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const PlayerUpdateToOneWithWhereWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerUpdateToOneWithWhereWithoutOutcomesInput> = z.object({
  where: z.lazy(() => PlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlayerUpdateWithoutOutcomesInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutOutcomesInputSchema) ]),
}).strict();

export const PlayerUpdateWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerUpdateWithoutOutcomesInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateWithoutOutcomesInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateWithoutOutcomesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  playerRecords: z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const ArseCreateWithoutPlayerInputSchema: z.ZodType<Prisma.ArseCreateWithoutPlayerInput> = z.object({
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  rater: z.lazy(() => PlayerCreateNestedOneWithoutArsesByPlayerInputSchema)
}).strict();

export const ArseUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUncheckedCreateWithoutPlayerInput> = z.object({
  id: z.number().int().optional(),
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  raterId: z.number().int()
}).strict();

export const ArseCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.ArseCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => ArseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArseCreateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const ArseCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.ArseCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ArseCreateManyPlayerInputSchema),z.lazy(() => ArseCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ArseCreateWithoutRaterInputSchema: z.ZodType<Prisma.ArseCreateWithoutRaterInput> = z.object({
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  player: z.lazy(() => PlayerCreateNestedOneWithoutArsesOfPlayerInputSchema)
}).strict();

export const ArseUncheckedCreateWithoutRaterInputSchema: z.ZodType<Prisma.ArseUncheckedCreateWithoutRaterInput> = z.object({
  id: z.number().int().optional(),
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  playerId: z.number().int()
}).strict();

export const ArseCreateOrConnectWithoutRaterInputSchema: z.ZodType<Prisma.ArseCreateOrConnectWithoutRaterInput> = z.object({
  where: z.lazy(() => ArseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ArseCreateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema) ]),
}).strict();

export const ArseCreateManyRaterInputEnvelopeSchema: z.ZodType<Prisma.ArseCreateManyRaterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ArseCreateManyRaterInputSchema),z.lazy(() => ArseCreateManyRaterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ClubSupporterCreateWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterCreateWithoutPlayerInput> = z.object({
  club: z.lazy(() => ClubCreateNestedOneWithoutSupportersInputSchema)
}).strict();

export const ClubSupporterUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedCreateWithoutPlayerInput> = z.object({
  clubId: z.number().int()
}).strict();

export const ClubSupporterCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => ClubSupporterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const ClubSupporterCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.ClubSupporterCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ClubSupporterCreateManyPlayerInputSchema),z.lazy(() => ClubSupporterCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CountrySupporterCreateWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterCreateWithoutPlayerInput> = z.object({
  country: z.lazy(() => CountryCreateNestedOneWithoutSupportersInputSchema)
}).strict();

export const CountrySupporterUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedCreateWithoutPlayerInput> = z.object({
  countryISOCode: z.string()
}).strict();

export const CountrySupporterCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => CountrySupporterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const CountrySupporterCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.CountrySupporterCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CountrySupporterCreateManyPlayerInputSchema),z.lazy(() => CountrySupporterCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OutcomeCreateWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeCreateWithoutPlayerInput> = z.object({
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  gameDay: z.lazy(() => GameDayCreateNestedOneWithoutOutcomesInputSchema)
}).strict();

export const OutcomeUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUncheckedCreateWithoutPlayerInput> = z.object({
  id: z.number().int().optional(),
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  gameDayId: z.number().int()
}).strict();

export const OutcomeCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => OutcomeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OutcomeCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const OutcomeCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.OutcomeCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OutcomeCreateManyPlayerInputSchema),z.lazy(() => OutcomeCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PlayerRecordCreateWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordCreateWithoutPlayerInput> = z.object({
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  gameDay: z.lazy(() => GameDayCreateNestedOneWithoutPlayerRecordsInputSchema)
}).strict();

export const PlayerRecordUncheckedCreateWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedCreateWithoutPlayerInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  gameDayId: z.number().int()
}).strict();

export const PlayerRecordCreateOrConnectWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordCreateOrConnectWithoutPlayerInput> = z.object({
  where: z.lazy(() => PlayerRecordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const PlayerRecordCreateManyPlayerInputEnvelopeSchema: z.ZodType<Prisma.PlayerRecordCreateManyPlayerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PlayerRecordCreateManyPlayerInputSchema),z.lazy(() => PlayerRecordCreateManyPlayerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ArseUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => ArseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ArseUpdateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => ArseCreateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const ArseUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => ArseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ArseUpdateWithoutPlayerInputSchema),z.lazy(() => ArseUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const ArseUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => ArseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ArseUpdateManyMutationInputSchema),z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const ArseScalarWhereInputSchema: z.ZodType<Prisma.ArseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ArseScalarWhereInputSchema),z.lazy(() => ArseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ArseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ArseScalarWhereInputSchema),z.lazy(() => ArseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  stamp: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  inGoal: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  running: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  shooting: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  passing: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  ballSkill: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  attacking: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  defending: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  playerId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  raterId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const ArseUpsertWithWhereUniqueWithoutRaterInputSchema: z.ZodType<Prisma.ArseUpsertWithWhereUniqueWithoutRaterInput> = z.object({
  where: z.lazy(() => ArseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ArseUpdateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedUpdateWithoutRaterInputSchema) ]),
  create: z.union([ z.lazy(() => ArseCreateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedCreateWithoutRaterInputSchema) ]),
}).strict();

export const ArseUpdateWithWhereUniqueWithoutRaterInputSchema: z.ZodType<Prisma.ArseUpdateWithWhereUniqueWithoutRaterInput> = z.object({
  where: z.lazy(() => ArseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ArseUpdateWithoutRaterInputSchema),z.lazy(() => ArseUncheckedUpdateWithoutRaterInputSchema) ]),
}).strict();

export const ArseUpdateManyWithWhereWithoutRaterInputSchema: z.ZodType<Prisma.ArseUpdateManyWithWhereWithoutRaterInput> = z.object({
  where: z.lazy(() => ArseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ArseUpdateManyMutationInputSchema),z.lazy(() => ArseUncheckedUpdateManyWithoutRaterInputSchema) ]),
}).strict();

export const ClubSupporterUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => ClubSupporterWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ClubSupporterUpdateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => ClubSupporterCreateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const ClubSupporterUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => ClubSupporterWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ClubSupporterUpdateWithoutPlayerInputSchema),z.lazy(() => ClubSupporterUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const ClubSupporterUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => ClubSupporterScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ClubSupporterUpdateManyMutationInputSchema),z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const CountrySupporterUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => CountrySupporterWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CountrySupporterUpdateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => CountrySupporterCreateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const CountrySupporterUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => CountrySupporterWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CountrySupporterUpdateWithoutPlayerInputSchema),z.lazy(() => CountrySupporterUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const CountrySupporterUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => CountrySupporterScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CountrySupporterUpdateManyMutationInputSchema),z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const OutcomeUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => OutcomeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OutcomeUpdateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => OutcomeCreateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const OutcomeUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => OutcomeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OutcomeUpdateWithoutPlayerInputSchema),z.lazy(() => OutcomeUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const OutcomeUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => OutcomeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OutcomeUpdateManyMutationInputSchema),z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const PlayerRecordUpsertWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUpsertWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => PlayerRecordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PlayerRecordUpdateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedUpdateWithoutPlayerInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerRecordCreateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedCreateWithoutPlayerInputSchema) ]),
}).strict();

export const PlayerRecordUpdateWithWhereUniqueWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUpdateWithWhereUniqueWithoutPlayerInput> = z.object({
  where: z.lazy(() => PlayerRecordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PlayerRecordUpdateWithoutPlayerInputSchema),z.lazy(() => PlayerRecordUncheckedUpdateWithoutPlayerInputSchema) ]),
}).strict();

export const PlayerRecordUpdateManyWithWhereWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUpdateManyWithWhereWithoutPlayerInput> = z.object({
  where: z.lazy(() => PlayerRecordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PlayerRecordUpdateManyMutationInputSchema),z.lazy(() => PlayerRecordUncheckedUpdateManyWithoutPlayerInputSchema) ]),
}).strict();

export const PlayerCreateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerCreateWithoutPlayerRecordsInput> = z.object({
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerUncheckedCreateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerUncheckedCreateWithoutPlayerRecordsInput> = z.object({
  id: z.number().int().optional(),
  login: z.string(),
  isAdmin: z.boolean().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  anonymous: z.boolean().optional().nullable(),
  email: z.string().optional().nullable(),
  joined: z.coerce.date().optional().nullable(),
  finished: z.coerce.date().optional().nullable(),
  born: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  introducedBy: z.number().int().optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedCreateNestedManyWithoutRaterInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedCreateNestedManyWithoutPlayerInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutPlayerInputSchema).optional()
}).strict();

export const PlayerCreateOrConnectWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerCreateOrConnectWithoutPlayerRecordsInput> = z.object({
  where: z.lazy(() => PlayerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PlayerCreateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutPlayerRecordsInputSchema) ]),
}).strict();

export const GameDayCreateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayCreateWithoutPlayerRecordsInput> = z.object({
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable(),
  outcomes: z.lazy(() => OutcomeCreateNestedManyWithoutGameDayInputSchema).optional()
}).strict();

export const GameDayUncheckedCreateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayUncheckedCreateWithoutPlayerRecordsInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  date: z.coerce.date(),
  game: z.boolean().optional(),
  mailSent: z.coerce.date().optional().nullable(),
  comment: z.string().optional().nullable(),
  bibs: z.lazy(() => TeamNameSchema).optional().nullable(),
  pickerGamesHistory: z.number().int().optional().nullable(),
  outcomes: z.lazy(() => OutcomeUncheckedCreateNestedManyWithoutGameDayInputSchema).optional()
}).strict();

export const GameDayCreateOrConnectWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayCreateOrConnectWithoutPlayerRecordsInput> = z.object({
  where: z.lazy(() => GameDayWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => GameDayCreateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutPlayerRecordsInputSchema) ]),
}).strict();

export const PlayerUpsertWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerUpsertWithoutPlayerRecordsInput> = z.object({
  update: z.union([ z.lazy(() => PlayerUpdateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutPlayerRecordsInputSchema) ]),
  create: z.union([ z.lazy(() => PlayerCreateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedCreateWithoutPlayerRecordsInputSchema) ]),
  where: z.lazy(() => PlayerWhereInputSchema).optional()
}).strict();

export const PlayerUpdateToOneWithWhereWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerUpdateToOneWithWhereWithoutPlayerRecordsInput> = z.object({
  where: z.lazy(() => PlayerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PlayerUpdateWithoutPlayerRecordsInputSchema),z.lazy(() => PlayerUncheckedUpdateWithoutPlayerRecordsInputSchema) ]),
}).strict();

export const PlayerUpdateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerUpdateWithoutPlayerRecordsInput> = z.object({
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const PlayerUncheckedUpdateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.PlayerUncheckedUpdateWithoutPlayerRecordsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  login: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  anonymous: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  joined: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  finished: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  born: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  introducedBy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  arsesOfPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  arsesByPlayer: z.lazy(() => ArseUncheckedUpdateManyWithoutRaterNestedInputSchema).optional(),
  clubs: z.lazy(() => ClubSupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  countries: z.lazy(() => CountrySupporterUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutPlayerNestedInputSchema).optional()
}).strict();

export const GameDayUpsertWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayUpsertWithoutPlayerRecordsInput> = z.object({
  update: z.union([ z.lazy(() => GameDayUpdateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedUpdateWithoutPlayerRecordsInputSchema) ]),
  create: z.union([ z.lazy(() => GameDayCreateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedCreateWithoutPlayerRecordsInputSchema) ]),
  where: z.lazy(() => GameDayWhereInputSchema).optional()
}).strict();

export const GameDayUpdateToOneWithWhereWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayUpdateToOneWithWhereWithoutPlayerRecordsInput> = z.object({
  where: z.lazy(() => GameDayWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => GameDayUpdateWithoutPlayerRecordsInputSchema),z.lazy(() => GameDayUncheckedUpdateWithoutPlayerRecordsInputSchema) ]),
}).strict();

export const GameDayUpdateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayUpdateWithoutPlayerRecordsInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outcomes: z.lazy(() => OutcomeUpdateManyWithoutGameDayNestedInputSchema).optional()
}).strict();

export const GameDayUncheckedUpdateWithoutPlayerRecordsInputSchema: z.ZodType<Prisma.GameDayUncheckedUpdateWithoutPlayerRecordsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  game: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  mailSent: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bibs: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pickerGamesHistory: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  outcomes: z.lazy(() => OutcomeUncheckedUpdateManyWithoutGameDayNestedInputSchema).optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  impersonatedBy: z.string().optional().nullable()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  impersonatedBy: z.string().optional().nullable()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  impersonatedBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  role: z.string().optional().nullable(),
  banned: z.boolean().optional().nullable(),
  banReason: z.string().optional().nullable(),
  banExpires: z.coerce.date().optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banned: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banReason: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banExpires: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ClubSupporterCreateManyClubInputSchema: z.ZodType<Prisma.ClubSupporterCreateManyClubInput> = z.object({
  playerId: z.number().int()
}).strict();

export const ClubSupporterUpdateWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUpdateWithoutClubInput> = z.object({
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutClubsNestedInputSchema).optional()
}).strict();

export const ClubSupporterUncheckedUpdateWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateWithoutClubInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClubSupporterUncheckedUpdateManyWithoutClubInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateManyWithoutClubInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountrySupporterCreateManyCountryInputSchema: z.ZodType<Prisma.CountrySupporterCreateManyCountryInput> = z.object({
  playerId: z.number().int()
}).strict();

export const CountrySupporterUpdateWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUpdateWithoutCountryInput> = z.object({
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutCountriesNestedInputSchema).optional()
}).strict();

export const CountrySupporterUncheckedUpdateWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateWithoutCountryInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountrySupporterUncheckedUpdateManyWithoutCountryInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateManyWithoutCountryInput> = z.object({
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OutcomeCreateManyGameDayInputSchema: z.ZodType<Prisma.OutcomeCreateManyGameDayInput> = z.object({
  id: z.number().int().optional(),
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  playerId: z.number().int()
}).strict();

export const PlayerRecordCreateManyGameDayInputSchema: z.ZodType<Prisma.PlayerRecordCreateManyGameDayInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  playerId: z.number().int()
}).strict();

export const OutcomeUpdateWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUpdateWithoutGameDayInput> = z.object({
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutOutcomesNestedInputSchema).optional()
}).strict();

export const OutcomeUncheckedUpdateWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateWithoutGameDayInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OutcomeUncheckedUpdateManyWithoutGameDayInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateManyWithoutGameDayInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlayerRecordUpdateWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUpdateWithoutGameDayInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutPlayerRecordsNestedInputSchema).optional()
}).strict();

export const PlayerRecordUncheckedUpdateWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateWithoutGameDayInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlayerRecordUncheckedUpdateManyWithoutGameDayInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateManyWithoutGameDayInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArseCreateManyPlayerInputSchema: z.ZodType<Prisma.ArseCreateManyPlayerInput> = z.object({
  id: z.number().int().optional(),
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  raterId: z.number().int()
}).strict();

export const ArseCreateManyRaterInputSchema: z.ZodType<Prisma.ArseCreateManyRaterInput> = z.object({
  id: z.number().int().optional(),
  stamp: z.coerce.date().optional(),
  inGoal: z.number().int().optional().nullable(),
  running: z.number().int().optional().nullable(),
  shooting: z.number().int().optional().nullable(),
  passing: z.number().int().optional().nullable(),
  ballSkill: z.number().int().optional().nullable(),
  attacking: z.number().int().optional().nullable(),
  defending: z.number().int().optional().nullable(),
  playerId: z.number().int()
}).strict();

export const ClubSupporterCreateManyPlayerInputSchema: z.ZodType<Prisma.ClubSupporterCreateManyPlayerInput> = z.object({
  clubId: z.number().int()
}).strict();

export const CountrySupporterCreateManyPlayerInputSchema: z.ZodType<Prisma.CountrySupporterCreateManyPlayerInput> = z.object({
  countryISOCode: z.string()
}).strict();

export const OutcomeCreateManyPlayerInputSchema: z.ZodType<Prisma.OutcomeCreateManyPlayerInput> = z.object({
  id: z.number().int().optional(),
  response: z.lazy(() => PlayerResponseSchema).optional().nullable(),
  responseInterval: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  team: z.lazy(() => TeamNameSchema).optional().nullable(),
  comment: z.string().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  paid: z.boolean().optional().nullable(),
  goalie: z.boolean().optional().nullable(),
  gameDayId: z.number().int()
}).strict();

export const PlayerRecordCreateManyPlayerInputSchema: z.ZodType<Prisma.PlayerRecordCreateManyPlayerInput> = z.object({
  id: z.number().int().optional(),
  year: z.number().int(),
  responses: z.number().int().optional().nullable(),
  played: z.number().int().optional().nullable(),
  won: z.number().int().optional().nullable(),
  drawn: z.number().int().optional().nullable(),
  lost: z.number().int().optional().nullable(),
  points: z.number().int().optional().nullable(),
  averages: z.number().optional().nullable(),
  stalwart: z.number().int().optional().nullable(),
  pub: z.number().int().optional().nullable(),
  rankPoints: z.number().int().optional().nullable(),
  rankAverages: z.number().int().optional().nullable(),
  rankAveragesUnqualified: z.number().int().optional().nullable(),
  rankStalwart: z.number().int().optional().nullable(),
  rankSpeedy: z.number().int().optional().nullable(),
  rankSpeedyUnqualified: z.number().int().optional().nullable(),
  rankPub: z.number().int().optional().nullable(),
  speedy: z.number().int().optional().nullable(),
  gameDayId: z.number().int()
}).strict();

export const ArseUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUpdateWithoutPlayerInput> = z.object({
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rater: z.lazy(() => PlayerUpdateOneRequiredWithoutArsesByPlayerNestedInputSchema).optional()
}).strict();

export const ArseUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArseUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateManyWithoutPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raterId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArseUpdateWithoutRaterInputSchema: z.ZodType<Prisma.ArseUpdateWithoutRaterInput> = z.object({
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  player: z.lazy(() => PlayerUpdateOneRequiredWithoutArsesOfPlayerNestedInputSchema).optional()
}).strict();

export const ArseUncheckedUpdateWithoutRaterInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateWithoutRaterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ArseUncheckedUpdateManyWithoutRaterInputSchema: z.ZodType<Prisma.ArseUncheckedUpdateManyWithoutRaterInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  inGoal: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  running: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shooting: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  passing: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  ballSkill: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  attacking: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  defending: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  playerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClubSupporterUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUpdateWithoutPlayerInput> = z.object({
  club: z.lazy(() => ClubUpdateOneRequiredWithoutSupportersNestedInputSchema).optional()
}).strict();

export const ClubSupporterUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateWithoutPlayerInput> = z.object({
  clubId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ClubSupporterUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.ClubSupporterUncheckedUpdateManyWithoutPlayerInput> = z.object({
  clubId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountrySupporterUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUpdateWithoutPlayerInput> = z.object({
  country: z.lazy(() => CountryUpdateOneRequiredWithoutSupportersNestedInputSchema).optional()
}).strict();

export const CountrySupporterUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateWithoutPlayerInput> = z.object({
  countryISOCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountrySupporterUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.CountrySupporterUncheckedUpdateManyWithoutPlayerInput> = z.object({
  countryISOCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OutcomeUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUpdateWithoutPlayerInput> = z.object({
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDay: z.lazy(() => GameDayUpdateOneRequiredWithoutOutcomesNestedInputSchema).optional()
}).strict();

export const OutcomeUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OutcomeUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.OutcomeUncheckedUpdateManyWithoutPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  response: z.union([ z.lazy(() => PlayerResponseSchema),z.lazy(() => NullableEnumPlayerResponseFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  responseInterval: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  team: z.union([ z.lazy(() => TeamNameSchema),z.lazy(() => NullableEnumTeamNameFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paid: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  goalie: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlayerRecordUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUpdateWithoutPlayerInput> = z.object({
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDay: z.lazy(() => GameDayUpdateOneRequiredWithoutPlayerRecordsNestedInputSchema).optional()
}).strict();

export const PlayerRecordUncheckedUpdateWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateWithoutPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PlayerRecordUncheckedUpdateManyWithoutPlayerInputSchema: z.ZodType<Prisma.PlayerRecordUncheckedUpdateManyWithoutPlayerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  year: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responses: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  played: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  won: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  drawn: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lost: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  points: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averages: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  pub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPoints: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAverages: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankAveragesUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankStalwart: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankSpeedyUnqualified: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rankPub: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  speedy: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  gameDayId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  id: z.string(),
  expiresAt: z.coerce.date(),
  token: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  impersonatedBy: z.string().optional().nullable()
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  accessTokenExpiresAt: z.coerce.date().optional().nullable(),
  refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
  scope: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  impersonatedBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accessTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshTokenExpiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ArseFindFirstArgsSchema: z.ZodType<Prisma.ArseFindFirstArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereInputSchema.optional(),
  orderBy: z.union([ ArseOrderByWithRelationInputSchema.array(),ArseOrderByWithRelationInputSchema ]).optional(),
  cursor: ArseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ArseScalarFieldEnumSchema,ArseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ArseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ArseFindFirstOrThrowArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereInputSchema.optional(),
  orderBy: z.union([ ArseOrderByWithRelationInputSchema.array(),ArseOrderByWithRelationInputSchema ]).optional(),
  cursor: ArseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ArseScalarFieldEnumSchema,ArseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ArseFindManyArgsSchema: z.ZodType<Prisma.ArseFindManyArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereInputSchema.optional(),
  orderBy: z.union([ ArseOrderByWithRelationInputSchema.array(),ArseOrderByWithRelationInputSchema ]).optional(),
  cursor: ArseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ArseScalarFieldEnumSchema,ArseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ArseAggregateArgsSchema: z.ZodType<Prisma.ArseAggregateArgs> = z.object({
  where: ArseWhereInputSchema.optional(),
  orderBy: z.union([ ArseOrderByWithRelationInputSchema.array(),ArseOrderByWithRelationInputSchema ]).optional(),
  cursor: ArseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ArseGroupByArgsSchema: z.ZodType<Prisma.ArseGroupByArgs> = z.object({
  where: ArseWhereInputSchema.optional(),
  orderBy: z.union([ ArseOrderByWithAggregationInputSchema.array(),ArseOrderByWithAggregationInputSchema ]).optional(),
  by: ArseScalarFieldEnumSchema.array(),
  having: ArseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ArseFindUniqueArgsSchema: z.ZodType<Prisma.ArseFindUniqueArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereUniqueInputSchema,
}).strict() ;

export const ArseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ArseFindUniqueOrThrowArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereUniqueInputSchema,
}).strict() ;

export const ClubFindFirstArgsSchema: z.ZodType<Prisma.ClubFindFirstArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereInputSchema.optional(),
  orderBy: z.union([ ClubOrderByWithRelationInputSchema.array(),ClubOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClubScalarFieldEnumSchema,ClubScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClubFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClubFindFirstOrThrowArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereInputSchema.optional(),
  orderBy: z.union([ ClubOrderByWithRelationInputSchema.array(),ClubOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClubScalarFieldEnumSchema,ClubScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClubFindManyArgsSchema: z.ZodType<Prisma.ClubFindManyArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereInputSchema.optional(),
  orderBy: z.union([ ClubOrderByWithRelationInputSchema.array(),ClubOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClubScalarFieldEnumSchema,ClubScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClubAggregateArgsSchema: z.ZodType<Prisma.ClubAggregateArgs> = z.object({
  where: ClubWhereInputSchema.optional(),
  orderBy: z.union([ ClubOrderByWithRelationInputSchema.array(),ClubOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ClubGroupByArgsSchema: z.ZodType<Prisma.ClubGroupByArgs> = z.object({
  where: ClubWhereInputSchema.optional(),
  orderBy: z.union([ ClubOrderByWithAggregationInputSchema.array(),ClubOrderByWithAggregationInputSchema ]).optional(),
  by: ClubScalarFieldEnumSchema.array(),
  having: ClubScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ClubFindUniqueArgsSchema: z.ZodType<Prisma.ClubFindUniqueArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereUniqueInputSchema,
}).strict() ;

export const ClubFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClubFindUniqueOrThrowArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereUniqueInputSchema,
}).strict() ;

export const ClubSupporterFindFirstArgsSchema: z.ZodType<Prisma.ClubSupporterFindFirstArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereInputSchema.optional(),
  orderBy: z.union([ ClubSupporterOrderByWithRelationInputSchema.array(),ClubSupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubSupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClubSupporterScalarFieldEnumSchema,ClubSupporterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClubSupporterFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ClubSupporterFindFirstOrThrowArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereInputSchema.optional(),
  orderBy: z.union([ ClubSupporterOrderByWithRelationInputSchema.array(),ClubSupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubSupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClubSupporterScalarFieldEnumSchema,ClubSupporterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClubSupporterFindManyArgsSchema: z.ZodType<Prisma.ClubSupporterFindManyArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereInputSchema.optional(),
  orderBy: z.union([ ClubSupporterOrderByWithRelationInputSchema.array(),ClubSupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubSupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ClubSupporterScalarFieldEnumSchema,ClubSupporterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ClubSupporterAggregateArgsSchema: z.ZodType<Prisma.ClubSupporterAggregateArgs> = z.object({
  where: ClubSupporterWhereInputSchema.optional(),
  orderBy: z.union([ ClubSupporterOrderByWithRelationInputSchema.array(),ClubSupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: ClubSupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ClubSupporterGroupByArgsSchema: z.ZodType<Prisma.ClubSupporterGroupByArgs> = z.object({
  where: ClubSupporterWhereInputSchema.optional(),
  orderBy: z.union([ ClubSupporterOrderByWithAggregationInputSchema.array(),ClubSupporterOrderByWithAggregationInputSchema ]).optional(),
  by: ClubSupporterScalarFieldEnumSchema.array(),
  having: ClubSupporterScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ClubSupporterFindUniqueArgsSchema: z.ZodType<Prisma.ClubSupporterFindUniqueArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereUniqueInputSchema,
}).strict() ;

export const ClubSupporterFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ClubSupporterFindUniqueOrThrowArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereUniqueInputSchema,
}).strict() ;

export const CountryFindFirstArgsSchema: z.ZodType<Prisma.CountryFindFirstArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountryScalarFieldEnumSchema,CountryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CountryFindFirstOrThrowArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountryScalarFieldEnumSchema,CountryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountryFindManyArgsSchema: z.ZodType<Prisma.CountryFindManyArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountryScalarFieldEnumSchema,CountryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountryAggregateArgsSchema: z.ZodType<Prisma.CountryAggregateArgs> = z.object({
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountryGroupByArgsSchema: z.ZodType<Prisma.CountryGroupByArgs> = z.object({
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithAggregationInputSchema.array(),CountryOrderByWithAggregationInputSchema ]).optional(),
  by: CountryScalarFieldEnumSchema.array(),
  having: CountryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountryFindUniqueArgsSchema: z.ZodType<Prisma.CountryFindUniqueArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CountryFindUniqueOrThrowArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountrySupporterFindFirstArgsSchema: z.ZodType<Prisma.CountrySupporterFindFirstArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereInputSchema.optional(),
  orderBy: z.union([ CountrySupporterOrderByWithRelationInputSchema.array(),CountrySupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: CountrySupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountrySupporterScalarFieldEnumSchema,CountrySupporterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountrySupporterFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CountrySupporterFindFirstOrThrowArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereInputSchema.optional(),
  orderBy: z.union([ CountrySupporterOrderByWithRelationInputSchema.array(),CountrySupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: CountrySupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountrySupporterScalarFieldEnumSchema,CountrySupporterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountrySupporterFindManyArgsSchema: z.ZodType<Prisma.CountrySupporterFindManyArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereInputSchema.optional(),
  orderBy: z.union([ CountrySupporterOrderByWithRelationInputSchema.array(),CountrySupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: CountrySupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountrySupporterScalarFieldEnumSchema,CountrySupporterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountrySupporterAggregateArgsSchema: z.ZodType<Prisma.CountrySupporterAggregateArgs> = z.object({
  where: CountrySupporterWhereInputSchema.optional(),
  orderBy: z.union([ CountrySupporterOrderByWithRelationInputSchema.array(),CountrySupporterOrderByWithRelationInputSchema ]).optional(),
  cursor: CountrySupporterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountrySupporterGroupByArgsSchema: z.ZodType<Prisma.CountrySupporterGroupByArgs> = z.object({
  where: CountrySupporterWhereInputSchema.optional(),
  orderBy: z.union([ CountrySupporterOrderByWithAggregationInputSchema.array(),CountrySupporterOrderByWithAggregationInputSchema ]).optional(),
  by: CountrySupporterScalarFieldEnumSchema.array(),
  having: CountrySupporterScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountrySupporterFindUniqueArgsSchema: z.ZodType<Prisma.CountrySupporterFindUniqueArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereUniqueInputSchema,
}).strict() ;

export const CountrySupporterFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CountrySupporterFindUniqueOrThrowArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereUniqueInputSchema,
}).strict() ;

export const DiffsFindFirstArgsSchema: z.ZodType<Prisma.DiffsFindFirstArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereInputSchema.optional(),
  orderBy: z.union([ DiffsOrderByWithRelationInputSchema.array(),DiffsOrderByWithRelationInputSchema ]).optional(),
  cursor: DiffsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DiffsScalarFieldEnumSchema,DiffsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DiffsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DiffsFindFirstOrThrowArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereInputSchema.optional(),
  orderBy: z.union([ DiffsOrderByWithRelationInputSchema.array(),DiffsOrderByWithRelationInputSchema ]).optional(),
  cursor: DiffsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DiffsScalarFieldEnumSchema,DiffsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DiffsFindManyArgsSchema: z.ZodType<Prisma.DiffsFindManyArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereInputSchema.optional(),
  orderBy: z.union([ DiffsOrderByWithRelationInputSchema.array(),DiffsOrderByWithRelationInputSchema ]).optional(),
  cursor: DiffsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DiffsScalarFieldEnumSchema,DiffsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DiffsAggregateArgsSchema: z.ZodType<Prisma.DiffsAggregateArgs> = z.object({
  where: DiffsWhereInputSchema.optional(),
  orderBy: z.union([ DiffsOrderByWithRelationInputSchema.array(),DiffsOrderByWithRelationInputSchema ]).optional(),
  cursor: DiffsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DiffsGroupByArgsSchema: z.ZodType<Prisma.DiffsGroupByArgs> = z.object({
  where: DiffsWhereInputSchema.optional(),
  orderBy: z.union([ DiffsOrderByWithAggregationInputSchema.array(),DiffsOrderByWithAggregationInputSchema ]).optional(),
  by: DiffsScalarFieldEnumSchema.array(),
  having: DiffsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DiffsFindUniqueArgsSchema: z.ZodType<Prisma.DiffsFindUniqueArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereUniqueInputSchema,
}).strict() ;

export const DiffsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DiffsFindUniqueOrThrowArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereUniqueInputSchema,
}).strict() ;

export const GameChatFindFirstArgsSchema: z.ZodType<Prisma.GameChatFindFirstArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereInputSchema.optional(),
  orderBy: z.union([ GameChatOrderByWithRelationInputSchema.array(),GameChatOrderByWithRelationInputSchema ]).optional(),
  cursor: GameChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameChatScalarFieldEnumSchema,GameChatScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameChatFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GameChatFindFirstOrThrowArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereInputSchema.optional(),
  orderBy: z.union([ GameChatOrderByWithRelationInputSchema.array(),GameChatOrderByWithRelationInputSchema ]).optional(),
  cursor: GameChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameChatScalarFieldEnumSchema,GameChatScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameChatFindManyArgsSchema: z.ZodType<Prisma.GameChatFindManyArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereInputSchema.optional(),
  orderBy: z.union([ GameChatOrderByWithRelationInputSchema.array(),GameChatOrderByWithRelationInputSchema ]).optional(),
  cursor: GameChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameChatScalarFieldEnumSchema,GameChatScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameChatAggregateArgsSchema: z.ZodType<Prisma.GameChatAggregateArgs> = z.object({
  where: GameChatWhereInputSchema.optional(),
  orderBy: z.union([ GameChatOrderByWithRelationInputSchema.array(),GameChatOrderByWithRelationInputSchema ]).optional(),
  cursor: GameChatWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GameChatGroupByArgsSchema: z.ZodType<Prisma.GameChatGroupByArgs> = z.object({
  where: GameChatWhereInputSchema.optional(),
  orderBy: z.union([ GameChatOrderByWithAggregationInputSchema.array(),GameChatOrderByWithAggregationInputSchema ]).optional(),
  by: GameChatScalarFieldEnumSchema.array(),
  having: GameChatScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GameChatFindUniqueArgsSchema: z.ZodType<Prisma.GameChatFindUniqueArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereUniqueInputSchema,
}).strict() ;

export const GameChatFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GameChatFindUniqueOrThrowArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereUniqueInputSchema,
}).strict() ;

export const GameDayFindFirstArgsSchema: z.ZodType<Prisma.GameDayFindFirstArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereInputSchema.optional(),
  orderBy: z.union([ GameDayOrderByWithRelationInputSchema.array(),GameDayOrderByWithRelationInputSchema ]).optional(),
  cursor: GameDayWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameDayScalarFieldEnumSchema,GameDayScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameDayFindFirstOrThrowArgsSchema: z.ZodType<Prisma.GameDayFindFirstOrThrowArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereInputSchema.optional(),
  orderBy: z.union([ GameDayOrderByWithRelationInputSchema.array(),GameDayOrderByWithRelationInputSchema ]).optional(),
  cursor: GameDayWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameDayScalarFieldEnumSchema,GameDayScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameDayFindManyArgsSchema: z.ZodType<Prisma.GameDayFindManyArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereInputSchema.optional(),
  orderBy: z.union([ GameDayOrderByWithRelationInputSchema.array(),GameDayOrderByWithRelationInputSchema ]).optional(),
  cursor: GameDayWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ GameDayScalarFieldEnumSchema,GameDayScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const GameDayAggregateArgsSchema: z.ZodType<Prisma.GameDayAggregateArgs> = z.object({
  where: GameDayWhereInputSchema.optional(),
  orderBy: z.union([ GameDayOrderByWithRelationInputSchema.array(),GameDayOrderByWithRelationInputSchema ]).optional(),
  cursor: GameDayWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GameDayGroupByArgsSchema: z.ZodType<Prisma.GameDayGroupByArgs> = z.object({
  where: GameDayWhereInputSchema.optional(),
  orderBy: z.union([ GameDayOrderByWithAggregationInputSchema.array(),GameDayOrderByWithAggregationInputSchema ]).optional(),
  by: GameDayScalarFieldEnumSchema.array(),
  having: GameDayScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const GameDayFindUniqueArgsSchema: z.ZodType<Prisma.GameDayFindUniqueArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereUniqueInputSchema,
}).strict() ;

export const GameDayFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.GameDayFindUniqueOrThrowArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereUniqueInputSchema,
}).strict() ;

export const InvitationFindFirstArgsSchema: z.ZodType<Prisma.InvitationFindFirstArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereInputSchema.optional(),
  orderBy: z.union([ InvitationOrderByWithRelationInputSchema.array(),InvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: InvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InvitationScalarFieldEnumSchema,InvitationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InvitationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InvitationFindFirstOrThrowArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereInputSchema.optional(),
  orderBy: z.union([ InvitationOrderByWithRelationInputSchema.array(),InvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: InvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InvitationScalarFieldEnumSchema,InvitationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InvitationFindManyArgsSchema: z.ZodType<Prisma.InvitationFindManyArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereInputSchema.optional(),
  orderBy: z.union([ InvitationOrderByWithRelationInputSchema.array(),InvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: InvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InvitationScalarFieldEnumSchema,InvitationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InvitationAggregateArgsSchema: z.ZodType<Prisma.InvitationAggregateArgs> = z.object({
  where: InvitationWhereInputSchema.optional(),
  orderBy: z.union([ InvitationOrderByWithRelationInputSchema.array(),InvitationOrderByWithRelationInputSchema ]).optional(),
  cursor: InvitationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InvitationGroupByArgsSchema: z.ZodType<Prisma.InvitationGroupByArgs> = z.object({
  where: InvitationWhereInputSchema.optional(),
  orderBy: z.union([ InvitationOrderByWithAggregationInputSchema.array(),InvitationOrderByWithAggregationInputSchema ]).optional(),
  by: InvitationScalarFieldEnumSchema.array(),
  having: InvitationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InvitationFindUniqueArgsSchema: z.ZodType<Prisma.InvitationFindUniqueArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereUniqueInputSchema,
}).strict() ;

export const InvitationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InvitationFindUniqueOrThrowArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereUniqueInputSchema,
}).strict() ;

export const OutcomeFindFirstArgsSchema: z.ZodType<Prisma.OutcomeFindFirstArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereInputSchema.optional(),
  orderBy: z.union([ OutcomeOrderByWithRelationInputSchema.array(),OutcomeOrderByWithRelationInputSchema ]).optional(),
  cursor: OutcomeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OutcomeScalarFieldEnumSchema,OutcomeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OutcomeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OutcomeFindFirstOrThrowArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereInputSchema.optional(),
  orderBy: z.union([ OutcomeOrderByWithRelationInputSchema.array(),OutcomeOrderByWithRelationInputSchema ]).optional(),
  cursor: OutcomeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OutcomeScalarFieldEnumSchema,OutcomeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OutcomeFindManyArgsSchema: z.ZodType<Prisma.OutcomeFindManyArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereInputSchema.optional(),
  orderBy: z.union([ OutcomeOrderByWithRelationInputSchema.array(),OutcomeOrderByWithRelationInputSchema ]).optional(),
  cursor: OutcomeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OutcomeScalarFieldEnumSchema,OutcomeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OutcomeAggregateArgsSchema: z.ZodType<Prisma.OutcomeAggregateArgs> = z.object({
  where: OutcomeWhereInputSchema.optional(),
  orderBy: z.union([ OutcomeOrderByWithRelationInputSchema.array(),OutcomeOrderByWithRelationInputSchema ]).optional(),
  cursor: OutcomeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OutcomeGroupByArgsSchema: z.ZodType<Prisma.OutcomeGroupByArgs> = z.object({
  where: OutcomeWhereInputSchema.optional(),
  orderBy: z.union([ OutcomeOrderByWithAggregationInputSchema.array(),OutcomeOrderByWithAggregationInputSchema ]).optional(),
  by: OutcomeScalarFieldEnumSchema.array(),
  having: OutcomeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OutcomeFindUniqueArgsSchema: z.ZodType<Prisma.OutcomeFindUniqueArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereUniqueInputSchema,
}).strict() ;

export const OutcomeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OutcomeFindUniqueOrThrowArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereUniqueInputSchema,
}).strict() ;

export const PickerFindFirstArgsSchema: z.ZodType<Prisma.PickerFindFirstArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereInputSchema.optional(),
  orderBy: z.union([ PickerOrderByWithRelationInputSchema.array(),PickerOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickerScalarFieldEnumSchema,PickerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PickerFindFirstOrThrowArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereInputSchema.optional(),
  orderBy: z.union([ PickerOrderByWithRelationInputSchema.array(),PickerOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickerScalarFieldEnumSchema,PickerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickerFindManyArgsSchema: z.ZodType<Prisma.PickerFindManyArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereInputSchema.optional(),
  orderBy: z.union([ PickerOrderByWithRelationInputSchema.array(),PickerOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickerScalarFieldEnumSchema,PickerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickerAggregateArgsSchema: z.ZodType<Prisma.PickerAggregateArgs> = z.object({
  where: PickerWhereInputSchema.optional(),
  orderBy: z.union([ PickerOrderByWithRelationInputSchema.array(),PickerOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PickerGroupByArgsSchema: z.ZodType<Prisma.PickerGroupByArgs> = z.object({
  where: PickerWhereInputSchema.optional(),
  orderBy: z.union([ PickerOrderByWithAggregationInputSchema.array(),PickerOrderByWithAggregationInputSchema ]).optional(),
  by: PickerScalarFieldEnumSchema.array(),
  having: PickerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PickerFindUniqueArgsSchema: z.ZodType<Prisma.PickerFindUniqueArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereUniqueInputSchema,
}).strict() ;

export const PickerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PickerFindUniqueOrThrowArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereUniqueInputSchema,
}).strict() ;

export const PickerTeamsFindFirstArgsSchema: z.ZodType<Prisma.PickerTeamsFindFirstArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereInputSchema.optional(),
  orderBy: z.union([ PickerTeamsOrderByWithRelationInputSchema.array(),PickerTeamsOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerTeamsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickerTeamsScalarFieldEnumSchema,PickerTeamsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickerTeamsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PickerTeamsFindFirstOrThrowArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereInputSchema.optional(),
  orderBy: z.union([ PickerTeamsOrderByWithRelationInputSchema.array(),PickerTeamsOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerTeamsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickerTeamsScalarFieldEnumSchema,PickerTeamsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickerTeamsFindManyArgsSchema: z.ZodType<Prisma.PickerTeamsFindManyArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereInputSchema.optional(),
  orderBy: z.union([ PickerTeamsOrderByWithRelationInputSchema.array(),PickerTeamsOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerTeamsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickerTeamsScalarFieldEnumSchema,PickerTeamsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickerTeamsAggregateArgsSchema: z.ZodType<Prisma.PickerTeamsAggregateArgs> = z.object({
  where: PickerTeamsWhereInputSchema.optional(),
  orderBy: z.union([ PickerTeamsOrderByWithRelationInputSchema.array(),PickerTeamsOrderByWithRelationInputSchema ]).optional(),
  cursor: PickerTeamsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PickerTeamsGroupByArgsSchema: z.ZodType<Prisma.PickerTeamsGroupByArgs> = z.object({
  where: PickerTeamsWhereInputSchema.optional(),
  orderBy: z.union([ PickerTeamsOrderByWithAggregationInputSchema.array(),PickerTeamsOrderByWithAggregationInputSchema ]).optional(),
  by: PickerTeamsScalarFieldEnumSchema.array(),
  having: PickerTeamsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PickerTeamsFindUniqueArgsSchema: z.ZodType<Prisma.PickerTeamsFindUniqueArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereUniqueInputSchema,
}).strict() ;

export const PickerTeamsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PickerTeamsFindUniqueOrThrowArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereUniqueInputSchema,
}).strict() ;

export const PlayerFindFirstArgsSchema: z.ZodType<Prisma.PlayerFindFirstArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereInputSchema.optional(),
  orderBy: z.union([ PlayerOrderByWithRelationInputSchema.array(),PlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlayerScalarFieldEnumSchema,PlayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlayerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PlayerFindFirstOrThrowArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereInputSchema.optional(),
  orderBy: z.union([ PlayerOrderByWithRelationInputSchema.array(),PlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlayerScalarFieldEnumSchema,PlayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlayerFindManyArgsSchema: z.ZodType<Prisma.PlayerFindManyArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereInputSchema.optional(),
  orderBy: z.union([ PlayerOrderByWithRelationInputSchema.array(),PlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlayerScalarFieldEnumSchema,PlayerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlayerAggregateArgsSchema: z.ZodType<Prisma.PlayerAggregateArgs> = z.object({
  where: PlayerWhereInputSchema.optional(),
  orderBy: z.union([ PlayerOrderByWithRelationInputSchema.array(),PlayerOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlayerGroupByArgsSchema: z.ZodType<Prisma.PlayerGroupByArgs> = z.object({
  where: PlayerWhereInputSchema.optional(),
  orderBy: z.union([ PlayerOrderByWithAggregationInputSchema.array(),PlayerOrderByWithAggregationInputSchema ]).optional(),
  by: PlayerScalarFieldEnumSchema.array(),
  having: PlayerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlayerFindUniqueArgsSchema: z.ZodType<Prisma.PlayerFindUniqueArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereUniqueInputSchema,
}).strict() ;

export const PlayerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PlayerFindUniqueOrThrowArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereUniqueInputSchema,
}).strict() ;

export const PlayerRecordFindFirstArgsSchema: z.ZodType<Prisma.PlayerRecordFindFirstArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereInputSchema.optional(),
  orderBy: z.union([ PlayerRecordOrderByWithRelationInputSchema.array(),PlayerRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlayerRecordScalarFieldEnumSchema,PlayerRecordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlayerRecordFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PlayerRecordFindFirstOrThrowArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereInputSchema.optional(),
  orderBy: z.union([ PlayerRecordOrderByWithRelationInputSchema.array(),PlayerRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlayerRecordScalarFieldEnumSchema,PlayerRecordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlayerRecordFindManyArgsSchema: z.ZodType<Prisma.PlayerRecordFindManyArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereInputSchema.optional(),
  orderBy: z.union([ PlayerRecordOrderByWithRelationInputSchema.array(),PlayerRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PlayerRecordScalarFieldEnumSchema,PlayerRecordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PlayerRecordAggregateArgsSchema: z.ZodType<Prisma.PlayerRecordAggregateArgs> = z.object({
  where: PlayerRecordWhereInputSchema.optional(),
  orderBy: z.union([ PlayerRecordOrderByWithRelationInputSchema.array(),PlayerRecordOrderByWithRelationInputSchema ]).optional(),
  cursor: PlayerRecordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlayerRecordGroupByArgsSchema: z.ZodType<Prisma.PlayerRecordGroupByArgs> = z.object({
  where: PlayerRecordWhereInputSchema.optional(),
  orderBy: z.union([ PlayerRecordOrderByWithAggregationInputSchema.array(),PlayerRecordOrderByWithAggregationInputSchema ]).optional(),
  by: PlayerRecordScalarFieldEnumSchema.array(),
  having: PlayerRecordScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PlayerRecordFindUniqueArgsSchema: z.ZodType<Prisma.PlayerRecordFindUniqueArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereUniqueInputSchema,
}).strict() ;

export const PlayerRecordFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PlayerRecordFindUniqueOrThrowArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const VerificationFindFirstArgsSchema: z.ZodType<Prisma.VerificationFindFirstArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema,VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindFirstOrThrowArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema,VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationFindManyArgsSchema: z.ZodType<Prisma.VerificationFindManyArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema,VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationAggregateArgsSchema: z.ZodType<Prisma.VerificationAggregateArgs> = z.object({
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(),VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationGroupByArgsSchema: z.ZodType<Prisma.VerificationGroupByArgs> = z.object({
  where: VerificationWhereInputSchema.optional(),
  orderBy: z.union([ VerificationOrderByWithAggregationInputSchema.array(),VerificationOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationScalarFieldEnumSchema.array(),
  having: VerificationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationFindUniqueArgsSchema: z.ZodType<Prisma.VerificationFindUniqueArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const VerificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const ArseCreateArgsSchema: z.ZodType<Prisma.ArseCreateArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  data: z.union([ ArseCreateInputSchema,ArseUncheckedCreateInputSchema ]),
}).strict() ;

export const ArseUpsertArgsSchema: z.ZodType<Prisma.ArseUpsertArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereUniqueInputSchema,
  create: z.union([ ArseCreateInputSchema,ArseUncheckedCreateInputSchema ]),
  update: z.union([ ArseUpdateInputSchema,ArseUncheckedUpdateInputSchema ]),
}).strict() ;

export const ArseCreateManyArgsSchema: z.ZodType<Prisma.ArseCreateManyArgs> = z.object({
  data: z.union([ ArseCreateManyInputSchema,ArseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ArseDeleteArgsSchema: z.ZodType<Prisma.ArseDeleteArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  where: ArseWhereUniqueInputSchema,
}).strict() ;

export const ArseUpdateArgsSchema: z.ZodType<Prisma.ArseUpdateArgs> = z.object({
  select: ArseSelectSchema.optional(),
  include: ArseIncludeSchema.optional(),
  data: z.union([ ArseUpdateInputSchema,ArseUncheckedUpdateInputSchema ]),
  where: ArseWhereUniqueInputSchema,
}).strict() ;

export const ArseUpdateManyArgsSchema: z.ZodType<Prisma.ArseUpdateManyArgs> = z.object({
  data: z.union([ ArseUpdateManyMutationInputSchema,ArseUncheckedUpdateManyInputSchema ]),
  where: ArseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ArseDeleteManyArgsSchema: z.ZodType<Prisma.ArseDeleteManyArgs> = z.object({
  where: ArseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ClubCreateArgsSchema: z.ZodType<Prisma.ClubCreateArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  data: z.union([ ClubCreateInputSchema,ClubUncheckedCreateInputSchema ]),
}).strict() ;

export const ClubUpsertArgsSchema: z.ZodType<Prisma.ClubUpsertArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereUniqueInputSchema,
  create: z.union([ ClubCreateInputSchema,ClubUncheckedCreateInputSchema ]),
  update: z.union([ ClubUpdateInputSchema,ClubUncheckedUpdateInputSchema ]),
}).strict() ;

export const ClubCreateManyArgsSchema: z.ZodType<Prisma.ClubCreateManyArgs> = z.object({
  data: z.union([ ClubCreateManyInputSchema,ClubCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ClubDeleteArgsSchema: z.ZodType<Prisma.ClubDeleteArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  where: ClubWhereUniqueInputSchema,
}).strict() ;

export const ClubUpdateArgsSchema: z.ZodType<Prisma.ClubUpdateArgs> = z.object({
  select: ClubSelectSchema.optional(),
  include: ClubIncludeSchema.optional(),
  data: z.union([ ClubUpdateInputSchema,ClubUncheckedUpdateInputSchema ]),
  where: ClubWhereUniqueInputSchema,
}).strict() ;

export const ClubUpdateManyArgsSchema: z.ZodType<Prisma.ClubUpdateManyArgs> = z.object({
  data: z.union([ ClubUpdateManyMutationInputSchema,ClubUncheckedUpdateManyInputSchema ]),
  where: ClubWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ClubDeleteManyArgsSchema: z.ZodType<Prisma.ClubDeleteManyArgs> = z.object({
  where: ClubWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ClubSupporterCreateArgsSchema: z.ZodType<Prisma.ClubSupporterCreateArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  data: z.union([ ClubSupporterCreateInputSchema,ClubSupporterUncheckedCreateInputSchema ]),
}).strict() ;

export const ClubSupporterUpsertArgsSchema: z.ZodType<Prisma.ClubSupporterUpsertArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereUniqueInputSchema,
  create: z.union([ ClubSupporterCreateInputSchema,ClubSupporterUncheckedCreateInputSchema ]),
  update: z.union([ ClubSupporterUpdateInputSchema,ClubSupporterUncheckedUpdateInputSchema ]),
}).strict() ;

export const ClubSupporterCreateManyArgsSchema: z.ZodType<Prisma.ClubSupporterCreateManyArgs> = z.object({
  data: z.union([ ClubSupporterCreateManyInputSchema,ClubSupporterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ClubSupporterDeleteArgsSchema: z.ZodType<Prisma.ClubSupporterDeleteArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  where: ClubSupporterWhereUniqueInputSchema,
}).strict() ;

export const ClubSupporterUpdateArgsSchema: z.ZodType<Prisma.ClubSupporterUpdateArgs> = z.object({
  select: ClubSupporterSelectSchema.optional(),
  include: ClubSupporterIncludeSchema.optional(),
  data: z.union([ ClubSupporterUpdateInputSchema,ClubSupporterUncheckedUpdateInputSchema ]),
  where: ClubSupporterWhereUniqueInputSchema,
}).strict() ;

export const ClubSupporterUpdateManyArgsSchema: z.ZodType<Prisma.ClubSupporterUpdateManyArgs> = z.object({
  data: z.union([ ClubSupporterUpdateManyMutationInputSchema,ClubSupporterUncheckedUpdateManyInputSchema ]),
  where: ClubSupporterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ClubSupporterDeleteManyArgsSchema: z.ZodType<Prisma.ClubSupporterDeleteManyArgs> = z.object({
  where: ClubSupporterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountryCreateArgsSchema: z.ZodType<Prisma.CountryCreateArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  data: z.union([ CountryCreateInputSchema,CountryUncheckedCreateInputSchema ]),
}).strict() ;

export const CountryUpsertArgsSchema: z.ZodType<Prisma.CountryUpsertArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
  create: z.union([ CountryCreateInputSchema,CountryUncheckedCreateInputSchema ]),
  update: z.union([ CountryUpdateInputSchema,CountryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CountryCreateManyArgsSchema: z.ZodType<Prisma.CountryCreateManyArgs> = z.object({
  data: z.union([ CountryCreateManyInputSchema,CountryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CountryDeleteArgsSchema: z.ZodType<Prisma.CountryDeleteArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountryUpdateArgsSchema: z.ZodType<Prisma.CountryUpdateArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  data: z.union([ CountryUpdateInputSchema,CountryUncheckedUpdateInputSchema ]),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountryUpdateManyArgsSchema: z.ZodType<Prisma.CountryUpdateManyArgs> = z.object({
  data: z.union([ CountryUpdateManyMutationInputSchema,CountryUncheckedUpdateManyInputSchema ]),
  where: CountryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountryDeleteManyArgsSchema: z.ZodType<Prisma.CountryDeleteManyArgs> = z.object({
  where: CountryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountrySupporterCreateArgsSchema: z.ZodType<Prisma.CountrySupporterCreateArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  data: z.union([ CountrySupporterCreateInputSchema,CountrySupporterUncheckedCreateInputSchema ]),
}).strict() ;

export const CountrySupporterUpsertArgsSchema: z.ZodType<Prisma.CountrySupporterUpsertArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereUniqueInputSchema,
  create: z.union([ CountrySupporterCreateInputSchema,CountrySupporterUncheckedCreateInputSchema ]),
  update: z.union([ CountrySupporterUpdateInputSchema,CountrySupporterUncheckedUpdateInputSchema ]),
}).strict() ;

export const CountrySupporterCreateManyArgsSchema: z.ZodType<Prisma.CountrySupporterCreateManyArgs> = z.object({
  data: z.union([ CountrySupporterCreateManyInputSchema,CountrySupporterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CountrySupporterDeleteArgsSchema: z.ZodType<Prisma.CountrySupporterDeleteArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  where: CountrySupporterWhereUniqueInputSchema,
}).strict() ;

export const CountrySupporterUpdateArgsSchema: z.ZodType<Prisma.CountrySupporterUpdateArgs> = z.object({
  select: CountrySupporterSelectSchema.optional(),
  include: CountrySupporterIncludeSchema.optional(),
  data: z.union([ CountrySupporterUpdateInputSchema,CountrySupporterUncheckedUpdateInputSchema ]),
  where: CountrySupporterWhereUniqueInputSchema,
}).strict() ;

export const CountrySupporterUpdateManyArgsSchema: z.ZodType<Prisma.CountrySupporterUpdateManyArgs> = z.object({
  data: z.union([ CountrySupporterUpdateManyMutationInputSchema,CountrySupporterUncheckedUpdateManyInputSchema ]),
  where: CountrySupporterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountrySupporterDeleteManyArgsSchema: z.ZodType<Prisma.CountrySupporterDeleteManyArgs> = z.object({
  where: CountrySupporterWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DiffsCreateArgsSchema: z.ZodType<Prisma.DiffsCreateArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  data: z.union([ DiffsCreateInputSchema,DiffsUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const DiffsUpsertArgsSchema: z.ZodType<Prisma.DiffsUpsertArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereUniqueInputSchema,
  create: z.union([ DiffsCreateInputSchema,DiffsUncheckedCreateInputSchema ]),
  update: z.union([ DiffsUpdateInputSchema,DiffsUncheckedUpdateInputSchema ]),
}).strict() ;

export const DiffsCreateManyArgsSchema: z.ZodType<Prisma.DiffsCreateManyArgs> = z.object({
  data: z.union([ DiffsCreateManyInputSchema,DiffsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DiffsDeleteArgsSchema: z.ZodType<Prisma.DiffsDeleteArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  where: DiffsWhereUniqueInputSchema,
}).strict() ;

export const DiffsUpdateArgsSchema: z.ZodType<Prisma.DiffsUpdateArgs> = z.object({
  select: DiffsSelectSchema.optional(),
  data: z.union([ DiffsUpdateInputSchema,DiffsUncheckedUpdateInputSchema ]),
  where: DiffsWhereUniqueInputSchema,
}).strict() ;

export const DiffsUpdateManyArgsSchema: z.ZodType<Prisma.DiffsUpdateManyArgs> = z.object({
  data: z.union([ DiffsUpdateManyMutationInputSchema,DiffsUncheckedUpdateManyInputSchema ]),
  where: DiffsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DiffsDeleteManyArgsSchema: z.ZodType<Prisma.DiffsDeleteManyArgs> = z.object({
  where: DiffsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameChatCreateArgsSchema: z.ZodType<Prisma.GameChatCreateArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  data: z.union([ GameChatCreateInputSchema,GameChatUncheckedCreateInputSchema ]),
}).strict() ;

export const GameChatUpsertArgsSchema: z.ZodType<Prisma.GameChatUpsertArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereUniqueInputSchema,
  create: z.union([ GameChatCreateInputSchema,GameChatUncheckedCreateInputSchema ]),
  update: z.union([ GameChatUpdateInputSchema,GameChatUncheckedUpdateInputSchema ]),
}).strict() ;

export const GameChatCreateManyArgsSchema: z.ZodType<Prisma.GameChatCreateManyArgs> = z.object({
  data: z.union([ GameChatCreateManyInputSchema,GameChatCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GameChatDeleteArgsSchema: z.ZodType<Prisma.GameChatDeleteArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  where: GameChatWhereUniqueInputSchema,
}).strict() ;

export const GameChatUpdateArgsSchema: z.ZodType<Prisma.GameChatUpdateArgs> = z.object({
  select: GameChatSelectSchema.optional(),
  data: z.union([ GameChatUpdateInputSchema,GameChatUncheckedUpdateInputSchema ]),
  where: GameChatWhereUniqueInputSchema,
}).strict() ;

export const GameChatUpdateManyArgsSchema: z.ZodType<Prisma.GameChatUpdateManyArgs> = z.object({
  data: z.union([ GameChatUpdateManyMutationInputSchema,GameChatUncheckedUpdateManyInputSchema ]),
  where: GameChatWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameChatDeleteManyArgsSchema: z.ZodType<Prisma.GameChatDeleteManyArgs> = z.object({
  where: GameChatWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameDayCreateArgsSchema: z.ZodType<Prisma.GameDayCreateArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  data: z.union([ GameDayCreateInputSchema,GameDayUncheckedCreateInputSchema ]),
}).strict() ;

export const GameDayUpsertArgsSchema: z.ZodType<Prisma.GameDayUpsertArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereUniqueInputSchema,
  create: z.union([ GameDayCreateInputSchema,GameDayUncheckedCreateInputSchema ]),
  update: z.union([ GameDayUpdateInputSchema,GameDayUncheckedUpdateInputSchema ]),
}).strict() ;

export const GameDayCreateManyArgsSchema: z.ZodType<Prisma.GameDayCreateManyArgs> = z.object({
  data: z.union([ GameDayCreateManyInputSchema,GameDayCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const GameDayDeleteArgsSchema: z.ZodType<Prisma.GameDayDeleteArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  where: GameDayWhereUniqueInputSchema,
}).strict() ;

export const GameDayUpdateArgsSchema: z.ZodType<Prisma.GameDayUpdateArgs> = z.object({
  select: GameDaySelectSchema.optional(),
  include: GameDayIncludeSchema.optional(),
  data: z.union([ GameDayUpdateInputSchema,GameDayUncheckedUpdateInputSchema ]),
  where: GameDayWhereUniqueInputSchema,
}).strict() ;

export const GameDayUpdateManyArgsSchema: z.ZodType<Prisma.GameDayUpdateManyArgs> = z.object({
  data: z.union([ GameDayUpdateManyMutationInputSchema,GameDayUncheckedUpdateManyInputSchema ]),
  where: GameDayWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const GameDayDeleteManyArgsSchema: z.ZodType<Prisma.GameDayDeleteManyArgs> = z.object({
  where: GameDayWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InvitationCreateArgsSchema: z.ZodType<Prisma.InvitationCreateArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  data: z.union([ InvitationCreateInputSchema,InvitationUncheckedCreateInputSchema ]),
}).strict() ;

export const InvitationUpsertArgsSchema: z.ZodType<Prisma.InvitationUpsertArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereUniqueInputSchema,
  create: z.union([ InvitationCreateInputSchema,InvitationUncheckedCreateInputSchema ]),
  update: z.union([ InvitationUpdateInputSchema,InvitationUncheckedUpdateInputSchema ]),
}).strict() ;

export const InvitationCreateManyArgsSchema: z.ZodType<Prisma.InvitationCreateManyArgs> = z.object({
  data: z.union([ InvitationCreateManyInputSchema,InvitationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InvitationDeleteArgsSchema: z.ZodType<Prisma.InvitationDeleteArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  where: InvitationWhereUniqueInputSchema,
}).strict() ;

export const InvitationUpdateArgsSchema: z.ZodType<Prisma.InvitationUpdateArgs> = z.object({
  select: InvitationSelectSchema.optional(),
  data: z.union([ InvitationUpdateInputSchema,InvitationUncheckedUpdateInputSchema ]),
  where: InvitationWhereUniqueInputSchema,
}).strict() ;

export const InvitationUpdateManyArgsSchema: z.ZodType<Prisma.InvitationUpdateManyArgs> = z.object({
  data: z.union([ InvitationUpdateManyMutationInputSchema,InvitationUncheckedUpdateManyInputSchema ]),
  where: InvitationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InvitationDeleteManyArgsSchema: z.ZodType<Prisma.InvitationDeleteManyArgs> = z.object({
  where: InvitationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OutcomeCreateArgsSchema: z.ZodType<Prisma.OutcomeCreateArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  data: z.union([ OutcomeCreateInputSchema,OutcomeUncheckedCreateInputSchema ]),
}).strict() ;

export const OutcomeUpsertArgsSchema: z.ZodType<Prisma.OutcomeUpsertArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereUniqueInputSchema,
  create: z.union([ OutcomeCreateInputSchema,OutcomeUncheckedCreateInputSchema ]),
  update: z.union([ OutcomeUpdateInputSchema,OutcomeUncheckedUpdateInputSchema ]),
}).strict() ;

export const OutcomeCreateManyArgsSchema: z.ZodType<Prisma.OutcomeCreateManyArgs> = z.object({
  data: z.union([ OutcomeCreateManyInputSchema,OutcomeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OutcomeDeleteArgsSchema: z.ZodType<Prisma.OutcomeDeleteArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  where: OutcomeWhereUniqueInputSchema,
}).strict() ;

export const OutcomeUpdateArgsSchema: z.ZodType<Prisma.OutcomeUpdateArgs> = z.object({
  select: OutcomeSelectSchema.optional(),
  include: OutcomeIncludeSchema.optional(),
  data: z.union([ OutcomeUpdateInputSchema,OutcomeUncheckedUpdateInputSchema ]),
  where: OutcomeWhereUniqueInputSchema,
}).strict() ;

export const OutcomeUpdateManyArgsSchema: z.ZodType<Prisma.OutcomeUpdateManyArgs> = z.object({
  data: z.union([ OutcomeUpdateManyMutationInputSchema,OutcomeUncheckedUpdateManyInputSchema ]),
  where: OutcomeWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const OutcomeDeleteManyArgsSchema: z.ZodType<Prisma.OutcomeDeleteManyArgs> = z.object({
  where: OutcomeWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PickerCreateArgsSchema: z.ZodType<Prisma.PickerCreateArgs> = z.object({
  select: PickerSelectSchema.optional(),
  data: z.union([ PickerCreateInputSchema,PickerUncheckedCreateInputSchema ]),
}).strict() ;

export const PickerUpsertArgsSchema: z.ZodType<Prisma.PickerUpsertArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereUniqueInputSchema,
  create: z.union([ PickerCreateInputSchema,PickerUncheckedCreateInputSchema ]),
  update: z.union([ PickerUpdateInputSchema,PickerUncheckedUpdateInputSchema ]),
}).strict() ;

export const PickerCreateManyArgsSchema: z.ZodType<Prisma.PickerCreateManyArgs> = z.object({
  data: z.union([ PickerCreateManyInputSchema,PickerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PickerDeleteArgsSchema: z.ZodType<Prisma.PickerDeleteArgs> = z.object({
  select: PickerSelectSchema.optional(),
  where: PickerWhereUniqueInputSchema,
}).strict() ;

export const PickerUpdateArgsSchema: z.ZodType<Prisma.PickerUpdateArgs> = z.object({
  select: PickerSelectSchema.optional(),
  data: z.union([ PickerUpdateInputSchema,PickerUncheckedUpdateInputSchema ]),
  where: PickerWhereUniqueInputSchema,
}).strict() ;

export const PickerUpdateManyArgsSchema: z.ZodType<Prisma.PickerUpdateManyArgs> = z.object({
  data: z.union([ PickerUpdateManyMutationInputSchema,PickerUncheckedUpdateManyInputSchema ]),
  where: PickerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PickerDeleteManyArgsSchema: z.ZodType<Prisma.PickerDeleteManyArgs> = z.object({
  where: PickerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PickerTeamsCreateArgsSchema: z.ZodType<Prisma.PickerTeamsCreateArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  data: z.union([ PickerTeamsCreateInputSchema,PickerTeamsUncheckedCreateInputSchema ]),
}).strict() ;

export const PickerTeamsUpsertArgsSchema: z.ZodType<Prisma.PickerTeamsUpsertArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereUniqueInputSchema,
  create: z.union([ PickerTeamsCreateInputSchema,PickerTeamsUncheckedCreateInputSchema ]),
  update: z.union([ PickerTeamsUpdateInputSchema,PickerTeamsUncheckedUpdateInputSchema ]),
}).strict() ;

export const PickerTeamsCreateManyArgsSchema: z.ZodType<Prisma.PickerTeamsCreateManyArgs> = z.object({
  data: z.union([ PickerTeamsCreateManyInputSchema,PickerTeamsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PickerTeamsDeleteArgsSchema: z.ZodType<Prisma.PickerTeamsDeleteArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  where: PickerTeamsWhereUniqueInputSchema,
}).strict() ;

export const PickerTeamsUpdateArgsSchema: z.ZodType<Prisma.PickerTeamsUpdateArgs> = z.object({
  select: PickerTeamsSelectSchema.optional(),
  data: z.union([ PickerTeamsUpdateInputSchema,PickerTeamsUncheckedUpdateInputSchema ]),
  where: PickerTeamsWhereUniqueInputSchema,
}).strict() ;

export const PickerTeamsUpdateManyArgsSchema: z.ZodType<Prisma.PickerTeamsUpdateManyArgs> = z.object({
  data: z.union([ PickerTeamsUpdateManyMutationInputSchema,PickerTeamsUncheckedUpdateManyInputSchema ]),
  where: PickerTeamsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PickerTeamsDeleteManyArgsSchema: z.ZodType<Prisma.PickerTeamsDeleteManyArgs> = z.object({
  where: PickerTeamsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlayerCreateArgsSchema: z.ZodType<Prisma.PlayerCreateArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  data: z.union([ PlayerCreateInputSchema,PlayerUncheckedCreateInputSchema ]),
}).strict() ;

export const PlayerUpsertArgsSchema: z.ZodType<Prisma.PlayerUpsertArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereUniqueInputSchema,
  create: z.union([ PlayerCreateInputSchema,PlayerUncheckedCreateInputSchema ]),
  update: z.union([ PlayerUpdateInputSchema,PlayerUncheckedUpdateInputSchema ]),
}).strict() ;

export const PlayerCreateManyArgsSchema: z.ZodType<Prisma.PlayerCreateManyArgs> = z.object({
  data: z.union([ PlayerCreateManyInputSchema,PlayerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PlayerDeleteArgsSchema: z.ZodType<Prisma.PlayerDeleteArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  where: PlayerWhereUniqueInputSchema,
}).strict() ;

export const PlayerUpdateArgsSchema: z.ZodType<Prisma.PlayerUpdateArgs> = z.object({
  select: PlayerSelectSchema.optional(),
  include: PlayerIncludeSchema.optional(),
  data: z.union([ PlayerUpdateInputSchema,PlayerUncheckedUpdateInputSchema ]),
  where: PlayerWhereUniqueInputSchema,
}).strict() ;

export const PlayerUpdateManyArgsSchema: z.ZodType<Prisma.PlayerUpdateManyArgs> = z.object({
  data: z.union([ PlayerUpdateManyMutationInputSchema,PlayerUncheckedUpdateManyInputSchema ]),
  where: PlayerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlayerDeleteManyArgsSchema: z.ZodType<Prisma.PlayerDeleteManyArgs> = z.object({
  where: PlayerWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlayerRecordCreateArgsSchema: z.ZodType<Prisma.PlayerRecordCreateArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  data: z.union([ PlayerRecordCreateInputSchema,PlayerRecordUncheckedCreateInputSchema ]),
}).strict() ;

export const PlayerRecordUpsertArgsSchema: z.ZodType<Prisma.PlayerRecordUpsertArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereUniqueInputSchema,
  create: z.union([ PlayerRecordCreateInputSchema,PlayerRecordUncheckedCreateInputSchema ]),
  update: z.union([ PlayerRecordUpdateInputSchema,PlayerRecordUncheckedUpdateInputSchema ]),
}).strict() ;

export const PlayerRecordCreateManyArgsSchema: z.ZodType<Prisma.PlayerRecordCreateManyArgs> = z.object({
  data: z.union([ PlayerRecordCreateManyInputSchema,PlayerRecordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PlayerRecordDeleteArgsSchema: z.ZodType<Prisma.PlayerRecordDeleteArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  where: PlayerRecordWhereUniqueInputSchema,
}).strict() ;

export const PlayerRecordUpdateArgsSchema: z.ZodType<Prisma.PlayerRecordUpdateArgs> = z.object({
  select: PlayerRecordSelectSchema.optional(),
  include: PlayerRecordIncludeSchema.optional(),
  data: z.union([ PlayerRecordUpdateInputSchema,PlayerRecordUncheckedUpdateInputSchema ]),
  where: PlayerRecordWhereUniqueInputSchema,
}).strict() ;

export const PlayerRecordUpdateManyArgsSchema: z.ZodType<Prisma.PlayerRecordUpdateManyArgs> = z.object({
  data: z.union([ PlayerRecordUpdateManyMutationInputSchema,PlayerRecordUncheckedUpdateManyInputSchema ]),
  where: PlayerRecordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PlayerRecordDeleteManyArgsSchema: z.ZodType<Prisma.PlayerRecordDeleteManyArgs> = z.object({
  where: PlayerRecordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationCreateArgsSchema: z.ZodType<Prisma.VerificationCreateArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  data: z.union([ VerificationCreateInputSchema,VerificationUncheckedCreateInputSchema ]),
}).strict() ;

export const VerificationUpsertArgsSchema: z.ZodType<Prisma.VerificationUpsertArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
  create: z.union([ VerificationCreateInputSchema,VerificationUncheckedCreateInputSchema ]),
  update: z.union([ VerificationUpdateInputSchema,VerificationUncheckedUpdateInputSchema ]),
}).strict() ;

export const VerificationCreateManyArgsSchema: z.ZodType<Prisma.VerificationCreateManyArgs> = z.object({
  data: z.union([ VerificationCreateManyInputSchema,VerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationDeleteArgsSchema: z.ZodType<Prisma.VerificationDeleteArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const VerificationUpdateArgsSchema: z.ZodType<Prisma.VerificationUpdateArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  data: z.union([ VerificationUpdateInputSchema,VerificationUncheckedUpdateInputSchema ]),
  where: VerificationWhereUniqueInputSchema,
}).strict() ;

export const VerificationUpdateManyArgsSchema: z.ZodType<Prisma.VerificationUpdateManyArgs> = z.object({
  data: z.union([ VerificationUpdateManyMutationInputSchema,VerificationUncheckedUpdateManyInputSchema ]),
  where: VerificationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationDeleteManyArgsSchema: z.ZodType<Prisma.VerificationDeleteManyArgs> = z.object({
  where: VerificationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;