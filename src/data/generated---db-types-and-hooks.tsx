import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** YYYYMMDDx where "x" is 0-1 */
  CalendarDayKey: any;
  /** Exercise set definition... */
  ESet: any;
  JEditorSaveRow: any;
  SBDSlot: any;
  SettingValue: any;
  /** Timestamp... */
  UTCDate: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** YYYY-MM-DD date... */
  YMD: any;
  /** YMD with just numbers... */
  YYYYMMDD: any;
};




export type Achievement = {
  __typename?: 'Achievement';
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type AchievementState = {
  __typename?: 'AchievementState';
  aid: Scalars['ID'];
  gotit?: Maybe<Scalars['Boolean']>;
  when?: Maybe<Scalars['YYYYMMDD']>;
  note?: Maybe<Scalars['String']>;
};

export enum ActivityFeedType {
  Global = 'global',
  Following = 'following'
}

export type BaseStat = {
  e: Scalars['ID'];
  w: Weight;
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
};

export type BestEStat = {
  __typename?: 'BestEStat';
  w: Scalars['Float'];
  r: Scalars['Int'];
  lb: Scalars['Int'];
  when: Scalars['YMD'];
  bw?: Maybe<Scalars['Float']>;
  est1rm?: Maybe<Scalars['Float']>;
};

export type BestLift = {
  __typename?: 'BestLift';
  w: Scalars['Float'];
  e: Exercise;
};

export type BlockUsersSetting = Setting & {
  __typename?: 'BlockUsersSetting';
  unames?: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export enum BulkMode {
  Delete = 'DELETE',
  Merge = 'MERGE'
}

export type Cc = {
  __typename?: 'CC';
  cc: Scalars['ID'];
  name: Scalars['String'];
};

export type CcSetting = Setting & {
  __typename?: 'CCSetting';
  cc?: Maybe<Scalars['String']>;
  ccs?: Maybe<Array<Maybe<Cc>>>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type CommunityStats = {
  __typename?: 'CommunityStats';
  title: Scalars['String'];
  scanFrecuency: Scalars['String'];
  timestamp?: Maybe<Scalars['UTCDate']>;
  heavyest?: Maybe<Array<Maybe<Heavyest>>>;
  estimated?: Maybe<Array<Maybe<Estimated1Rm>>>;
  volume?: Maybe<Array<Maybe<MostVolume>>>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type ConfirmAction = {
  __typename?: 'ConfirmAction';
  message: Scalars['String'];
  id: Scalars['ID'];
};

export type Custom1RmFactorSetting = Setting & {
  __typename?: 'Custom1RMFactorSetting';
  factor: Scalars['Int'];
  formula?: Maybe<Scalars['String']>;
  default: Scalars['Int'];
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Dm = INotification & IBy & IHasText & IMessageRef & Ito & {
  __typename?: 'DM';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  by: Scalars['ID'];
  to: Scalars['ID'];
  text: Scalars['String'];
  msgid: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
};

export type DobSetting = Setting & {
  __typename?: 'DOBSetting';
  dob?: Maybe<Scalars['YMD']>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type DeleteAccountSetting = Setting & {
  __typename?: 'DeleteAccountSetting';
  signature?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type EBestStats = {
  __typename?: 'EBestStats';
  eff?: Maybe<BestEStat>;
  int: BestEStat;
};

export type EBlock = {
  __typename?: 'EBlock';
  eid: Scalars['ID'];
  sets: Array<Maybe<Set>>;
};

export type ERef = {
  __typename?: 'ERef';
  exercise: Exercise;
  best?: Maybe<EBestStats>;
};


export type EblockPreview = {
  __typename?: 'EblockPreview';
  e: Exercise;
  w?: Maybe<Scalars['Float']>;
  r?: Maybe<Scalars['Int']>;
};

export type EmailSetting = Setting & {
  __typename?: 'EmailSetting';
  currentEmail: Scalars['String'];
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Estimated1Rm = BaseStat & {
  __typename?: 'Estimated1RM';
  originalw: Weight;
  reps: Scalars['Int'];
  ymd: Scalars['YMD'];
  e: Scalars['ID'];
  w: Weight;
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
};

export type ExecExerciseResponse = Exercise | ConfirmAction;

export type Exercise = {
  __typename?: 'Exercise';
  id: Scalars['ID'];
  name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type ExerciseStat = {
  __typename?: 'ExerciseStat';
  e: Exercise;
  days: Scalars['Int'];
  reps: Scalars['Int'];
};

export type FollowersCount = {
  __typename?: 'FollowersCount';
  total: Scalars['Int'];
  has?: Maybe<Scalars['Boolean']>;
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE'
}

export type Heavyest = BaseStat & {
  __typename?: 'Heavyest';
  ymd: Scalars['YMD'];
  reps: Scalars['Int'];
  e: Scalars['ID'];
  w: Weight;
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
};

export type IBy = {
  by: Scalars['ID'];
};

export type IHasJOwner = {
  jowner: Scalars['ID'];
  ymd: Scalars['YMD'];
};

export type IHasMessageId = {
  msgid: Scalars['ID'];
};

export type IHasText = {
  text: Scalars['String'];
};

export type IMessageRef = {
  msgid: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
};

export type INotification = {
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
};

export type Ito = {
  to: Scalars['ID'];
};

export type Inbox = {
  __typename?: 'Inbox';
  notifications?: Maybe<Array<Notification>>;
  referencedUsers?: Maybe<Array<User>>;
};

export type JComment = INotification & IBy & IHasText & IMessageRef & Ito & IHasJOwner & {
  __typename?: 'JComment';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  by: Scalars['ID'];
  to: Scalars['ID'];
  text: Scalars['String'];
  msgid: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
  jowner: Scalars['ID'];
  ymd: Scalars['YMD'];
};

export type JEditorBwTag = {
  __typename?: 'JEditorBWTag';
  bw?: Maybe<Scalars['Float']>;
};

export type JEditorData = {
  __typename?: 'JEditorData';
  did?: Maybe<Array<Maybe<JeditorRow>>>;
  exercises: Array<Maybe<ExerciseStat>>;
  etags: Array<Maybe<Scalars['String']>>;
  baseBW?: Maybe<Scalars['Float']>;
};

export type JEditorDayTag = {
  __typename?: 'JEditorDayTag';
  on: Scalars['YMD'];
};

export type JEditorEBlock = {
  __typename?: 'JEditorEBlock';
  e?: Maybe<Scalars['Int']>;
  sets?: Maybe<Array<Maybe<JEditorErow>>>;
};

export type JEditorErow = {
  __typename?: 'JEditorEROW';
  usebw?: Maybe<Scalars['Int']>;
  v?: Maybe<Scalars['Float']>;
  lb?: Maybe<Scalars['Int']>;
  r?: Maybe<Scalars['Int']>;
  s?: Maybe<Scalars['Int']>;
  c?: Maybe<Scalars['String']>;
  rpe?: Maybe<Scalars['Float']>;
};

export type JEditorNewExercise = {
  __typename?: 'JEditorNewExercise';
  newExercise: Scalars['String'];
};


export type JEditorText = {
  __typename?: 'JEditorText';
  text?: Maybe<Scalars['String']>;
};

export type JLog = {
  __typename?: 'JLog';
  id: Scalars['ID'];
  log?: Maybe<Scalars['String']>;
  fromMobile?: Maybe<Scalars['Boolean']>;
  bw?: Maybe<Scalars['Float']>;
  eblocks?: Maybe<Array<Maybe<EBlock>>>;
  exercises?: Maybe<Array<Maybe<ERef>>>;
};

export type JRangeData = {
  __typename?: 'JRangeData';
  exercises: Array<Maybe<Exercise>>;
  days?: Maybe<Array<Maybe<JRangeDayData>>>;
};

export type JRangeDayData = {
  __typename?: 'JRangeDayData';
  on?: Maybe<Scalars['YMD']>;
  did?: Maybe<Array<Maybe<EBlock>>>;
};

export type JeditorRow = JEditorText | JEditorEBlock | JEditorDayTag | JEditorBwTag | JEditorNewExercise;

export type LikeOnDm = INotification & IBy & Ito & IHasMessageId & IHasText & {
  __typename?: 'LikeOnDM';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  by: Scalars['ID'];
  to: Scalars['ID'];
  msgid: Scalars['ID'];
  text: Scalars['String'];
};

export type LikeOnJComment = INotification & IBy & Ito & IHasJOwner & IHasMessageId & IHasText & {
  __typename?: 'LikeOnJComment';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  by: Scalars['ID'];
  to: Scalars['ID'];
  jowner: Scalars['ID'];
  ymd: Scalars['YMD'];
  msgid: Scalars['ID'];
  text: Scalars['String'];
};

export type LikeOnLog = INotification & IBy & IHasJOwner & {
  __typename?: 'LikeOnLog';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  by: Scalars['ID'];
  jowner: Scalars['ID'];
  ymd: Scalars['YMD'];
};

export enum MessageType {
  Dm = 'DM',
  Reply = 'REPLY',
  Jcomment = 'JCOMMENT',
  Global = 'GLOBAL'
}

export type MostVolume = BaseStat & {
  __typename?: 'MostVolume';
  totalReps: Scalars['Int'];
  e: Scalars['ID'];
  w: Weight;
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['String']>;
  sendMessage?: Maybe<SendMessageResult>;
  deleteMessage?: Maybe<Scalars['Boolean']>;
  login: Scalars['String'];
  loginWithGoogle: Scalars['String'];
  loginWithFirebase: Scalars['String'];
  forgot: Scalars['Boolean'];
  signup: Scalars['Boolean'];
  verifySignup: Scalars['String'];
  likeMessage: Scalars['ID'];
  likeJournalLog: Scalars['ID'];
  follow?: Maybe<Scalars['Boolean']>;
  saveJEditor?: Maybe<Scalars['Boolean']>;
  execExercise?: Maybe<ExecExerciseResponse>;
  execBulkExercises?: Maybe<Scalars['Boolean']>;
  uploadAvatar: Scalars['String'];
  setSetting?: Maybe<UserSetting>;
  sendVerificationCode?: Maybe<UserSetting>;
};


export type MutationSendMessageArgs = {
  message: Scalars['String'];
  type: MessageType;
  target: Scalars['ID'];
};


export type MutationDeleteMessageArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationLoginArgs = {
  u: Scalars['String'];
  p: Scalars['String'];
};


export type MutationLoginWithGoogleArgs = {
  jwt: Scalars['String'];
  uname?: Maybe<Scalars['String']>;
  isf?: Maybe<Scalars['Int']>;
  usekg?: Maybe<Scalars['Int']>;
};


export type MutationLoginWithFirebaseArgs = {
  token: Scalars['String'];
  uname?: Maybe<Scalars['String']>;
  isf?: Maybe<Scalars['Int']>;
  usekg?: Maybe<Scalars['Int']>;
};


export type MutationForgotArgs = {
  uore: Scalars['String'];
};


export type MutationSignupArgs = {
  uname: Scalars['String'];
  email: Scalars['String'];
  pass: Scalars['String'];
  isf: Scalars['Int'];
  usekg: Scalars['Int'];
};


export type MutationVerifySignupArgs = {
  code: Scalars['String'];
};


export type MutationLikeMessageArgs = {
  target: Scalars['ID'];
};


export type MutationLikeJournalLogArgs = {
  target: Scalars['ID'];
};


export type MutationFollowArgs = {
  uid: Scalars['ID'];
  not?: Maybe<Scalars['Boolean']>;
};


export type MutationSaveJEditorArgs = {
  rows?: Maybe<Array<Maybe<Scalars['JEditorSaveRow']>>>;
  defaultDate: Scalars['YMD'];
};


export type MutationExecExerciseArgs = {
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  confirms?: Maybe<Scalars['ID']>;
};


export type MutationExecBulkExercisesArgs = {
  eids: Array<Scalars['ID']>;
  mode: BulkMode;
};


export type MutationUploadAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationSetSettingArgs = {
  id: Scalars['ID'];
  value?: Maybe<Scalars['SettingValue']>;
};


export type MutationSendVerificationCodeArgs = {
  id: Scalars['ID'];
  code: Scalars['String'];
};

export type Notification = Dm | JComment | LikeOnLog | LikeOnJComment | LikeOnDm | StartedFollowing | SystemNotification;

export type OfficialExercise = {
  __typename?: 'OfficialExercise';
  id: Scalars['ID'];
  tag: Scalars['String'];
  variants: Array<Maybe<Scalars['String']>>;
  coolxbw?: Maybe<Scalars['Float']>;
};

export type Option = {
  __typename?: 'Option';
  i: Scalars['Int'];
  name: Scalars['String'];
};

export type OptionSetting = Setting & {
  __typename?: 'OptionSetting';
  i?: Maybe<Scalars['Int']>;
  options?: Maybe<Array<Maybe<Option>>>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Pr = {
  __typename?: 'PR';
  w: Scalars['Float'];
  r: Scalars['Int'];
  lb: Scalars['Int'];
  when: Scalars['YMD'];
  bw?: Maybe<Scalars['Float']>;
};

export type PrHistory = {
  __typename?: 'PRHistory';
  exercise: Exercise;
  totalWorkouts: Scalars['Int'];
  setsOf?: Maybe<Array<Maybe<RepStat>>>;
  prs?: Maybe<Array<Maybe<Pr>>>;
};

export type Query = {
  __typename?: 'Query';
  totalJournals: Scalars['Int'];
  getInbox?: Maybe<Inbox>;
  getLogInbox?: Maybe<Inbox>;
  getAllPublicInteractionsInbox?: Maybe<Inbox>;
  getDate?: Maybe<Scalars['String']>;
  getAnnouncements?: Maybe<Array<Maybe<SystemNotification>>>;
  getSession?: Maybe<SessionInfo>;
  getActivityFeed?: Maybe<Array<Maybe<UCard>>>;
  getFollowersCount: FollowersCount;
  userInfo: UserInfo;
  getCalendarDays?: Maybe<Array<Maybe<Scalars['CalendarDayKey']>>>;
  jday?: Maybe<JLog>;
  jrange?: Maybe<JRangeData>;
  jeditor?: Maybe<JEditorData>;
  downloadLogs?: Maybe<JEditorData>;
  alsoposted?: Maybe<Array<Maybe<User>>>;
  getExercises?: Maybe<Array<Maybe<ExerciseStat>>>;
  getPRsOf?: Maybe<PrHistory>;
  communityStats?: Maybe<CommunityStats>;
  officialExercises: Array<Maybe<OfficialExercise>>;
  sbdStats?: Maybe<SbdStats>;
  getUserSettings: Array<Maybe<UserSetting>>;
  getSupporters?: Maybe<Array<Maybe<Supporter>>>;
  getActiveSupporters?: Maybe<Array<Maybe<Supporter>>>;
  getAchievementsStateOf?: Maybe<Array<Maybe<AchievementState>>>;
  getAchievements?: Maybe<Array<Maybe<Achievement>>>;
  getVideos?: Maybe<Array<Maybe<Video>>>;
};


export type QueryGetInboxArgs = {
  newerThan?: Maybe<Scalars['UTCDate']>;
  olderThan?: Maybe<Scalars['UTCDate']>;
  dmsWithUID?: Maybe<Scalars['ID']>;
};


export type QueryGetLogInboxArgs = {
  newerThan?: Maybe<Scalars['UTCDate']>;
  olderThan?: Maybe<Scalars['UTCDate']>;
  logid: Scalars['ID'];
};


export type QueryGetAllPublicInteractionsInboxArgs = {
  newerThan?: Maybe<Scalars['UTCDate']>;
  olderThan?: Maybe<Scalars['UTCDate']>;
};


export type QueryGetAnnouncementsArgs = {
  olderThan?: Maybe<Scalars['UTCDate']>;
  limit: Scalars['Int'];
};


export type QueryGetActivityFeedArgs = {
  type: ActivityFeedType;
  olderThan?: Maybe<Scalars['String']>;
  newerThan?: Maybe<Scalars['String']>;
};


export type QueryGetFollowersCountArgs = {
  uid: Scalars['ID'];
  has?: Maybe<Scalars['ID']>;
};


export type QueryUserInfoArgs = {
  uname: Scalars['String'];
};


export type QueryGetCalendarDaysArgs = {
  uid: Scalars['ID'];
  from: Scalars['YYYYMMDD'];
  to: Scalars['YYYYMMDD'];
};


export type QueryJdayArgs = {
  uid: Scalars['ID'];
  ymd?: Maybe<Scalars['YMD']>;
};


export type QueryJrangeArgs = {
  uid: Scalars['ID'];
  ymd: Scalars['YMD'];
  range: Scalars['Int'];
};


export type QueryJeditorArgs = {
  ymd?: Maybe<Scalars['YMD']>;
  range?: Maybe<Scalars['Int']>;
};


export type QueryAlsopostedArgs = {
  ymd?: Maybe<Scalars['YMD']>;
};


export type QueryGetExercisesArgs = {
  uid: Scalars['ID'];
};


export type QueryGetPRsOfArgs = {
  eid: Scalars['ID'];
  till?: Maybe<Scalars['YMD']>;
};


export type QueryCommunityStatsArgs = {
  gender?: Maybe<Gender>;
  etype: Scalars['String'];
};


export type QueryGetAchievementsStateOfArgs = {
  uid: Scalars['ID'];
  asOfThisYMD: Scalars['YYYYMMDD'];
};

export type RpeSetting = Setting & {
  __typename?: 'RPESetting';
  defaults?: Maybe<Array<Maybe<Scalars['SettingValue']>>>;
  overrides?: Maybe<Array<Maybe<Scalars['SettingValue']>>>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type RepStat = {
  __typename?: 'RepStat';
  r: Scalars['Int'];
  count: Scalars['Int'];
};

export enum Role {
  Admin = 'ADMIN',
  RegisteredUser = 'REGISTERED_USER'
}


export type SbdStat = {
  __typename?: 'SBDStat';
  wclass: WeightClass;
  graph?: Maybe<Array<Scalars['SBDSlot']>>;
};

export type SbdStats = {
  __typename?: 'SBDStats';
  total: Scalars['Int'];
  date: Scalars['String'];
  perclass?: Maybe<Array<Maybe<SbdStat>>>;
};

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  msgid: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  user: User;
  time?: Maybe<Scalars['String']>;
};

export type Set = {
  __typename?: 'Set';
  w: Scalars['Float'];
  r: Scalars['Float'];
  s: Scalars['Float'];
  lb: Scalars['Int'];
  ubw?: Maybe<Scalars['Int']>;
  c?: Maybe<Scalars['String']>;
  rpe?: Maybe<Scalars['Float']>;
  pr?: Maybe<Scalars['Int']>;
  est1rm: Scalars['Float'];
  eff: Scalars['Float'];
  int: Scalars['Float'];
};

export type Setting = {
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};


export type SocialMediasSetting = Setting & {
  __typename?: 'SocialMediasSetting';
  links: Scalars['String'];
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type StartedFollowing = INotification & IBy & Ito & {
  __typename?: 'StartedFollowing';
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  by: Scalars['ID'];
  to: Scalars['ID'];
};

export type Supporter = {
  __typename?: 'Supporter';
  user: User;
  when?: Maybe<Scalars['String']>;
};

export type SupporterStatus = Setting & {
  __typename?: 'SupporterStatus';
  slvl: Scalars['Float'];
  daysLeftAsActive: Scalars['Int'];
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type SystemNotification = INotification & IHasText & {
  __typename?: 'SystemNotification';
  type?: Maybe<SystemNotificationType>;
  id: Scalars['ID'];
  when: Scalars['UTCDate'];
  text: Scalars['String'];
};

export enum SystemNotificationType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export type UCard = {
  __typename?: 'UCard';
  user?: Maybe<User>;
  posted?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['String']>;
  workoutPreview?: Maybe<Array<Maybe<EblockPreview>>>;
  andXmore?: Maybe<Scalars['Int']>;
  itemsLeftAfterThis?: Maybe<Scalars['Int']>;
};



export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  avatarhash: Scalars['String'];
  uname: Scalars['String'];
  cc?: Maybe<Scalars['String']>;
  slvl?: Maybe<Scalars['Float']>;
  sok?: Maybe<Scalars['Int']>;
  age?: Maybe<Scalars['Int']>;
  bw?: Maybe<Scalars['Float']>;
  private?: Maybe<Scalars['Int']>;
  isf?: Maybe<Scalars['Int']>;
  joined?: Maybe<Scalars['String']>;
  usekg?: Maybe<Scalars['Int']>;
  custom1RM?: Maybe<Scalars['Int']>;
  est1RMFactor?: Maybe<Scalars['Int']>;
  jranges?: Maybe<Array<Maybe<Scalars['Int']>>>;
  estimate1RMFormula?: Maybe<Scalars['String']>;
  socialLinks?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  user: User;
  daysLogged: Scalars['Int'];
  best3?: Maybe<Array<BestLift>>;
};

export type UserSetting = UsernameSetting | EmailSetting | VoidSetting | DobSetting | CcSetting | OptionSetting | SupporterStatus | Custom1RmFactorSetting | RpeSetting | DeleteAccountSetting | BlockUsersSetting | SocialMediasSetting;

export type UsernameSetting = Setting & {
  __typename?: 'UsernameSetting';
  uname: Scalars['String'];
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Video = {
  __typename?: 'Video';
  user: User;
  when: Scalars['String'];
  posted: Scalars['String'];
  link: Scalars['String'];
  logid: Scalars['ID'];
};

export type VoidSetting = Setting & {
  __typename?: 'VoidSetting';
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Weight = {
  __typename?: 'Weight';
  v: Scalars['Float'];
  lb: Scalars['Int'];
};

export type WeightClass = {
  __typename?: 'WeightClass';
  min: Scalars['Float'];
  max: Scalars['Float'];
  name: Scalars['String'];
  male: Scalars['Boolean'];
};



export type GetAchievementsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAchievementsQuery = { __typename?: 'Query', getAchievements?: Maybe<Array<Maybe<{ __typename?: 'Achievement', id: string, description: string, name: string }>>> };

export type GetAchievementsStateOfQueryVariables = Exact<{
  uid: Scalars['ID'];
  asOfThisYmd: Scalars['YYYYMMDD'];
}>;


export type GetAchievementsStateOfQuery = { __typename?: 'Query', getAchievementsStateOf?: Maybe<Array<Maybe<{ __typename?: 'AchievementState', aid: string, gotit?: Maybe<boolean>, when?: Maybe<any>, note?: Maybe<string> }>>> };

type BaseFields_Estimated1Rm_Fragment = { __typename?: 'Estimated1RM', e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: Maybe<{ __typename?: 'Weight', v: number, lb: number }> };

type BaseFields_Heavyest_Fragment = { __typename?: 'Heavyest', e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: Maybe<{ __typename?: 'Weight', v: number, lb: number }> };

type BaseFields_MostVolume_Fragment = { __typename?: 'MostVolume', e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: Maybe<{ __typename?: 'Weight', v: number, lb: number }> };

export type BaseFieldsFragment = BaseFields_Estimated1Rm_Fragment | BaseFields_Heavyest_Fragment | BaseFields_MostVolume_Fragment;

export type GetOfficialExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOfficialExercisesQuery = { __typename?: 'Query', officialExercises: Array<Maybe<{ __typename?: 'OfficialExercise', id: string, tag: string, variants: Array<Maybe<string>>, coolxbw?: Maybe<number> }>> };

export type GetSbdStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSbdStatsQuery = { __typename?: 'Query', sbdStats?: Maybe<{ __typename?: 'SBDStats', total: number, date: string, perclass?: Maybe<Array<Maybe<{ __typename?: 'SBDStat', graph?: Maybe<Array<any>>, wclass: { __typename?: 'WeightClass', name: string, max: number, min: number, male: boolean } }>>> }> };

export type GetCommunityStatsQueryVariables = Exact<{
  etype: Scalars['String'];
}>;


export type GetCommunityStatsQuery = { __typename?: 'Query', communityStats?: Maybe<{ __typename?: 'CommunityStats', title: string, scanFrecuency: string, timestamp?: Maybe<any>, heavyest?: Maybe<Array<Maybe<{ __typename?: 'Heavyest', ymd: any, reps: number, e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: Maybe<{ __typename?: 'Weight', v: number, lb: number }> }>>>, estimated?: Maybe<Array<Maybe<{ __typename?: 'Estimated1RM', reps: number, ymd: any, e: string, by: string, originalw: { __typename?: 'Weight', lb: number, v: number }, w: { __typename?: 'Weight', v: number, lb: number }, bw?: Maybe<{ __typename?: 'Weight', v: number, lb: number }> }>>>, volume?: Maybe<Array<Maybe<{ __typename?: 'MostVolume', totalReps: number, e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: Maybe<{ __typename?: 'Weight', v: number, lb: number }> }>>>, exercises?: Maybe<Array<Maybe<{ __typename?: 'Exercise', id: string, type?: Maybe<string>, name: string }>>>, users?: Maybe<Array<Maybe<{ __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> }>>> }> };

export type GetExercisesQueryVariables = Exact<{
  uid: Scalars['ID'];
}>;


export type GetExercisesQuery = { __typename?: 'Query', getExercises?: Maybe<Array<Maybe<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, type?: Maybe<string>, name: string } }>>> };

export type GetPRsOfQueryVariables = Exact<{
  eid: Scalars['ID'];
  till?: Maybe<Scalars['YMD']>;
}>;


export type GetPRsOfQuery = { __typename?: 'Query', getPRsOf?: Maybe<{ __typename?: 'PRHistory', totalWorkouts: number, exercise: { __typename?: 'Exercise', id: string, type?: Maybe<string>, name: string }, setsOf?: Maybe<Array<Maybe<{ __typename?: 'RepStat', r: number, count: number }>>>, prs?: Maybe<Array<Maybe<{ __typename?: 'PR', w: number, r: number, lb: number, when: any, bw?: Maybe<number> }>>> }> };

export type ExecExerciseMutationVariables = Exact<{
  eid?: Maybe<Scalars['ID']>;
  ename?: Maybe<Scalars['String']>;
  confirms?: Maybe<Scalars['ID']>;
}>;


export type ExecExerciseMutation = { __typename?: 'Mutation', execExercise?: Maybe<{ __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> } | { __typename?: 'ConfirmAction', message: string, id: string }> };

export type ExecBulkExercisesMutationVariables = Exact<{
  eids: Array<Scalars['ID']> | Scalars['ID'];
  mode: BulkMode;
}>;


export type ExecBulkExercisesMutation = { __typename?: 'Mutation', execBulkExercises?: Maybe<boolean> };

export type GetFeedQueryVariables = Exact<{
  type: ActivityFeedType;
  olderThan?: Maybe<Scalars['String']>;
  newerThan?: Maybe<Scalars['String']>;
}>;


export type GetFeedQuery = { __typename?: 'Query', getActivityFeed?: Maybe<Array<Maybe<{ __typename?: 'UCard', when?: Maybe<string>, text?: Maybe<string>, andXmore?: Maybe<number>, posted?: Maybe<string>, media?: Maybe<string>, itemsLeftAfterThis?: Maybe<number>, user?: Maybe<{ __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> }>, workoutPreview?: Maybe<Array<Maybe<{ __typename?: 'EblockPreview', r?: Maybe<number>, w?: Maybe<number>, e: { __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> } }>>> }>>> };

export type GetInboxQueryVariables = Exact<{
  olderThan?: Maybe<Scalars['UTCDate']>;
  newerThan?: Maybe<Scalars['UTCDate']>;
  dmsWithUID?: Maybe<Scalars['ID']>;
}>;


export type GetInboxQuery = { __typename?: 'Query', getInbox?: Maybe<{ __typename?: 'Inbox', referencedUsers?: Maybe<Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> }>>, notifications?: Maybe<Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: Maybe<string>, inResponseToMsg?: Maybe<string>, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: Maybe<string>, inResponseToMsg?: Maybe<string>, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: Maybe<SystemNotificationType> }>> }> };

export type GetAnnouncementsQueryVariables = Exact<{
  olderThan?: Maybe<Scalars['UTCDate']>;
  limit: Scalars['Int'];
}>;


export type GetAnnouncementsQuery = { __typename?: 'Query', getAnnouncements?: Maybe<Array<Maybe<{ __typename: 'SystemNotification', id: string, when: any, text: string, variant?: Maybe<SystemNotificationType> }>>> };

export type GetUserInfoQueryVariables = Exact<{
  userInfoUname: Scalars['String'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', userInfo: { __typename?: 'UserInfo', daysLogged: number, user: { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: Maybe<string>, slvl?: Maybe<number>, sok?: Maybe<number>, age?: Maybe<number>, bw?: Maybe<number>, private?: Maybe<number>, isf?: Maybe<number>, joined?: Maybe<string>, usekg?: Maybe<number>, custom1RM?: Maybe<number>, est1RMFactor?: Maybe<number>, jranges?: Maybe<Array<Maybe<number>>>, estimate1RMFormula?: Maybe<string>, socialLinks?: Maybe<Array<Maybe<string>>> }, best3?: Maybe<Array<{ __typename?: 'BestLift', w: number, e: { __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> } }>> } };

export type GetCalendarDaysQueryVariables = Exact<{
  uid: Scalars['ID'];
  from: Scalars['YYYYMMDD'];
  to: Scalars['YYYYMMDD'];
}>;


export type GetCalendarDaysQuery = { __typename?: 'Query', getCalendarDays?: Maybe<Array<Maybe<any>>> };

export type JDayQueryVariables = Exact<{
  uid: Scalars['ID'];
  ymd?: Maybe<Scalars['YMD']>;
}>;


export type JDayQuery = { __typename?: 'Query', jday?: Maybe<{ __typename?: 'JLog', id: string, log?: Maybe<string>, fromMobile?: Maybe<boolean>, bw?: Maybe<number>, eblocks?: Maybe<Array<Maybe<{ __typename?: 'EBlock', eid: string, sets: Array<Maybe<{ __typename?: 'Set', w: number, r: number, s: number, lb: number, ubw?: Maybe<number>, c?: Maybe<string>, rpe?: Maybe<number>, pr?: Maybe<number>, est1rm: number, eff: number, int: number }>> }>>>, exercises?: Maybe<Array<Maybe<{ __typename?: 'ERef', exercise: { __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> }, best?: Maybe<{ __typename?: 'EBestStats', eff?: Maybe<{ __typename?: 'BestEStat', w: number, r: number, lb: number, when: any, bw?: Maybe<number>, est1rm?: Maybe<number> }>, int: { __typename?: 'BestEStat', w: number, r: number, lb: number, when: any, bw?: Maybe<number> } }> }>>> }> };

export type AlsoPostedQueryVariables = Exact<{
  ymd?: Maybe<Scalars['YMD']>;
}>;


export type AlsoPostedQuery = { __typename?: 'Query', alsoposted?: Maybe<Array<Maybe<{ __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> }>>> };

export type JeditorDataFieldsFragment = { __typename?: 'JEditorData', etags: Array<Maybe<string>>, baseBW?: Maybe<number>, exercises: Array<Maybe<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> } }>>, did?: Maybe<Array<Maybe<{ __typename?: 'JEditorText', text?: Maybe<string> } | { __typename?: 'JEditorEBlock', e?: Maybe<number>, sets?: Maybe<Array<Maybe<{ __typename?: 'JEditorEROW', usebw?: Maybe<number>, v?: Maybe<number>, c?: Maybe<string>, s?: Maybe<number>, r?: Maybe<number>, lb?: Maybe<number>, rpe?: Maybe<number> }>>> } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorBWTag', bw?: Maybe<number> } | { __typename?: 'JEditorNewExercise' }>>> };

export type GetJRangeQueryVariables = Exact<{
  uid: Scalars['ID'];
  ymd: Scalars['YMD'];
  range: Scalars['Int'];
}>;


export type GetJRangeQuery = { __typename?: 'Query', jrange?: Maybe<{ __typename?: 'JRangeData', exercises: Array<Maybe<{ __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> }>>, days?: Maybe<Array<Maybe<{ __typename?: 'JRangeDayData', on?: Maybe<any>, did?: Maybe<Array<Maybe<{ __typename?: 'EBlock', eid: string, sets: Array<Maybe<{ __typename?: 'Set', w: number, r: number, s: number, lb: number, ubw?: Maybe<number>, c?: Maybe<string>, rpe?: Maybe<number>, pr?: Maybe<number>, est1rm: number, eff: number, int: number }>> }>>> }>>> }> };

export type GetJEditorDataQueryVariables = Exact<{
  ymd?: Maybe<Scalars['YMD']>;
  range?: Maybe<Scalars['Int']>;
}>;


export type GetJEditorDataQuery = { __typename?: 'Query', jeditor?: Maybe<{ __typename?: 'JEditorData', etags: Array<Maybe<string>>, baseBW?: Maybe<number>, exercises: Array<Maybe<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> } }>>, did?: Maybe<Array<Maybe<{ __typename?: 'JEditorText', text?: Maybe<string> } | { __typename?: 'JEditorEBlock', e?: Maybe<number>, sets?: Maybe<Array<Maybe<{ __typename?: 'JEditorEROW', usebw?: Maybe<number>, v?: Maybe<number>, c?: Maybe<string>, s?: Maybe<number>, r?: Maybe<number>, lb?: Maybe<number>, rpe?: Maybe<number> }>>> } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorBWTag', bw?: Maybe<number> } | { __typename?: 'JEditorNewExercise' }>>> }> };

export type SaveJEditorMutationVariables = Exact<{
  rows?: Maybe<Array<Maybe<Scalars['JEditorSaveRow']>> | Maybe<Scalars['JEditorSaveRow']>>;
  defaultDate: Scalars['YMD'];
}>;


export type SaveJEditorMutation = { __typename?: 'Mutation', saveJEditor?: Maybe<boolean> };

export type DownloadLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type DownloadLogsQuery = { __typename?: 'Query', downloadLogs?: Maybe<{ __typename?: 'JEditorData', etags: Array<Maybe<string>>, baseBW?: Maybe<number>, exercises: Array<Maybe<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: Maybe<string> } }>>, did?: Maybe<Array<Maybe<{ __typename?: 'JEditorText', text?: Maybe<string> } | { __typename?: 'JEditorEBlock', e?: Maybe<number>, sets?: Maybe<Array<Maybe<{ __typename?: 'JEditorEROW', usebw?: Maybe<number>, v?: Maybe<number>, c?: Maybe<string>, s?: Maybe<number>, r?: Maybe<number>, lb?: Maybe<number>, rpe?: Maybe<number> }>>> } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorBWTag', bw?: Maybe<number> } | { __typename?: 'JEditorNewExercise' }>>> }> };

export type GetFollowersQueryVariables = Exact<{
  of: Scalars['ID'];
  has?: Maybe<Scalars['ID']>;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowersCount: { __typename?: 'FollowersCount', has?: Maybe<boolean>, total: number } };

export type LikeMessageMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type LikeMessageMutation = { __typename?: 'Mutation', likeMessage: string };

export type LikeJournalLogMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type LikeJournalLogMutation = { __typename?: 'Mutation', likeJournalLog: string };

export type FollowMutationVariables = Exact<{
  uid: Scalars['ID'];
  not?: Maybe<Scalars['Boolean']>;
}>;


export type FollowMutation = { __typename?: 'Mutation', follow?: Maybe<boolean> };

export type GetLogInboxQueryVariables = Exact<{
  olderThan?: Maybe<Scalars['UTCDate']>;
  newerThan?: Maybe<Scalars['UTCDate']>;
  logid: Scalars['ID'];
}>;


export type GetLogInboxQuery = { __typename?: 'Query', getLogInbox?: Maybe<{ __typename?: 'Inbox', referencedUsers?: Maybe<Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> }>>, notifications?: Maybe<Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: Maybe<string>, inResponseToMsg?: Maybe<string>, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: Maybe<string>, inResponseToMsg?: Maybe<string>, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: Maybe<SystemNotificationType> }>> }> };

export type GetPublicInteractionsInboxQueryVariables = Exact<{
  olderThan?: Maybe<Scalars['UTCDate']>;
  newerThan?: Maybe<Scalars['UTCDate']>;
}>;


export type GetPublicInteractionsInboxQuery = { __typename?: 'Query', getAllPublicInteractionsInbox?: Maybe<{ __typename?: 'Inbox', referencedUsers?: Maybe<Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> }>>, notifications?: Maybe<Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: Maybe<string>, inResponseToMsg?: Maybe<string>, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: Maybe<string>, inResponseToMsg?: Maybe<string>, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: Maybe<SystemNotificationType> }>> }> };

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String'];
  type: MessageType;
  targetID: Scalars['ID'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage?: Maybe<{ __typename?: 'SendMessageResult', id: string, when: any, msgid: string }> };

export type DeleteMessageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage?: Maybe<boolean> };

export type GetSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionQuery = { __typename?: 'Query', getSession?: Maybe<{ __typename?: 'SessionInfo', time?: Maybe<string>, user: { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: Maybe<string>, slvl?: Maybe<number>, sok?: Maybe<number>, age?: Maybe<number>, bw?: Maybe<number>, private?: Maybe<number>, isf?: Maybe<number>, joined?: Maybe<string>, usekg?: Maybe<number>, custom1RM?: Maybe<number>, est1RMFactor?: Maybe<number>, jranges?: Maybe<Array<Maybe<number>>>, estimate1RMFormula?: Maybe<string>, socialLinks?: Maybe<Array<Maybe<string>>> } }> };

export type SignupMutationVariables = Exact<{
  uname: Scalars['String'];
  email: Scalars['String'];
  pass: Scalars['String'];
  isf: Scalars['Int'];
  usekg: Scalars['Int'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: boolean };

export type LoginMutationVariables = Exact<{
  u: Scalars['String'];
  p: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type VerifySignupMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type VerifySignupMutation = { __typename?: 'Mutation', verifySignup: string };

export type ForgotMutationVariables = Exact<{
  uore: Scalars['String'];
}>;


export type ForgotMutation = { __typename?: 'Mutation', forgot: boolean };

export type LoginWithGoogleMutationVariables = Exact<{
  jwt: Scalars['String'];
  uname?: Maybe<Scalars['String']>;
  isf?: Maybe<Scalars['Int']>;
  usekg?: Maybe<Scalars['Int']>;
}>;


export type LoginWithGoogleMutation = { __typename?: 'Mutation', loginWithGoogle: string };

export type LoginWithFirebaseMutationVariables = Exact<{
  token: Scalars['String'];
  uname?: Maybe<Scalars['String']>;
  isf?: Maybe<Scalars['Int']>;
  usekg?: Maybe<Scalars['Int']>;
}>;


export type LoginWithFirebaseMutation = { __typename?: 'Mutation', loginWithFirebase: string };

type SettingsFields_BlockUsersSetting_Fragment = { __typename?: 'BlockUsersSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_CcSetting_Fragment = { __typename?: 'CCSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_Custom1RmFactorSetting_Fragment = { __typename?: 'Custom1RMFactorSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_DobSetting_Fragment = { __typename?: 'DOBSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_DeleteAccountSetting_Fragment = { __typename?: 'DeleteAccountSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_EmailSetting_Fragment = { __typename?: 'EmailSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_OptionSetting_Fragment = { __typename?: 'OptionSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_RpeSetting_Fragment = { __typename?: 'RPESetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_SocialMediasSetting_Fragment = { __typename?: 'SocialMediasSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_SupporterStatus_Fragment = { __typename?: 'SupporterStatus', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_UsernameSetting_Fragment = { __typename?: 'UsernameSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingsFields_VoidSetting_Fragment = { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

export type SettingsFieldsFragment = SettingsFields_BlockUsersSetting_Fragment | SettingsFields_CcSetting_Fragment | SettingsFields_Custom1RmFactorSetting_Fragment | SettingsFields_DobSetting_Fragment | SettingsFields_DeleteAccountSetting_Fragment | SettingsFields_EmailSetting_Fragment | SettingsFields_OptionSetting_Fragment | SettingsFields_RpeSetting_Fragment | SettingsFields_SocialMediasSetting_Fragment | SettingsFields_SupporterStatus_Fragment | SettingsFields_UsernameSetting_Fragment | SettingsFields_VoidSetting_Fragment;

type SettingFields_UsernameSetting_Fragment = { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_EmailSetting_Fragment = { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_VoidSetting_Fragment = { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_DobSetting_Fragment = { __typename?: 'DOBSetting', dob?: Maybe<any>, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_CcSetting_Fragment = { __typename?: 'CCSetting', cc?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean>, ccs?: Maybe<Array<Maybe<{ __typename?: 'CC', cc: string, name: string }>>> };

type SettingFields_OptionSetting_Fragment = { __typename?: 'OptionSetting', i?: Maybe<number>, id: string, waitingCodeToChange?: Maybe<boolean>, options?: Maybe<Array<Maybe<{ __typename?: 'Option', i: number, name: string }>>> };

type SettingFields_SupporterStatus_Fragment = { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_Custom1RmFactorSetting_Fragment = { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: Maybe<string>, default: number, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_RpeSetting_Fragment = { __typename?: 'RPESetting', defaults?: Maybe<Array<Maybe<any>>>, overrides?: Maybe<Array<Maybe<any>>>, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_DeleteAccountSetting_Fragment = { __typename?: 'DeleteAccountSetting', signature?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_BlockUsersSetting_Fragment = { __typename?: 'BlockUsersSetting', unames?: Maybe<Array<Maybe<string>>>, id: string, waitingCodeToChange?: Maybe<boolean> };

type SettingFields_SocialMediasSetting_Fragment = { __typename?: 'SocialMediasSetting', links: string, id: string, waitingCodeToChange?: Maybe<boolean> };

export type SettingFieldsFragment = SettingFields_UsernameSetting_Fragment | SettingFields_EmailSetting_Fragment | SettingFields_VoidSetting_Fragment | SettingFields_DobSetting_Fragment | SettingFields_CcSetting_Fragment | SettingFields_OptionSetting_Fragment | SettingFields_SupporterStatus_Fragment | SettingFields_Custom1RmFactorSetting_Fragment | SettingFields_RpeSetting_Fragment | SettingFields_DeleteAccountSetting_Fragment | SettingFields_BlockUsersSetting_Fragment | SettingFields_SocialMediasSetting_Fragment;

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'Query', getUserSettings: Array<Maybe<{ __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'DOBSetting', dob?: Maybe<any>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'CCSetting', cc?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean>, ccs?: Maybe<Array<Maybe<{ __typename?: 'CC', cc: string, name: string }>>> } | { __typename?: 'OptionSetting', i?: Maybe<number>, id: string, waitingCodeToChange?: Maybe<boolean>, options?: Maybe<Array<Maybe<{ __typename?: 'Option', i: number, name: string }>>> } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: Maybe<string>, default: number, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'RPESetting', defaults?: Maybe<Array<Maybe<any>>>, overrides?: Maybe<Array<Maybe<any>>>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'DeleteAccountSetting', signature?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'BlockUsersSetting', unames?: Maybe<Array<Maybe<string>>>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'SocialMediasSetting', links: string, id: string, waitingCodeToChange?: Maybe<boolean> }>> };

export type SetSettingMutationVariables = Exact<{
  id: Scalars['ID'];
  value?: Maybe<Scalars['SettingValue']>;
}>;


export type SetSettingMutation = { __typename?: 'Mutation', setSetting?: Maybe<{ __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'DOBSetting', dob?: Maybe<any>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'CCSetting', cc?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean>, ccs?: Maybe<Array<Maybe<{ __typename?: 'CC', cc: string, name: string }>>> } | { __typename?: 'OptionSetting', i?: Maybe<number>, id: string, waitingCodeToChange?: Maybe<boolean>, options?: Maybe<Array<Maybe<{ __typename?: 'Option', i: number, name: string }>>> } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: Maybe<string>, default: number, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'RPESetting', defaults?: Maybe<Array<Maybe<any>>>, overrides?: Maybe<Array<Maybe<any>>>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'DeleteAccountSetting', signature?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'BlockUsersSetting', unames?: Maybe<Array<Maybe<string>>>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'SocialMediasSetting', links: string, id: string, waitingCodeToChange?: Maybe<boolean> }> };

export type SendVerificatonCodeMutationVariables = Exact<{
  id: Scalars['ID'];
  code: Scalars['String'];
}>;


export type SendVerificatonCodeMutation = { __typename?: 'Mutation', sendVerificationCode?: Maybe<{ __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'DOBSetting', dob?: Maybe<any>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'CCSetting', cc?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean>, ccs?: Maybe<Array<Maybe<{ __typename?: 'CC', cc: string, name: string }>>> } | { __typename?: 'OptionSetting', i?: Maybe<number>, id: string, waitingCodeToChange?: Maybe<boolean>, options?: Maybe<Array<Maybe<{ __typename?: 'Option', i: number, name: string }>>> } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: Maybe<string>, default: number, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'RPESetting', defaults?: Maybe<Array<Maybe<any>>>, overrides?: Maybe<Array<Maybe<any>>>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'DeleteAccountSetting', signature?: Maybe<string>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'BlockUsersSetting', unames?: Maybe<Array<Maybe<string>>>, id: string, waitingCodeToChange?: Maybe<boolean> } | { __typename?: 'SocialMediasSetting', links: string, id: string, waitingCodeToChange?: Maybe<boolean> }> };

export type GetSupportersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSupportersQuery = { __typename?: 'Query', getSupporters?: Maybe<Array<Maybe<{ __typename?: 'Supporter', when?: Maybe<string>, user: { __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> } }>>> };

export type GetActiveSupportersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveSupportersQuery = { __typename?: 'Query', getActiveSupporters?: Maybe<Array<Maybe<{ __typename?: 'Supporter', when?: Maybe<string>, user: { __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> } }>>> };

export type UserFieldsFragment = { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: Maybe<string>, slvl?: Maybe<number>, sok?: Maybe<number>, age?: Maybe<number>, bw?: Maybe<number>, private?: Maybe<number>, isf?: Maybe<number>, joined?: Maybe<string>, usekg?: Maybe<number>, custom1RM?: Maybe<number>, est1RMFactor?: Maybe<number>, jranges?: Maybe<Array<Maybe<number>>>, estimate1RMFormula?: Maybe<string>, socialLinks?: Maybe<Array<Maybe<string>>> };

export type BriefUserFieldsFragment = { __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> };

export type GetVideosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVideosQuery = { __typename?: 'Query', getVideos?: Maybe<Array<Maybe<{ __typename?: 'Video', when: string, posted: string, logid: string, link: string, user: { __typename?: 'User', id: string, avatarhash: string, joined?: Maybe<string>, private?: Maybe<number>, uname: string, cc?: Maybe<string>, isf?: Maybe<number>, sok?: Maybe<number>, slvl?: Maybe<number> } }>>> };

export const BaseFieldsFragmentDoc = gql`
    fragment BaseFields on BaseStat {
  e
  w {
    v
    lb
  }
  bw {
    v
    lb
  }
  by
}
    `;
export const JeditorDataFieldsFragmentDoc = gql`
    fragment jeditorDataFields on JEditorData {
  exercises {
    e {
      id
      name
      type
    }
    days
    reps
  }
  etags
  baseBW
  did {
    ... on JEditorBWTag {
      bw
    }
    ... on JEditorText {
      text
    }
    ... on JEditorEBlock {
      e
      sets {
        usebw
        v
        c
        s
        r
        lb
        rpe
      }
    }
    ... on JEditorDayTag {
      on
    }
  }
}
    `;
export const SettingsFieldsFragmentDoc = gql`
    fragment SettingsFields on Setting {
  id
  waitingCodeToChange
}
    `;
export const SettingFieldsFragmentDoc = gql`
    fragment SettingFields on UserSetting {
  ... on Setting {
    ...SettingsFields
  }
  ... on EmailSetting {
    currentEmail
  }
  ... on DOBSetting {
    dob
  }
  ... on CCSetting {
    cc
    ccs {
      cc
      name
    }
  }
  ... on OptionSetting {
    i
    options {
      i
      name
    }
  }
  ... on SupporterStatus {
    slvl
    daysLeftAsActive
  }
  ... on Custom1RMFactorSetting {
    factor
    formula
    default
  }
  ... on RPESetting {
    defaults
    overrides
  }
  ... on DeleteAccountSetting {
    signature
  }
  ... on BlockUsersSetting {
    unames
  }
  ... on UsernameSetting {
    uname
  }
  ... on SocialMediasSetting {
    links
  }
}
    ${SettingsFieldsFragmentDoc}`;
export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  avatarhash
  uname
  cc
  slvl
  sok
  age
  bw
  private
  isf
  joined
  usekg
  custom1RM
  est1RMFactor
  jranges
  estimate1RMFormula
  socialLinks
}
    `;
export const BriefUserFieldsFragmentDoc = gql`
    fragment BriefUserFields on User {
  id
  avatarhash
  joined
  private
  uname
  cc
  isf
  sok
  slvl
}
    `;
export const GetAchievementsDocument = gql`
    query GetAchievements {
  getAchievements {
    id
    description
    name
  }
}
    `;

/**
 * __useGetAchievementsQuery__
 *
 * To run a query within a React component, call `useGetAchievementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAchievementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAchievementsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAchievementsQuery(baseOptions?: Apollo.QueryHookOptions<GetAchievementsQuery, GetAchievementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAchievementsQuery, GetAchievementsQueryVariables>(GetAchievementsDocument, options);
      }
export function useGetAchievementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAchievementsQuery, GetAchievementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAchievementsQuery, GetAchievementsQueryVariables>(GetAchievementsDocument, options);
        }
export type GetAchievementsQueryHookResult = ReturnType<typeof useGetAchievementsQuery>;
export type GetAchievementsLazyQueryHookResult = ReturnType<typeof useGetAchievementsLazyQuery>;
export type GetAchievementsQueryResult = Apollo.QueryResult<GetAchievementsQuery, GetAchievementsQueryVariables>;
export const GetAchievementsStateOfDocument = gql`
    query GetAchievementsStateOf($uid: ID!, $asOfThisYmd: YYYYMMDD!) {
  getAchievementsStateOf(uid: $uid, asOfThisYMD: $asOfThisYmd) {
    aid
    gotit
    when
    note
  }
}
    `;

/**
 * __useGetAchievementsStateOfQuery__
 *
 * To run a query within a React component, call `useGetAchievementsStateOfQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAchievementsStateOfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAchievementsStateOfQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *      asOfThisYmd: // value for 'asOfThisYmd'
 *   },
 * });
 */
export function useGetAchievementsStateOfQuery(baseOptions: Apollo.QueryHookOptions<GetAchievementsStateOfQuery, GetAchievementsStateOfQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAchievementsStateOfQuery, GetAchievementsStateOfQueryVariables>(GetAchievementsStateOfDocument, options);
      }
export function useGetAchievementsStateOfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAchievementsStateOfQuery, GetAchievementsStateOfQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAchievementsStateOfQuery, GetAchievementsStateOfQueryVariables>(GetAchievementsStateOfDocument, options);
        }
export type GetAchievementsStateOfQueryHookResult = ReturnType<typeof useGetAchievementsStateOfQuery>;
export type GetAchievementsStateOfLazyQueryHookResult = ReturnType<typeof useGetAchievementsStateOfLazyQuery>;
export type GetAchievementsStateOfQueryResult = Apollo.QueryResult<GetAchievementsStateOfQuery, GetAchievementsStateOfQueryVariables>;
export const GetOfficialExercisesDocument = gql`
    query GetOfficialExercises {
  officialExercises {
    id
    tag
    variants
    coolxbw
  }
}
    `;

/**
 * __useGetOfficialExercisesQuery__
 *
 * To run a query within a React component, call `useGetOfficialExercisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOfficialExercisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOfficialExercisesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOfficialExercisesQuery(baseOptions?: Apollo.QueryHookOptions<GetOfficialExercisesQuery, GetOfficialExercisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOfficialExercisesQuery, GetOfficialExercisesQueryVariables>(GetOfficialExercisesDocument, options);
      }
export function useGetOfficialExercisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOfficialExercisesQuery, GetOfficialExercisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOfficialExercisesQuery, GetOfficialExercisesQueryVariables>(GetOfficialExercisesDocument, options);
        }
export type GetOfficialExercisesQueryHookResult = ReturnType<typeof useGetOfficialExercisesQuery>;
export type GetOfficialExercisesLazyQueryHookResult = ReturnType<typeof useGetOfficialExercisesLazyQuery>;
export type GetOfficialExercisesQueryResult = Apollo.QueryResult<GetOfficialExercisesQuery, GetOfficialExercisesQueryVariables>;
export const GetSbdStatsDocument = gql`
    query GetSBDStats {
  sbdStats {
    total
    date
    perclass {
      wclass {
        name
        max
        min
        male
      }
      graph
    }
  }
}
    `;

/**
 * __useGetSbdStatsQuery__
 *
 * To run a query within a React component, call `useGetSbdStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSbdStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSbdStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSbdStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetSbdStatsQuery, GetSbdStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSbdStatsQuery, GetSbdStatsQueryVariables>(GetSbdStatsDocument, options);
      }
export function useGetSbdStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSbdStatsQuery, GetSbdStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSbdStatsQuery, GetSbdStatsQueryVariables>(GetSbdStatsDocument, options);
        }
export type GetSbdStatsQueryHookResult = ReturnType<typeof useGetSbdStatsQuery>;
export type GetSbdStatsLazyQueryHookResult = ReturnType<typeof useGetSbdStatsLazyQuery>;
export type GetSbdStatsQueryResult = Apollo.QueryResult<GetSbdStatsQuery, GetSbdStatsQueryVariables>;
export const GetCommunityStatsDocument = gql`
    query GetCommunityStats($etype: String!) {
  communityStats(etype: $etype) {
    title
    scanFrecuency
    heavyest {
      ...BaseFields
      ymd
      reps
    }
    estimated {
      ...BaseFields
      originalw {
        lb
        v
      }
      reps
      ymd
    }
    volume {
      ...BaseFields
      totalReps
    }
    timestamp
    exercises {
      id
      type
      name
    }
    users {
      ...BriefUserFields
    }
  }
}
    ${BaseFieldsFragmentDoc}
${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetCommunityStatsQuery__
 *
 * To run a query within a React component, call `useGetCommunityStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunityStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunityStatsQuery({
 *   variables: {
 *      etype: // value for 'etype'
 *   },
 * });
 */
export function useGetCommunityStatsQuery(baseOptions: Apollo.QueryHookOptions<GetCommunityStatsQuery, GetCommunityStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommunityStatsQuery, GetCommunityStatsQueryVariables>(GetCommunityStatsDocument, options);
      }
export function useGetCommunityStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommunityStatsQuery, GetCommunityStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommunityStatsQuery, GetCommunityStatsQueryVariables>(GetCommunityStatsDocument, options);
        }
export type GetCommunityStatsQueryHookResult = ReturnType<typeof useGetCommunityStatsQuery>;
export type GetCommunityStatsLazyQueryHookResult = ReturnType<typeof useGetCommunityStatsLazyQuery>;
export type GetCommunityStatsQueryResult = Apollo.QueryResult<GetCommunityStatsQuery, GetCommunityStatsQueryVariables>;
export const GetExercisesDocument = gql`
    query GetExercises($uid: ID!) {
  getExercises(uid: $uid) {
    days
    e {
      id
      type
      name
    }
    reps
  }
}
    `;

/**
 * __useGetExercisesQuery__
 *
 * To run a query within a React component, call `useGetExercisesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExercisesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExercisesQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *   },
 * });
 */
export function useGetExercisesQuery(baseOptions: Apollo.QueryHookOptions<GetExercisesQuery, GetExercisesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExercisesQuery, GetExercisesQueryVariables>(GetExercisesDocument, options);
      }
export function useGetExercisesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExercisesQuery, GetExercisesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExercisesQuery, GetExercisesQueryVariables>(GetExercisesDocument, options);
        }
export type GetExercisesQueryHookResult = ReturnType<typeof useGetExercisesQuery>;
export type GetExercisesLazyQueryHookResult = ReturnType<typeof useGetExercisesLazyQuery>;
export type GetExercisesQueryResult = Apollo.QueryResult<GetExercisesQuery, GetExercisesQueryVariables>;
export const GetPRsOfDocument = gql`
    query GetPRsOf($eid: ID!, $till: YMD) {
  getPRsOf(eid: $eid, till: $till) {
    exercise {
      id
      type
      name
    }
    totalWorkouts
    setsOf {
      r
      count
    }
    prs {
      w
      r
      lb
      when
      bw
    }
  }
}
    `;

/**
 * __useGetPRsOfQuery__
 *
 * To run a query within a React component, call `useGetPRsOfQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPRsOfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPRsOfQuery({
 *   variables: {
 *      eid: // value for 'eid'
 *      till: // value for 'till'
 *   },
 * });
 */
export function useGetPRsOfQuery(baseOptions: Apollo.QueryHookOptions<GetPRsOfQuery, GetPRsOfQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPRsOfQuery, GetPRsOfQueryVariables>(GetPRsOfDocument, options);
      }
export function useGetPRsOfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPRsOfQuery, GetPRsOfQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPRsOfQuery, GetPRsOfQueryVariables>(GetPRsOfDocument, options);
        }
export type GetPRsOfQueryHookResult = ReturnType<typeof useGetPRsOfQuery>;
export type GetPRsOfLazyQueryHookResult = ReturnType<typeof useGetPRsOfLazyQuery>;
export type GetPRsOfQueryResult = Apollo.QueryResult<GetPRsOfQuery, GetPRsOfQueryVariables>;
export const ExecExerciseDocument = gql`
    mutation ExecExercise($eid: ID, $ename: String, $confirms: ID) {
  execExercise(id: $eid, name: $ename, confirms: $confirms) {
    ... on Exercise {
      id
      name
      type
    }
    ... on ConfirmAction {
      message
      id
    }
  }
}
    `;
export type ExecExerciseMutationFn = Apollo.MutationFunction<ExecExerciseMutation, ExecExerciseMutationVariables>;

/**
 * __useExecExerciseMutation__
 *
 * To run a mutation, you first call `useExecExerciseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecExerciseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [execExerciseMutation, { data, loading, error }] = useExecExerciseMutation({
 *   variables: {
 *      eid: // value for 'eid'
 *      ename: // value for 'ename'
 *      confirms: // value for 'confirms'
 *   },
 * });
 */
export function useExecExerciseMutation(baseOptions?: Apollo.MutationHookOptions<ExecExerciseMutation, ExecExerciseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExecExerciseMutation, ExecExerciseMutationVariables>(ExecExerciseDocument, options);
      }
export type ExecExerciseMutationHookResult = ReturnType<typeof useExecExerciseMutation>;
export type ExecExerciseMutationResult = Apollo.MutationResult<ExecExerciseMutation>;
export type ExecExerciseMutationOptions = Apollo.BaseMutationOptions<ExecExerciseMutation, ExecExerciseMutationVariables>;
export const ExecBulkExercisesDocument = gql`
    mutation ExecBulkExercises($eids: [ID!]!, $mode: BulkMode!) {
  execBulkExercises(eids: $eids, mode: $mode)
}
    `;
export type ExecBulkExercisesMutationFn = Apollo.MutationFunction<ExecBulkExercisesMutation, ExecBulkExercisesMutationVariables>;

/**
 * __useExecBulkExercisesMutation__
 *
 * To run a mutation, you first call `useExecBulkExercisesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecBulkExercisesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [execBulkExercisesMutation, { data, loading, error }] = useExecBulkExercisesMutation({
 *   variables: {
 *      eids: // value for 'eids'
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useExecBulkExercisesMutation(baseOptions?: Apollo.MutationHookOptions<ExecBulkExercisesMutation, ExecBulkExercisesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExecBulkExercisesMutation, ExecBulkExercisesMutationVariables>(ExecBulkExercisesDocument, options);
      }
export type ExecBulkExercisesMutationHookResult = ReturnType<typeof useExecBulkExercisesMutation>;
export type ExecBulkExercisesMutationResult = Apollo.MutationResult<ExecBulkExercisesMutation>;
export type ExecBulkExercisesMutationOptions = Apollo.BaseMutationOptions<ExecBulkExercisesMutation, ExecBulkExercisesMutationVariables>;
export const GetFeedDocument = gql`
    query GetFeed($type: ActivityFeedType!, $olderThan: String, $newerThan: String) {
  getActivityFeed(type: $type, olderThan: $olderThan, newerThan: $newerThan) {
    user {
      ...BriefUserFields
    }
    when
    text
    workoutPreview {
      r
      w
      e {
        id
        name
        type
      }
    }
    andXmore
    posted
    media
    itemsLeftAfterThis
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetFeedQuery__
 *
 * To run a query within a React component, call `useGetFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeedQuery({
 *   variables: {
 *      type: // value for 'type'
 *      olderThan: // value for 'olderThan'
 *      newerThan: // value for 'newerThan'
 *   },
 * });
 */
export function useGetFeedQuery(baseOptions: Apollo.QueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
      }
export function useGetFeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeedQuery, GetFeedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeedQuery, GetFeedQueryVariables>(GetFeedDocument, options);
        }
export type GetFeedQueryHookResult = ReturnType<typeof useGetFeedQuery>;
export type GetFeedLazyQueryHookResult = ReturnType<typeof useGetFeedLazyQuery>;
export type GetFeedQueryResult = Apollo.QueryResult<GetFeedQuery, GetFeedQueryVariables>;
export const GetInboxDocument = gql`
    query GetInbox($olderThan: UTCDate, $newerThan: UTCDate, $dmsWithUID: ID) {
  getInbox(olderThan: $olderThan, newerThan: $newerThan, dmsWithUID: $dmsWithUID) {
    referencedUsers {
      ...BriefUserFields
    }
    notifications {
      __typename
      ... on INotification {
        id
        when
      }
      ... on IHasJOwner {
        jowner
        ymd
      }
      ... on IBy {
        by
      }
      ... on ITO {
        to
      }
      ... on IHasMessageID {
        msgid
      }
      ... on IMessageRef {
        msgid
        inResponseTo
        inResponseToMsg
      }
      ... on IHasText {
        text
      }
      ... on SystemNotification {
        variant: type
      }
    }
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetInboxQuery__
 *
 * To run a query within a React component, call `useGetInboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInboxQuery({
 *   variables: {
 *      olderThan: // value for 'olderThan'
 *      newerThan: // value for 'newerThan'
 *      dmsWithUID: // value for 'dmsWithUID'
 *   },
 * });
 */
export function useGetInboxQuery(baseOptions?: Apollo.QueryHookOptions<GetInboxQuery, GetInboxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInboxQuery, GetInboxQueryVariables>(GetInboxDocument, options);
      }
export function useGetInboxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInboxQuery, GetInboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInboxQuery, GetInboxQueryVariables>(GetInboxDocument, options);
        }
export type GetInboxQueryHookResult = ReturnType<typeof useGetInboxQuery>;
export type GetInboxLazyQueryHookResult = ReturnType<typeof useGetInboxLazyQuery>;
export type GetInboxQueryResult = Apollo.QueryResult<GetInboxQuery, GetInboxQueryVariables>;
export const GetAnnouncementsDocument = gql`
    query GetAnnouncements($olderThan: UTCDate, $limit: Int!) {
  getAnnouncements(olderThan: $olderThan, limit: $limit) {
    __typename
    id
    when
    text
    variant: type
  }
}
    `;

/**
 * __useGetAnnouncementsQuery__
 *
 * To run a query within a React component, call `useGetAnnouncementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnnouncementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnnouncementsQuery({
 *   variables: {
 *      olderThan: // value for 'olderThan'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetAnnouncementsQuery(baseOptions: Apollo.QueryHookOptions<GetAnnouncementsQuery, GetAnnouncementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnnouncementsQuery, GetAnnouncementsQueryVariables>(GetAnnouncementsDocument, options);
      }
export function useGetAnnouncementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnnouncementsQuery, GetAnnouncementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnnouncementsQuery, GetAnnouncementsQueryVariables>(GetAnnouncementsDocument, options);
        }
export type GetAnnouncementsQueryHookResult = ReturnType<typeof useGetAnnouncementsQuery>;
export type GetAnnouncementsLazyQueryHookResult = ReturnType<typeof useGetAnnouncementsLazyQuery>;
export type GetAnnouncementsQueryResult = Apollo.QueryResult<GetAnnouncementsQuery, GetAnnouncementsQueryVariables>;
export const GetUserInfoDocument = gql`
    query GetUserInfo($userInfoUname: String!) {
  userInfo(uname: $userInfoUname) {
    user {
      ...UserFields
    }
    daysLogged
    best3 {
      w
      e {
        id
        name
        type
      }
    }
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useGetUserInfoQuery__
 *
 * To run a query within a React component, call `useGetUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserInfoQuery({
 *   variables: {
 *      userInfoUname: // value for 'userInfoUname'
 *   },
 * });
 */
export function useGetUserInfoQuery(baseOptions: Apollo.QueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
      }
export function useGetUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserInfoQuery, GetUserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserInfoQuery, GetUserInfoQueryVariables>(GetUserInfoDocument, options);
        }
export type GetUserInfoQueryHookResult = ReturnType<typeof useGetUserInfoQuery>;
export type GetUserInfoLazyQueryHookResult = ReturnType<typeof useGetUserInfoLazyQuery>;
export type GetUserInfoQueryResult = Apollo.QueryResult<GetUserInfoQuery, GetUserInfoQueryVariables>;
export const GetCalendarDaysDocument = gql`
    query GetCalendarDays($uid: ID!, $from: YYYYMMDD!, $to: YYYYMMDD!) {
  getCalendarDays(uid: $uid, from: $from, to: $to)
}
    `;

/**
 * __useGetCalendarDaysQuery__
 *
 * To run a query within a React component, call `useGetCalendarDaysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCalendarDaysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCalendarDaysQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useGetCalendarDaysQuery(baseOptions: Apollo.QueryHookOptions<GetCalendarDaysQuery, GetCalendarDaysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCalendarDaysQuery, GetCalendarDaysQueryVariables>(GetCalendarDaysDocument, options);
      }
export function useGetCalendarDaysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCalendarDaysQuery, GetCalendarDaysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCalendarDaysQuery, GetCalendarDaysQueryVariables>(GetCalendarDaysDocument, options);
        }
export type GetCalendarDaysQueryHookResult = ReturnType<typeof useGetCalendarDaysQuery>;
export type GetCalendarDaysLazyQueryHookResult = ReturnType<typeof useGetCalendarDaysLazyQuery>;
export type GetCalendarDaysQueryResult = Apollo.QueryResult<GetCalendarDaysQuery, GetCalendarDaysQueryVariables>;
export const JDayDocument = gql`
    query JDay($uid: ID!, $ymd: YMD) {
  jday(uid: $uid, ymd: $ymd) {
    id
    log
    fromMobile
    bw
    eblocks {
      eid
      sets {
        w
        r
        s
        lb
        ubw
        c
        rpe
        pr
        est1rm
        eff
        int
      }
    }
    exercises {
      exercise {
        id
        name
        type
      }
      best {
        eff {
          w
          r
          lb
          when
          bw
          est1rm
        }
        int {
          w
          r
          lb
          when
          bw
        }
      }
    }
  }
}
    `;

/**
 * __useJDayQuery__
 *
 * To run a query within a React component, call `useJDayQuery` and pass it any options that fit your needs.
 * When your component renders, `useJDayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJDayQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *      ymd: // value for 'ymd'
 *   },
 * });
 */
export function useJDayQuery(baseOptions: Apollo.QueryHookOptions<JDayQuery, JDayQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<JDayQuery, JDayQueryVariables>(JDayDocument, options);
      }
export function useJDayLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JDayQuery, JDayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<JDayQuery, JDayQueryVariables>(JDayDocument, options);
        }
export type JDayQueryHookResult = ReturnType<typeof useJDayQuery>;
export type JDayLazyQueryHookResult = ReturnType<typeof useJDayLazyQuery>;
export type JDayQueryResult = Apollo.QueryResult<JDayQuery, JDayQueryVariables>;
export const AlsoPostedDocument = gql`
    query AlsoPosted($ymd: YMD) {
  alsoposted(ymd: $ymd) {
    ...BriefUserFields
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useAlsoPostedQuery__
 *
 * To run a query within a React component, call `useAlsoPostedQuery` and pass it any options that fit your needs.
 * When your component renders, `useAlsoPostedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAlsoPostedQuery({
 *   variables: {
 *      ymd: // value for 'ymd'
 *   },
 * });
 */
export function useAlsoPostedQuery(baseOptions?: Apollo.QueryHookOptions<AlsoPostedQuery, AlsoPostedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AlsoPostedQuery, AlsoPostedQueryVariables>(AlsoPostedDocument, options);
      }
export function useAlsoPostedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AlsoPostedQuery, AlsoPostedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AlsoPostedQuery, AlsoPostedQueryVariables>(AlsoPostedDocument, options);
        }
export type AlsoPostedQueryHookResult = ReturnType<typeof useAlsoPostedQuery>;
export type AlsoPostedLazyQueryHookResult = ReturnType<typeof useAlsoPostedLazyQuery>;
export type AlsoPostedQueryResult = Apollo.QueryResult<AlsoPostedQuery, AlsoPostedQueryVariables>;
export const GetJRangeDocument = gql`
    query GetJRange($uid: ID!, $ymd: YMD!, $range: Int!) {
  jrange(uid: $uid, ymd: $ymd, range: $range) {
    exercises {
      id
      name
      type
    }
    days {
      on
      did {
        eid
        sets {
          w
          r
          s
          lb
          ubw
          c
          rpe
          pr
          est1rm
          eff
          int
        }
      }
    }
  }
}
    `;

/**
 * __useGetJRangeQuery__
 *
 * To run a query within a React component, call `useGetJRangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJRangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJRangeQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *      ymd: // value for 'ymd'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetJRangeQuery(baseOptions: Apollo.QueryHookOptions<GetJRangeQuery, GetJRangeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJRangeQuery, GetJRangeQueryVariables>(GetJRangeDocument, options);
      }
export function useGetJRangeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJRangeQuery, GetJRangeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJRangeQuery, GetJRangeQueryVariables>(GetJRangeDocument, options);
        }
export type GetJRangeQueryHookResult = ReturnType<typeof useGetJRangeQuery>;
export type GetJRangeLazyQueryHookResult = ReturnType<typeof useGetJRangeLazyQuery>;
export type GetJRangeQueryResult = Apollo.QueryResult<GetJRangeQuery, GetJRangeQueryVariables>;
export const GetJEditorDataDocument = gql`
    query GetJEditorData($ymd: YMD, $range: Int) {
  jeditor(ymd: $ymd, range: $range) {
    ...jeditorDataFields
  }
}
    ${JeditorDataFieldsFragmentDoc}`;

/**
 * __useGetJEditorDataQuery__
 *
 * To run a query within a React component, call `useGetJEditorDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJEditorDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJEditorDataQuery({
 *   variables: {
 *      ymd: // value for 'ymd'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useGetJEditorDataQuery(baseOptions?: Apollo.QueryHookOptions<GetJEditorDataQuery, GetJEditorDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetJEditorDataQuery, GetJEditorDataQueryVariables>(GetJEditorDataDocument, options);
      }
export function useGetJEditorDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetJEditorDataQuery, GetJEditorDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetJEditorDataQuery, GetJEditorDataQueryVariables>(GetJEditorDataDocument, options);
        }
export type GetJEditorDataQueryHookResult = ReturnType<typeof useGetJEditorDataQuery>;
export type GetJEditorDataLazyQueryHookResult = ReturnType<typeof useGetJEditorDataLazyQuery>;
export type GetJEditorDataQueryResult = Apollo.QueryResult<GetJEditorDataQuery, GetJEditorDataQueryVariables>;
export const SaveJEditorDocument = gql`
    mutation SaveJEditor($rows: [JEditorSaveRow], $defaultDate: YMD!) {
  saveJEditor(rows: $rows, defaultDate: $defaultDate)
}
    `;
export type SaveJEditorMutationFn = Apollo.MutationFunction<SaveJEditorMutation, SaveJEditorMutationVariables>;

/**
 * __useSaveJEditorMutation__
 *
 * To run a mutation, you first call `useSaveJEditorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveJEditorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveJEditorMutation, { data, loading, error }] = useSaveJEditorMutation({
 *   variables: {
 *      rows: // value for 'rows'
 *      defaultDate: // value for 'defaultDate'
 *   },
 * });
 */
export function useSaveJEditorMutation(baseOptions?: Apollo.MutationHookOptions<SaveJEditorMutation, SaveJEditorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveJEditorMutation, SaveJEditorMutationVariables>(SaveJEditorDocument, options);
      }
export type SaveJEditorMutationHookResult = ReturnType<typeof useSaveJEditorMutation>;
export type SaveJEditorMutationResult = Apollo.MutationResult<SaveJEditorMutation>;
export type SaveJEditorMutationOptions = Apollo.BaseMutationOptions<SaveJEditorMutation, SaveJEditorMutationVariables>;
export const DownloadLogsDocument = gql`
    query DownloadLogs {
  downloadLogs {
    ...jeditorDataFields
  }
}
    ${JeditorDataFieldsFragmentDoc}`;

/**
 * __useDownloadLogsQuery__
 *
 * To run a query within a React component, call `useDownloadLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDownloadLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDownloadLogsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDownloadLogsQuery(baseOptions?: Apollo.QueryHookOptions<DownloadLogsQuery, DownloadLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DownloadLogsQuery, DownloadLogsQueryVariables>(DownloadLogsDocument, options);
      }
export function useDownloadLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DownloadLogsQuery, DownloadLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DownloadLogsQuery, DownloadLogsQueryVariables>(DownloadLogsDocument, options);
        }
export type DownloadLogsQueryHookResult = ReturnType<typeof useDownloadLogsQuery>;
export type DownloadLogsLazyQueryHookResult = ReturnType<typeof useDownloadLogsLazyQuery>;
export type DownloadLogsQueryResult = Apollo.QueryResult<DownloadLogsQuery, DownloadLogsQueryVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($of: ID!, $has: ID) {
  getFollowersCount(uid: $of, has: $has) {
    has
    total
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      of: // value for 'of'
 *      has: // value for 'has'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
      }
export function useGetFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, options);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersQueryResult = Apollo.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const LikeMessageDocument = gql`
    mutation LikeMessage($target: ID!) {
  likeMessage(target: $target)
}
    `;
export type LikeMessageMutationFn = Apollo.MutationFunction<LikeMessageMutation, LikeMessageMutationVariables>;

/**
 * __useLikeMessageMutation__
 *
 * To run a mutation, you first call `useLikeMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeMessageMutation, { data, loading, error }] = useLikeMessageMutation({
 *   variables: {
 *      target: // value for 'target'
 *   },
 * });
 */
export function useLikeMessageMutation(baseOptions?: Apollo.MutationHookOptions<LikeMessageMutation, LikeMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeMessageMutation, LikeMessageMutationVariables>(LikeMessageDocument, options);
      }
export type LikeMessageMutationHookResult = ReturnType<typeof useLikeMessageMutation>;
export type LikeMessageMutationResult = Apollo.MutationResult<LikeMessageMutation>;
export type LikeMessageMutationOptions = Apollo.BaseMutationOptions<LikeMessageMutation, LikeMessageMutationVariables>;
export const LikeJournalLogDocument = gql`
    mutation LikeJournalLog($target: ID!) {
  likeJournalLog(target: $target)
}
    `;
export type LikeJournalLogMutationFn = Apollo.MutationFunction<LikeJournalLogMutation, LikeJournalLogMutationVariables>;

/**
 * __useLikeJournalLogMutation__
 *
 * To run a mutation, you first call `useLikeJournalLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeJournalLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeJournalLogMutation, { data, loading, error }] = useLikeJournalLogMutation({
 *   variables: {
 *      target: // value for 'target'
 *   },
 * });
 */
export function useLikeJournalLogMutation(baseOptions?: Apollo.MutationHookOptions<LikeJournalLogMutation, LikeJournalLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeJournalLogMutation, LikeJournalLogMutationVariables>(LikeJournalLogDocument, options);
      }
export type LikeJournalLogMutationHookResult = ReturnType<typeof useLikeJournalLogMutation>;
export type LikeJournalLogMutationResult = Apollo.MutationResult<LikeJournalLogMutation>;
export type LikeJournalLogMutationOptions = Apollo.BaseMutationOptions<LikeJournalLogMutation, LikeJournalLogMutationVariables>;
export const FollowDocument = gql`
    mutation Follow($uid: ID!, $not: Boolean) {
  follow(uid: $uid, not: $not)
}
    `;
export type FollowMutationFn = Apollo.MutationFunction<FollowMutation, FollowMutationVariables>;

/**
 * __useFollowMutation__
 *
 * To run a mutation, you first call `useFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followMutation, { data, loading, error }] = useFollowMutation({
 *   variables: {
 *      uid: // value for 'uid'
 *      not: // value for 'not'
 *   },
 * });
 */
export function useFollowMutation(baseOptions?: Apollo.MutationHookOptions<FollowMutation, FollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FollowMutation, FollowMutationVariables>(FollowDocument, options);
      }
export type FollowMutationHookResult = ReturnType<typeof useFollowMutation>;
export type FollowMutationResult = Apollo.MutationResult<FollowMutation>;
export type FollowMutationOptions = Apollo.BaseMutationOptions<FollowMutation, FollowMutationVariables>;
export const GetLogInboxDocument = gql`
    query GetLogInbox($olderThan: UTCDate, $newerThan: UTCDate, $logid: ID!) {
  getLogInbox(olderThan: $olderThan, newerThan: $newerThan, logid: $logid) {
    referencedUsers {
      ...BriefUserFields
    }
    notifications {
      __typename
      ... on INotification {
        id
        when
      }
      ... on IHasJOwner {
        jowner
        ymd
      }
      ... on IBy {
        by
      }
      ... on ITO {
        to
      }
      ... on IHasMessageID {
        msgid
      }
      ... on IMessageRef {
        msgid
        inResponseTo
        inResponseToMsg
      }
      ... on IHasText {
        text
      }
      ... on SystemNotification {
        variant: type
      }
    }
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetLogInboxQuery__
 *
 * To run a query within a React component, call `useGetLogInboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLogInboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLogInboxQuery({
 *   variables: {
 *      olderThan: // value for 'olderThan'
 *      newerThan: // value for 'newerThan'
 *      logid: // value for 'logid'
 *   },
 * });
 */
export function useGetLogInboxQuery(baseOptions: Apollo.QueryHookOptions<GetLogInboxQuery, GetLogInboxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLogInboxQuery, GetLogInboxQueryVariables>(GetLogInboxDocument, options);
      }
export function useGetLogInboxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLogInboxQuery, GetLogInboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLogInboxQuery, GetLogInboxQueryVariables>(GetLogInboxDocument, options);
        }
export type GetLogInboxQueryHookResult = ReturnType<typeof useGetLogInboxQuery>;
export type GetLogInboxLazyQueryHookResult = ReturnType<typeof useGetLogInboxLazyQuery>;
export type GetLogInboxQueryResult = Apollo.QueryResult<GetLogInboxQuery, GetLogInboxQueryVariables>;
export const GetPublicInteractionsInboxDocument = gql`
    query GetPublicInteractionsInbox($olderThan: UTCDate, $newerThan: UTCDate) {
  getAllPublicInteractionsInbox(olderThan: $olderThan, newerThan: $newerThan) {
    referencedUsers {
      ...BriefUserFields
    }
    notifications {
      __typename
      ... on INotification {
        id
        when
      }
      ... on IHasJOwner {
        jowner
        ymd
      }
      ... on IBy {
        by
      }
      ... on ITO {
        to
      }
      ... on IHasMessageID {
        msgid
      }
      ... on IMessageRef {
        msgid
        inResponseTo
        inResponseToMsg
      }
      ... on IHasText {
        text
      }
      ... on SystemNotification {
        variant: type
      }
    }
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetPublicInteractionsInboxQuery__
 *
 * To run a query within a React component, call `useGetPublicInteractionsInboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicInteractionsInboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicInteractionsInboxQuery({
 *   variables: {
 *      olderThan: // value for 'olderThan'
 *      newerThan: // value for 'newerThan'
 *   },
 * });
 */
export function useGetPublicInteractionsInboxQuery(baseOptions?: Apollo.QueryHookOptions<GetPublicInteractionsInboxQuery, GetPublicInteractionsInboxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPublicInteractionsInboxQuery, GetPublicInteractionsInboxQueryVariables>(GetPublicInteractionsInboxDocument, options);
      }
export function useGetPublicInteractionsInboxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPublicInteractionsInboxQuery, GetPublicInteractionsInboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPublicInteractionsInboxQuery, GetPublicInteractionsInboxQueryVariables>(GetPublicInteractionsInboxDocument, options);
        }
export type GetPublicInteractionsInboxQueryHookResult = ReturnType<typeof useGetPublicInteractionsInboxQuery>;
export type GetPublicInteractionsInboxLazyQueryHookResult = ReturnType<typeof useGetPublicInteractionsInboxLazyQuery>;
export type GetPublicInteractionsInboxQueryResult = Apollo.QueryResult<GetPublicInteractionsInboxQuery, GetPublicInteractionsInboxQueryVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($message: String!, $type: MessageType!, $targetID: ID!) {
  sendMessage(message: $message, type: $type, target: $targetID) {
    id
    when
    msgid
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      message: // value for 'message'
 *      type: // value for 'type'
 *      targetID: // value for 'targetID'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($id: ID!) {
  deleteMessage(id: $id)
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const GetSessionDocument = gql`
    query GetSession {
  getSession {
    user {
      ...UserFields
    }
    time
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useGetSessionQuery__
 *
 * To run a query within a React component, call `useGetSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSessionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSessionQuery(baseOptions?: Apollo.QueryHookOptions<GetSessionQuery, GetSessionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSessionQuery, GetSessionQueryVariables>(GetSessionDocument, options);
      }
export function useGetSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSessionQuery, GetSessionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSessionQuery, GetSessionQueryVariables>(GetSessionDocument, options);
        }
export type GetSessionQueryHookResult = ReturnType<typeof useGetSessionQuery>;
export type GetSessionLazyQueryHookResult = ReturnType<typeof useGetSessionLazyQuery>;
export type GetSessionQueryResult = Apollo.QueryResult<GetSessionQuery, GetSessionQueryVariables>;
export const SignupDocument = gql`
    mutation Signup($uname: String!, $email: String!, $pass: String!, $isf: Int!, $usekg: Int!) {
  signup(uname: $uname, email: $email, pass: $pass, isf: $isf, usekg: $usekg)
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      uname: // value for 'uname'
 *      email: // value for 'email'
 *      pass: // value for 'pass'
 *      isf: // value for 'isf'
 *      usekg: // value for 'usekg'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const LoginDocument = gql`
    mutation Login($u: String!, $p: String!) {
  login(u: $u, p: $p)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      u: // value for 'u'
 *      p: // value for 'p'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const VerifySignupDocument = gql`
    mutation VerifySignup($code: String!) {
  verifySignup(code: $code)
}
    `;
export type VerifySignupMutationFn = Apollo.MutationFunction<VerifySignupMutation, VerifySignupMutationVariables>;

/**
 * __useVerifySignupMutation__
 *
 * To run a mutation, you first call `useVerifySignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifySignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifySignupMutation, { data, loading, error }] = useVerifySignupMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifySignupMutation(baseOptions?: Apollo.MutationHookOptions<VerifySignupMutation, VerifySignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifySignupMutation, VerifySignupMutationVariables>(VerifySignupDocument, options);
      }
export type VerifySignupMutationHookResult = ReturnType<typeof useVerifySignupMutation>;
export type VerifySignupMutationResult = Apollo.MutationResult<VerifySignupMutation>;
export type VerifySignupMutationOptions = Apollo.BaseMutationOptions<VerifySignupMutation, VerifySignupMutationVariables>;
export const ForgotDocument = gql`
    mutation Forgot($uore: String!) {
  forgot(uore: $uore)
}
    `;
export type ForgotMutationFn = Apollo.MutationFunction<ForgotMutation, ForgotMutationVariables>;

/**
 * __useForgotMutation__
 *
 * To run a mutation, you first call `useForgotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotMutation, { data, loading, error }] = useForgotMutation({
 *   variables: {
 *      uore: // value for 'uore'
 *   },
 * });
 */
export function useForgotMutation(baseOptions?: Apollo.MutationHookOptions<ForgotMutation, ForgotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotMutation, ForgotMutationVariables>(ForgotDocument, options);
      }
export type ForgotMutationHookResult = ReturnType<typeof useForgotMutation>;
export type ForgotMutationResult = Apollo.MutationResult<ForgotMutation>;
export type ForgotMutationOptions = Apollo.BaseMutationOptions<ForgotMutation, ForgotMutationVariables>;
export const LoginWithGoogleDocument = gql`
    mutation LoginWithGoogle($jwt: String!, $uname: String, $isf: Int, $usekg: Int) {
  loginWithGoogle(jwt: $jwt, uname: $uname, isf: $isf, usekg: $usekg)
}
    `;
export type LoginWithGoogleMutationFn = Apollo.MutationFunction<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;

/**
 * __useLoginWithGoogleMutation__
 *
 * To run a mutation, you first call `useLoginWithGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithGoogleMutation, { data, loading, error }] = useLoginWithGoogleMutation({
 *   variables: {
 *      jwt: // value for 'jwt'
 *      uname: // value for 'uname'
 *      isf: // value for 'isf'
 *      usekg: // value for 'usekg'
 *   },
 * });
 */
export function useLoginWithGoogleMutation(baseOptions?: Apollo.MutationHookOptions<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>(LoginWithGoogleDocument, options);
      }
export type LoginWithGoogleMutationHookResult = ReturnType<typeof useLoginWithGoogleMutation>;
export type LoginWithGoogleMutationResult = Apollo.MutationResult<LoginWithGoogleMutation>;
export type LoginWithGoogleMutationOptions = Apollo.BaseMutationOptions<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;
export const LoginWithFirebaseDocument = gql`
    mutation LoginWithFirebase($token: String!, $uname: String, $isf: Int, $usekg: Int) {
  loginWithFirebase(token: $token, uname: $uname, isf: $isf, usekg: $usekg)
}
    `;
export type LoginWithFirebaseMutationFn = Apollo.MutationFunction<LoginWithFirebaseMutation, LoginWithFirebaseMutationVariables>;

/**
 * __useLoginWithFirebaseMutation__
 *
 * To run a mutation, you first call `useLoginWithFirebaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithFirebaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithFirebaseMutation, { data, loading, error }] = useLoginWithFirebaseMutation({
 *   variables: {
 *      token: // value for 'token'
 *      uname: // value for 'uname'
 *      isf: // value for 'isf'
 *      usekg: // value for 'usekg'
 *   },
 * });
 */
export function useLoginWithFirebaseMutation(baseOptions?: Apollo.MutationHookOptions<LoginWithFirebaseMutation, LoginWithFirebaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginWithFirebaseMutation, LoginWithFirebaseMutationVariables>(LoginWithFirebaseDocument, options);
      }
export type LoginWithFirebaseMutationHookResult = ReturnType<typeof useLoginWithFirebaseMutation>;
export type LoginWithFirebaseMutationResult = Apollo.MutationResult<LoginWithFirebaseMutation>;
export type LoginWithFirebaseMutationOptions = Apollo.BaseMutationOptions<LoginWithFirebaseMutation, LoginWithFirebaseMutationVariables>;
export const GetSettingsDocument = gql`
    query GetSettings {
  getUserSettings {
    ...SettingFields
  }
}
    ${SettingFieldsFragmentDoc}`;

/**
 * __useGetSettingsQuery__
 *
 * To run a query within a React component, call `useGetSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSettingsQuery(baseOptions?: Apollo.QueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
      }
export function useGetSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSettingsQuery, GetSettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSettingsQuery, GetSettingsQueryVariables>(GetSettingsDocument, options);
        }
export type GetSettingsQueryHookResult = ReturnType<typeof useGetSettingsQuery>;
export type GetSettingsLazyQueryHookResult = ReturnType<typeof useGetSettingsLazyQuery>;
export type GetSettingsQueryResult = Apollo.QueryResult<GetSettingsQuery, GetSettingsQueryVariables>;
export const SetSettingDocument = gql`
    mutation SetSetting($id: ID!, $value: SettingValue) {
  setSetting(id: $id, value: $value) {
    ...SettingFields
  }
}
    ${SettingFieldsFragmentDoc}`;
export type SetSettingMutationFn = Apollo.MutationFunction<SetSettingMutation, SetSettingMutationVariables>;

/**
 * __useSetSettingMutation__
 *
 * To run a mutation, you first call `useSetSettingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSettingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSettingMutation, { data, loading, error }] = useSetSettingMutation({
 *   variables: {
 *      id: // value for 'id'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useSetSettingMutation(baseOptions?: Apollo.MutationHookOptions<SetSettingMutation, SetSettingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetSettingMutation, SetSettingMutationVariables>(SetSettingDocument, options);
      }
export type SetSettingMutationHookResult = ReturnType<typeof useSetSettingMutation>;
export type SetSettingMutationResult = Apollo.MutationResult<SetSettingMutation>;
export type SetSettingMutationOptions = Apollo.BaseMutationOptions<SetSettingMutation, SetSettingMutationVariables>;
export const SendVerificatonCodeDocument = gql`
    mutation SendVerificatonCode($id: ID!, $code: String!) {
  sendVerificationCode(id: $id, code: $code) {
    ...SettingFields
  }
}
    ${SettingFieldsFragmentDoc}`;
export type SendVerificatonCodeMutationFn = Apollo.MutationFunction<SendVerificatonCodeMutation, SendVerificatonCodeMutationVariables>;

/**
 * __useSendVerificatonCodeMutation__
 *
 * To run a mutation, you first call `useSendVerificatonCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendVerificatonCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendVerificatonCodeMutation, { data, loading, error }] = useSendVerificatonCodeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useSendVerificatonCodeMutation(baseOptions?: Apollo.MutationHookOptions<SendVerificatonCodeMutation, SendVerificatonCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendVerificatonCodeMutation, SendVerificatonCodeMutationVariables>(SendVerificatonCodeDocument, options);
      }
export type SendVerificatonCodeMutationHookResult = ReturnType<typeof useSendVerificatonCodeMutation>;
export type SendVerificatonCodeMutationResult = Apollo.MutationResult<SendVerificatonCodeMutation>;
export type SendVerificatonCodeMutationOptions = Apollo.BaseMutationOptions<SendVerificatonCodeMutation, SendVerificatonCodeMutationVariables>;
export const GetSupportersDocument = gql`
    query GetSupporters {
  getSupporters {
    user {
      ...BriefUserFields
    }
    when
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetSupportersQuery__
 *
 * To run a query within a React component, call `useGetSupportersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSupportersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSupportersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSupportersQuery(baseOptions?: Apollo.QueryHookOptions<GetSupportersQuery, GetSupportersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSupportersQuery, GetSupportersQueryVariables>(GetSupportersDocument, options);
      }
export function useGetSupportersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSupportersQuery, GetSupportersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSupportersQuery, GetSupportersQueryVariables>(GetSupportersDocument, options);
        }
export type GetSupportersQueryHookResult = ReturnType<typeof useGetSupportersQuery>;
export type GetSupportersLazyQueryHookResult = ReturnType<typeof useGetSupportersLazyQuery>;
export type GetSupportersQueryResult = Apollo.QueryResult<GetSupportersQuery, GetSupportersQueryVariables>;
export const GetActiveSupportersDocument = gql`
    query GetActiveSupporters {
  getActiveSupporters {
    user {
      ...BriefUserFields
    }
    when
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetActiveSupportersQuery__
 *
 * To run a query within a React component, call `useGetActiveSupportersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveSupportersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveSupportersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActiveSupportersQuery(baseOptions?: Apollo.QueryHookOptions<GetActiveSupportersQuery, GetActiveSupportersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveSupportersQuery, GetActiveSupportersQueryVariables>(GetActiveSupportersDocument, options);
      }
export function useGetActiveSupportersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveSupportersQuery, GetActiveSupportersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveSupportersQuery, GetActiveSupportersQueryVariables>(GetActiveSupportersDocument, options);
        }
export type GetActiveSupportersQueryHookResult = ReturnType<typeof useGetActiveSupportersQuery>;
export type GetActiveSupportersLazyQueryHookResult = ReturnType<typeof useGetActiveSupportersLazyQuery>;
export type GetActiveSupportersQueryResult = Apollo.QueryResult<GetActiveSupportersQuery, GetActiveSupportersQueryVariables>;
export const GetVideosDocument = gql`
    query GetVideos {
  getVideos {
    user {
      ...BriefUserFields
    }
    when
    posted
    logid
    link
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetVideosQuery__
 *
 * To run a query within a React component, call `useGetVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVideosQuery(baseOptions?: Apollo.QueryHookOptions<GetVideosQuery, GetVideosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVideosQuery, GetVideosQueryVariables>(GetVideosDocument, options);
      }
export function useGetVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVideosQuery, GetVideosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVideosQuery, GetVideosQueryVariables>(GetVideosDocument, options);
        }
export type GetVideosQueryHookResult = ReturnType<typeof useGetVideosQuery>;
export type GetVideosLazyQueryHookResult = ReturnType<typeof useGetVideosLazyQuery>;
export type GetVideosQueryResult = Apollo.QueryResult<GetVideosQuery, GetVideosQueryVariables>;