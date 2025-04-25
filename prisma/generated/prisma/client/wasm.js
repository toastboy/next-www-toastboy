
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ArseScalarFieldEnum = {
  id: 'id',
  stamp: 'stamp',
  inGoal: 'inGoal',
  running: 'running',
  shooting: 'shooting',
  passing: 'passing',
  ballSkill: 'ballSkill',
  attacking: 'attacking',
  defending: 'defending',
  playerId: 'playerId',
  raterId: 'raterId'
};

exports.Prisma.ClubScalarFieldEnum = {
  id: 'id',
  soccerwayId: 'soccerwayId',
  clubName: 'clubName',
  uri: 'uri',
  country: 'country'
};

exports.Prisma.ClubSupporterScalarFieldEnum = {
  playerId: 'playerId',
  clubId: 'clubId'
};

exports.Prisma.CountryScalarFieldEnum = {
  isoCode: 'isoCode',
  name: 'name'
};

exports.Prisma.CountrySupporterScalarFieldEnum = {
  playerId: 'playerId',
  countryISOCode: 'countryISOCode'
};

exports.Prisma.DiffsScalarFieldEnum = {
  id: 'id',
  a: 'a',
  b: 'b',
  diffAge: 'diffAge',
  diffUnknownAge: 'diffUnknownAge',
  diffGoalies: 'diffGoalies',
  diffAverage: 'diffAverage',
  diffPlayed: 'diffPlayed'
};

exports.Prisma.GameChatScalarFieldEnum = {
  id: 'id',
  gameDay: 'gameDay',
  stamp: 'stamp',
  player: 'player',
  body: 'body'
};

exports.Prisma.GameDayScalarFieldEnum = {
  id: 'id',
  year: 'year',
  date: 'date',
  game: 'game',
  mailSent: 'mailSent',
  comment: 'comment',
  bibs: 'bibs',
  pickerGamesHistory: 'pickerGamesHistory'
};

exports.Prisma.InvitationScalarFieldEnum = {
  uuid: 'uuid',
  playerId: 'playerId',
  gameDayId: 'gameDayId'
};

exports.Prisma.OutcomeScalarFieldEnum = {
  id: 'id',
  response: 'response',
  responseInterval: 'responseInterval',
  points: 'points',
  team: 'team',
  comment: 'comment',
  pub: 'pub',
  paid: 'paid',
  goalie: 'goalie',
  gameDayId: 'gameDayId',
  playerId: 'playerId'
};

exports.Prisma.PickerScalarFieldEnum = {
  playerId: 'playerId',
  playerName: 'playerName',
  age: 'age',
  average: 'average',
  goalie: 'goalie',
  played: 'played'
};

exports.Prisma.PickerTeamsScalarFieldEnum = {
  playerId: 'playerId',
  team: 'team'
};

exports.Prisma.PlayerScalarFieldEnum = {
  id: 'id',
  login: 'login',
  isAdmin: 'isAdmin',
  firstName: 'firstName',
  lastName: 'lastName',
  name: 'name',
  anonymous: 'anonymous',
  email: 'email',
  joined: 'joined',
  finished: 'finished',
  born: 'born',
  comment: 'comment',
  introducedBy: 'introducedBy'
};

exports.Prisma.PlayerRecordScalarFieldEnum = {
  id: 'id',
  year: 'year',
  responses: 'responses',
  played: 'played',
  won: 'won',
  drawn: 'drawn',
  lost: 'lost',
  points: 'points',
  averages: 'averages',
  stalwart: 'stalwart',
  pub: 'pub',
  rankPoints: 'rankPoints',
  rankAverages: 'rankAverages',
  rankAveragesUnqualified: 'rankAveragesUnqualified',
  rankStalwart: 'rankStalwart',
  rankSpeedy: 'rankSpeedy',
  rankSpeedyUnqualified: 'rankSpeedyUnqualified',
  rankPub: 'rankPub',
  speedy: 'speedy',
  playerId: 'playerId',
  gameDayId: 'gameDayId'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  role: 'role',
  banned: 'banned',
  banReason: 'banReason',
  banExpires: 'banExpires'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  expiresAt: 'expiresAt',
  token: 'token',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  impersonatedBy: 'impersonatedBy'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  providerId: 'providerId',
  userId: 'userId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  idToken: 'idToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  refreshTokenExpiresAt: 'refreshTokenExpiresAt',
  scope: 'scope',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  value: 'value',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.ClubOrderByRelevanceFieldEnum = {
  clubName: 'clubName',
  uri: 'uri',
  country: 'country'
};

exports.Prisma.CountryOrderByRelevanceFieldEnum = {
  isoCode: 'isoCode',
  name: 'name'
};

exports.Prisma.CountrySupporterOrderByRelevanceFieldEnum = {
  countryISOCode: 'countryISOCode'
};

exports.Prisma.DiffsOrderByRelevanceFieldEnum = {
  a: 'a',
  b: 'b'
};

exports.Prisma.GameChatOrderByRelevanceFieldEnum = {
  body: 'body'
};

exports.Prisma.GameDayOrderByRelevanceFieldEnum = {
  comment: 'comment'
};

exports.Prisma.InvitationOrderByRelevanceFieldEnum = {
  uuid: 'uuid'
};

exports.Prisma.OutcomeOrderByRelevanceFieldEnum = {
  comment: 'comment'
};

exports.Prisma.PickerOrderByRelevanceFieldEnum = {
  playerName: 'playerName'
};

exports.Prisma.PlayerOrderByRelevanceFieldEnum = {
  login: 'login',
  firstName: 'firstName',
  lastName: 'lastName',
  name: 'name',
  email: 'email',
  comment: 'comment'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  image: 'image',
  role: 'role',
  banReason: 'banReason'
};

exports.Prisma.SessionOrderByRelevanceFieldEnum = {
  id: 'id',
  token: 'token',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  impersonatedBy: 'impersonatedBy'
};

exports.Prisma.AccountOrderByRelevanceFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  providerId: 'providerId',
  userId: 'userId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  idToken: 'idToken',
  scope: 'scope',
  password: 'password'
};

exports.Prisma.VerificationOrderByRelevanceFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  value: 'value'
};
exports.TeamName = exports.$Enums.TeamName = {
  A: 'A',
  B: 'B'
};

exports.PlayerResponse = exports.$Enums.PlayerResponse = {
  Yes: 'Yes',
  No: 'No',
  Dunno: 'Dunno',
  Excused: 'Excused',
  Flaked: 'Flaked',
  Injured: 'Injured'
};

exports.Prisma.ModelName = {
  Arse: 'Arse',
  Club: 'Club',
  ClubSupporter: 'ClubSupporter',
  Country: 'Country',
  CountrySupporter: 'CountrySupporter',
  Diffs: 'Diffs',
  GameChat: 'GameChat',
  GameDay: 'GameDay',
  Invitation: 'Invitation',
  Outcome: 'Outcome',
  Picker: 'Picker',
  PickerTeams: 'PickerTeams',
  Player: 'Player',
  PlayerRecord: 'PlayerRecord',
  User: 'User',
  Session: 'Session',
  Account: 'Account',
  Verification: 'Verification'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
