import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  CalendarDayKey: any;
  ESet: any;
  JEditorSaveRow: any;
  SBDSlot: any;
  SettingValue: any;
  UTCDate: any;
  Upload: any;
  YMD: any;
  YYYYMMDD: any;
};

export type Achievement = {
  __typename?: 'Achievement';
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type AchievementState = {
  __typename?: 'AchievementState';
  aid: Scalars['ID'];
  gotit?: Maybe<Scalars['Boolean']>;
  note?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['YYYYMMDD']>;
};

export enum ActivityFeedType {
  Following = 'following',
  Global = 'global'
}

export type BaseStat = {
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
  e: Scalars['ID'];
  w: Weight;
};

export type BestEStat = {
  __typename?: 'BestEStat';
  bw?: Maybe<Scalars['Float']>;
  est1rm?: Maybe<Scalars['Float']>;
  lb: Scalars['Int'];
  r: Scalars['Int'];
  w: Scalars['Float'];
  when: Scalars['YMD'];
};

export type BestLift = {
  __typename?: 'BestLift';
  e: Exercise;
  w: Scalars['Float'];
};

export type BlockUsersSetting = Setting & {
  __typename?: 'BlockUsersSetting';
  id: Scalars['ID'];
  unames?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type CommunityStats = {
  __typename?: 'CommunityStats';
  estimated?: Maybe<Array<Maybe<Estimated1Rm>>>;
  exercises?: Maybe<Array<Maybe<Exercise>>>;
  heavyest?: Maybe<Array<Maybe<Heavyest>>>;
  scanFrecuency: Scalars['String'];
  timestamp?: Maybe<Scalars['UTCDate']>;
  title: Scalars['String'];
  users?: Maybe<Array<Maybe<User>>>;
  volume?: Maybe<Array<Maybe<MostVolume>>>;
};

export type ConfirmAction = {
  __typename?: 'ConfirmAction';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type Custom1RmFactorSetting = Setting & {
  __typename?: 'Custom1RMFactorSetting';
  default: Scalars['Int'];
  factor: Scalars['Int'];
  formula?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Dm = IBy & IHasText & IMessageRef & INotification & Ito & {
  __typename?: 'DM';
  by: Scalars['ID'];
  id: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
  isGlobal?: Maybe<Scalars['Boolean']>;
  msgid: Scalars['ID'];
  text: Scalars['String'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
};

export type DobSetting = Setting & {
  __typename?: 'DOBSetting';
  dob?: Maybe<Scalars['YMD']>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type DeleteAccountSetting = Setting & {
  __typename?: 'DeleteAccountSetting';
  id: Scalars['ID'];
  signature?: Maybe<Scalars['String']>;
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
  best?: Maybe<EBestStats>;
  exercise: Exercise;
};

export type EblockPreview = {
  __typename?: 'EblockPreview';
  e: Exercise;
  r?: Maybe<Scalars['Int']>;
  w?: Maybe<Scalars['Float']>;
};

export type EmailSetting = Setting & {
  __typename?: 'EmailSetting';
  currentEmail: Scalars['String'];
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Estimated1Rm = BaseStat & {
  __typename?: 'Estimated1RM';
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
  e: Scalars['ID'];
  originalw: Weight;
  reps: Scalars['Int'];
  w: Weight;
  ymd: Scalars['YMD'];
};

export type ExecExerciseResponse = ConfirmAction | Exercise;

export type Exercise = {
  __typename?: 'Exercise';
  id: Scalars['ID'];
  name: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type ExerciseStat = {
  __typename?: 'ExerciseStat';
  days: Scalars['Int'];
  e: Exercise;
  reps: Scalars['Int'];
};

export type FollowersCount = {
  __typename?: 'FollowersCount';
  has?: Maybe<Scalars['Boolean']>;
  total: Scalars['Int'];
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type Heavyest = BaseStat & {
  __typename?: 'Heavyest';
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
  e: Scalars['ID'];
  reps: Scalars['Int'];
  w: Weight;
  ymd: Scalars['YMD'];
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
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
  msgid: Scalars['ID'];
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

export type JComment = IBy & IHasJOwner & IHasText & IMessageRef & INotification & Ito & {
  __typename?: 'JComment';
  by: Scalars['ID'];
  id: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
  jowner: Scalars['ID'];
  msgid: Scalars['ID'];
  text: Scalars['String'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
  ymd: Scalars['YMD'];
};

export type JEditorBwTag = {
  __typename?: 'JEditorBWTag';
  bw?: Maybe<Scalars['Float']>;
};

export type JEditorData = {
  __typename?: 'JEditorData';
  baseBW?: Maybe<Scalars['Float']>;
  did?: Maybe<Array<Maybe<JeditorRow>>>;
  etags: Array<Maybe<Scalars['String']>>;
  exercises: Array<Maybe<ExerciseStat>>;
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
  c?: Maybe<Scalars['String']>;
  lb?: Maybe<Scalars['Int']>;
  r?: Maybe<Scalars['Int']>;
  rpe?: Maybe<Scalars['Float']>;
  s?: Maybe<Scalars['Int']>;
  usebw?: Maybe<Scalars['Int']>;
  v?: Maybe<Scalars['Float']>;
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
  bw?: Maybe<Scalars['Float']>;
  eblocks?: Maybe<Array<Maybe<EBlock>>>;
  exercises?: Maybe<Array<Maybe<ERef>>>;
  fromMobile?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  log?: Maybe<Scalars['String']>;
};

export type JRangeData = {
  __typename?: 'JRangeData';
  days?: Maybe<Array<Maybe<JRangeDayData>>>;
  exercises: Array<Maybe<Exercise>>;
};

export type JRangeDayData = {
  __typename?: 'JRangeDayData';
  did?: Maybe<Array<Maybe<EBlock>>>;
  on?: Maybe<Scalars['YMD']>;
};

export type JeditorRow = JEditorBwTag | JEditorDayTag | JEditorEBlock | JEditorNewExercise | JEditorText;

export type LikeOnDm = IBy & IHasMessageId & IHasText & INotification & Ito & {
  __typename?: 'LikeOnDM';
  by: Scalars['ID'];
  id: Scalars['ID'];
  msgid: Scalars['ID'];
  text: Scalars['String'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
};

export type LikeOnJComment = IBy & IHasJOwner & IHasMessageId & IHasText & INotification & Ito & {
  __typename?: 'LikeOnJComment';
  by: Scalars['ID'];
  id: Scalars['ID'];
  jowner: Scalars['ID'];
  msgid: Scalars['ID'];
  text: Scalars['String'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
  ymd: Scalars['YMD'];
};

export type LikeOnLog = IBy & IHasJOwner & INotification & {
  __typename?: 'LikeOnLog';
  by: Scalars['ID'];
  id: Scalars['ID'];
  jowner: Scalars['ID'];
  when: Scalars['UTCDate'];
  ymd: Scalars['YMD'];
};

export enum MessageType {
  Dm = 'DM',
  Global = 'GLOBAL',
  Jcomment = 'JCOMMENT',
  Reply = 'REPLY'
}

export type MostVolume = BaseStat & {
  __typename?: 'MostVolume';
  bw?: Maybe<Weight>;
  by: Scalars['ID'];
  e: Scalars['ID'];
  totalReps: Scalars['Int'];
  w: Weight;
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['String']>;
  deleteMessage?: Maybe<Scalars['Boolean']>;
  deleteTweet?: Maybe<Scalars['Boolean']>;
  execBulkExercises?: Maybe<Scalars['Boolean']>;
  execExercise?: Maybe<ExecExerciseResponse>;
  follow?: Maybe<Scalars['Boolean']>;
  forgot: Scalars['Boolean'];
  likeJournalLog: Scalars['ID'];
  likeMessage: Scalars['ID'];
  login: Scalars['String'];
  loginWithFirebase: Scalars['String'];
  loginWithGoogle: Scalars['String'];
  saveJEditor?: Maybe<Scalars['Boolean']>;
  sendMessage?: Maybe<SendMessageResult>;
  sendVerificationCode?: Maybe<UserSetting>;
  setSetting?: Maybe<UserSetting>;
  setTweet?: Maybe<Scalars['Boolean']>;
  signup: Scalars['Boolean'];
  uploadAvatar: Scalars['String'];
  verifySignup: Scalars['String'];
};


export type MutationDeleteMessageArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteTweetArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationExecBulkExercisesArgs = {
  eids: Array<Scalars['ID']>;
  mode: BulkMode;
};


export type MutationExecExerciseArgs = {
  confirms?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};


export type MutationFollowArgs = {
  not?: InputMaybe<Scalars['Boolean']>;
  uid: Scalars['ID'];
};


export type MutationForgotArgs = {
  uore: Scalars['String'];
};


export type MutationLikeJournalLogArgs = {
  target: Scalars['ID'];
};


export type MutationLikeMessageArgs = {
  target: Scalars['ID'];
};


export type MutationLoginArgs = {
  p: Scalars['String'];
  u: Scalars['String'];
};


export type MutationLoginWithFirebaseArgs = {
  isf?: InputMaybe<Scalars['Int']>;
  token: Scalars['String'];
  uname?: InputMaybe<Scalars['String']>;
  usekg?: InputMaybe<Scalars['Int']>;
};


export type MutationLoginWithGoogleArgs = {
  isf?: InputMaybe<Scalars['Int']>;
  jwt: Scalars['String'];
  uname?: InputMaybe<Scalars['String']>;
  usekg?: InputMaybe<Scalars['Int']>;
};


export type MutationSaveJEditorArgs = {
  defaultDate: Scalars['YMD'];
  rows?: InputMaybe<Array<InputMaybe<Scalars['JEditorSaveRow']>>>;
};


export type MutationSendMessageArgs = {
  message: Scalars['String'];
  target: Scalars['ID'];
  type: MessageType;
};


export type MutationSendVerificationCodeArgs = {
  code: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationSetSettingArgs = {
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['SettingValue']>;
};


export type MutationSetTweetArgs = {
  id?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<TweetType>;
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  isf: Scalars['Int'];
  pass: Scalars['String'];
  uname: Scalars['String'];
  usekg: Scalars['Int'];
};


export type MutationUploadAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationVerifySignupArgs = {
  code: Scalars['String'];
};

export type Notification = Dm | JComment | LikeOnDm | LikeOnJComment | LikeOnLog | StartedFollowing | SystemNotification;

export type OfficialExercise = {
  __typename?: 'OfficialExercise';
  coolxbw?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  tag: Scalars['String'];
  variants: Array<Maybe<Scalars['String']>>;
};

export type Option = {
  __typename?: 'Option';
  i: Scalars['Int'];
  name: Scalars['String'];
};

export type OptionSetting = Setting & {
  __typename?: 'OptionSetting';
  i?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  options?: Maybe<Array<Maybe<Option>>>;
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Pr = {
  __typename?: 'PR';
  bw?: Maybe<Scalars['Float']>;
  lb: Scalars['Int'];
  r: Scalars['Int'];
  w: Scalars['Float'];
  when: Scalars['YMD'];
};

export type PrHistory = {
  __typename?: 'PRHistory';
  exercise: Exercise;
  prs?: Maybe<Array<Maybe<Pr>>>;
  setsOf?: Maybe<Array<Maybe<RepStat>>>;
  totalWorkouts: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  alsoposted?: Maybe<Array<Maybe<User>>>;
  communityStats?: Maybe<CommunityStats>;
  downloadLogs?: Maybe<JEditorData>;
  getAchievements?: Maybe<Array<Maybe<Achievement>>>;
  getAchievementsStateOf?: Maybe<Array<Maybe<AchievementState>>>;
  getActiveSupporters?: Maybe<Array<Maybe<Supporter>>>;
  getActivityFeed?: Maybe<Array<Maybe<UCard>>>;
  getAllPublicInteractionsInbox?: Maybe<Inbox>;
  getAnnouncements?: Maybe<Array<Maybe<SystemNotification>>>;
  getCalendarDays?: Maybe<Array<Maybe<Scalars['CalendarDayKey']>>>;
  getDate?: Maybe<Scalars['String']>;
  getExercises?: Maybe<Array<Maybe<ExerciseStat>>>;
  getFollowersCount: FollowersCount;
  getInbox?: Maybe<Inbox>;
  getLogInbox?: Maybe<Inbox>;
  getNotifications?: Maybe<Inbox>;
  getPRsOf?: Maybe<PrHistory>;
  getSession?: Maybe<SessionInfo>;
  getSupporters?: Maybe<Array<Maybe<Supporter>>>;
  getTwitterChallenges?: Maybe<Array<Maybe<TweetChallenge>>>;
  getTwitterChallengesStates?: Maybe<Array<Maybe<TweetState>>>;
  getUserSettings: Array<Maybe<UserSetting>>;
  getVideos?: Maybe<Array<Maybe<Video>>>;
  jday?: Maybe<JLog>;
  jeditor?: Maybe<JEditorData>;
  jrange?: Maybe<JRangeData>;
  officialExercises: Array<Maybe<OfficialExercise>>;
  sbdStats?: Maybe<SbdStats>;
  totalJournals: Scalars['Int'];
  userInfo: UserInfo;
};


export type QueryAlsopostedArgs = {
  ymd?: InputMaybe<Scalars['YMD']>;
};


export type QueryCommunityStatsArgs = {
  etype: Scalars['String'];
  gender?: InputMaybe<Gender>;
};


export type QueryGetAchievementsStateOfArgs = {
  asOfThisYMD: Scalars['YYYYMMDD'];
  uid: Scalars['ID'];
};


export type QueryGetActivityFeedArgs = {
  newerThan?: InputMaybe<Scalars['String']>;
  olderThan?: InputMaybe<Scalars['String']>;
  type: ActivityFeedType;
};


export type QueryGetAllPublicInteractionsInboxArgs = {
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
};


export type QueryGetAnnouncementsArgs = {
  limit: Scalars['Int'];
  olderThan?: InputMaybe<Scalars['UTCDate']>;
};


export type QueryGetCalendarDaysArgs = {
  from: Scalars['YYYYMMDD'];
  to: Scalars['YYYYMMDD'];
  uid: Scalars['ID'];
};


export type QueryGetExercisesArgs = {
  uid: Scalars['ID'];
};


export type QueryGetFollowersCountArgs = {
  has?: InputMaybe<Scalars['ID']>;
  uid: Scalars['ID'];
};


export type QueryGetInboxArgs = {
  dmsWithUID?: InputMaybe<Scalars['ID']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
};


export type QueryGetLogInboxArgs = {
  logid: Scalars['ID'];
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
};


export type QueryGetNotificationsArgs = {
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
};


export type QueryGetPRsOfArgs = {
  eid: Scalars['ID'];
  till?: InputMaybe<Scalars['YMD']>;
};


export type QueryJdayArgs = {
  uid: Scalars['ID'];
  ymd?: InputMaybe<Scalars['YMD']>;
};


export type QueryJeditorArgs = {
  range?: InputMaybe<Scalars['Int']>;
  ymd?: InputMaybe<Scalars['YMD']>;
};


export type QueryJrangeArgs = {
  range: Scalars['Int'];
  uid: Scalars['ID'];
  ymd: Scalars['YMD'];
};


export type QueryUserInfoArgs = {
  uname: Scalars['String'];
};

export type RpeSetting = Setting & {
  __typename?: 'RPESetting';
  defaults?: Maybe<Array<Maybe<Scalars['SettingValue']>>>;
  id: Scalars['ID'];
  overrides?: Maybe<Array<Maybe<Scalars['SettingValue']>>>;
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type RepStat = {
  __typename?: 'RepStat';
  count: Scalars['Int'];
  r: Scalars['Int'];
};

export enum Role {
  Admin = 'ADMIN',
  RegisteredUser = 'REGISTERED_USER'
}

export type SbdStat = {
  __typename?: 'SBDStat';
  graph?: Maybe<Array<Scalars['SBDSlot']>>;
  wclass: WeightClass;
};

export type SbdStats = {
  __typename?: 'SBDStats';
  date: Scalars['String'];
  perclass?: Maybe<Array<Maybe<SbdStat>>>;
  total: Scalars['Int'];
};

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  id: Scalars['ID'];
  inResponseTo?: Maybe<Scalars['ID']>;
  inResponseToMsg?: Maybe<Scalars['ID']>;
  msgid: Scalars['ID'];
  when: Scalars['UTCDate'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  time?: Maybe<Scalars['String']>;
  user: User;
};

export type Set = {
  __typename?: 'Set';
  c?: Maybe<Scalars['String']>;
  eff: Scalars['Float'];
  est1rm: Scalars['Float'];
  int: Scalars['Float'];
  lb: Scalars['Int'];
  pr?: Maybe<Scalars['Int']>;
  r: Scalars['Float'];
  rpe?: Maybe<Scalars['Float']>;
  s: Scalars['Float'];
  ubw?: Maybe<Scalars['Int']>;
  w: Scalars['Float'];
};

export type Setting = {
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type SocialMediasSetting = Setting & {
  __typename?: 'SocialMediasSetting';
  id: Scalars['ID'];
  links?: Maybe<Array<Maybe<Scalars['String']>>>;
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type StartedFollowing = IBy & INotification & Ito & {
  __typename?: 'StartedFollowing';
  by: Scalars['ID'];
  id: Scalars['ID'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
};

export type Supporter = {
  __typename?: 'Supporter';
  user: User;
  when?: Maybe<Scalars['String']>;
};

export type SupporterStatus = Setting & {
  __typename?: 'SupporterStatus';
  daysLeftAsActive: Scalars['Int'];
  id: Scalars['ID'];
  slvl: Scalars['Float'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type SystemNotification = IHasText & INotification & {
  __typename?: 'SystemNotification';
  id: Scalars['ID'];
  text: Scalars['String'];
  type?: Maybe<SystemNotificationType>;
  when: Scalars['UTCDate'];
};

export enum SystemNotificationType {
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

export type TweetChallenge = {
  __typename?: 'TweetChallenge';
  description: Scalars['String'];
  title: Scalars['String'];
  type: TweetType;
};

export type TweetState = {
  __typename?: 'TweetState';
  fecha: Scalars['UTCDate'];
  granted?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  tweet: Scalars['ID'];
  tweet_username?: Maybe<Scalars['String']>;
  type: TweetType;
};

export enum TweetType {
  AsDonation = 'AS_DONATION',
  AsDonation2 = 'AS_DONATION2'
}

export type UCard = {
  __typename?: 'UCard';
  andXmore?: Maybe<Scalars['Int']>;
  itemsLeftAfterThis?: Maybe<Scalars['Int']>;
  media?: Maybe<Scalars['String']>;
  posted?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  when?: Maybe<Scalars['String']>;
  workoutPreview?: Maybe<Array<Maybe<EblockPreview>>>;
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']>;
  avatarhash: Scalars['String'];
  bw?: Maybe<Scalars['Float']>;
  cc?: Maybe<Scalars['String']>;
  custom1RM?: Maybe<Scalars['Int']>;
  est1RMFactor?: Maybe<Scalars['Int']>;
  estimate1RMFormula?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isf?: Maybe<Scalars['Int']>;
  joined?: Maybe<Scalars['String']>;
  jranges?: Maybe<Array<Maybe<Scalars['Int']>>>;
  private?: Maybe<Scalars['Int']>;
  slvl?: Maybe<Scalars['Float']>;
  socialLinks?: Maybe<Array<Maybe<Scalars['String']>>>;
  sok?: Maybe<Scalars['Int']>;
  uname: Scalars['String'];
  usekg?: Maybe<Scalars['Int']>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  best3?: Maybe<Array<BestLift>>;
  daysLogged: Scalars['Int'];
  user: User;
};

export type UserSetting = BlockUsersSetting | CcSetting | Custom1RmFactorSetting | DobSetting | DeleteAccountSetting | EmailSetting | OptionSetting | RpeSetting | SocialMediasSetting | SupporterStatus | UsernameSetting | VoidSetting;

export type UsernameSetting = Setting & {
  __typename?: 'UsernameSetting';
  id: Scalars['ID'];
  uname: Scalars['String'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Video = {
  __typename?: 'Video';
  link: Scalars['String'];
  logid: Scalars['ID'];
  posted: Scalars['String'];
  user: User;
  when: Scalars['String'];
};

export type VoidSetting = Setting & {
  __typename?: 'VoidSetting';
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type Weight = {
  __typename?: 'Weight';
  lb: Scalars['Int'];
  v: Scalars['Float'];
};

export type WeightClass = {
  __typename?: 'WeightClass';
  male: Scalars['Boolean'];
  max: Scalars['Float'];
  min: Scalars['Float'];
  name: Scalars['String'];
};

export type GetAchievementsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAchievementsQuery = { __typename?: 'Query', getAchievements?: Array<{ __typename?: 'Achievement', id: string, description: string, name: string } | null> | null };

export type GetAchievementsStateOfQueryVariables = Exact<{
  uid: Scalars['ID'];
  asOfThisYmd: Scalars['YYYYMMDD'];
}>;


export type GetAchievementsStateOfQuery = { __typename?: 'Query', getAchievementsStateOf?: Array<{ __typename?: 'AchievementState', aid: string, gotit?: boolean | null, when?: any | null, note?: string | null } | null> | null };

type BaseFields_Estimated1Rm_Fragment = { __typename?: 'Estimated1RM', e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null };

type BaseFields_Heavyest_Fragment = { __typename?: 'Heavyest', e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null };

type BaseFields_MostVolume_Fragment = { __typename?: 'MostVolume', e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null };

export type BaseFieldsFragment = BaseFields_Estimated1Rm_Fragment | BaseFields_Heavyest_Fragment | BaseFields_MostVolume_Fragment;

export type GetOfficialExercisesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOfficialExercisesQuery = { __typename?: 'Query', officialExercises: Array<{ __typename?: 'OfficialExercise', id: string, tag: string, variants: Array<string | null>, coolxbw?: number | null } | null> };

export type GetSbdStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSbdStatsQuery = { __typename?: 'Query', sbdStats?: { __typename?: 'SBDStats', total: number, date: string, perclass?: Array<{ __typename?: 'SBDStat', graph?: Array<any> | null, wclass: { __typename?: 'WeightClass', name: string, max: number, min: number, male: boolean } } | null> | null } | null };

export type GetCommunityStatsQueryVariables = Exact<{
  etype: Scalars['String'];
}>;


export type GetCommunityStatsQuery = { __typename?: 'Query', communityStats?: { __typename?: 'CommunityStats', title: string, scanFrecuency: string, timestamp?: any | null, heavyest?: Array<{ __typename?: 'Heavyest', ymd: any, reps: number, e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null } | null> | null, estimated?: Array<{ __typename?: 'Estimated1RM', reps: number, ymd: any, e: string, by: string, originalw: { __typename?: 'Weight', lb: number, v: number }, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null } | null> | null, volume?: Array<{ __typename?: 'MostVolume', totalReps: number, e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null } | null> | null, exercises?: Array<{ __typename?: 'Exercise', id: string, type?: string | null, name: string } | null> | null, users?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null } | null> | null } | null };

export type GetExercisesQueryVariables = Exact<{
  uid: Scalars['ID'];
}>;


export type GetExercisesQuery = { __typename?: 'Query', getExercises?: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, type?: string | null, name: string } } | null> | null };

export type GetPRsOfQueryVariables = Exact<{
  eid: Scalars['ID'];
  till?: InputMaybe<Scalars['YMD']>;
}>;


export type GetPRsOfQuery = { __typename?: 'Query', getPRsOf?: { __typename?: 'PRHistory', totalWorkouts: number, exercise: { __typename?: 'Exercise', id: string, type?: string | null, name: string }, setsOf?: Array<{ __typename?: 'RepStat', r: number, count: number } | null> | null, prs?: Array<{ __typename?: 'PR', w: number, r: number, lb: number, when: any, bw?: number | null } | null> | null } | null };

export type ExecExerciseMutationVariables = Exact<{
  eid?: InputMaybe<Scalars['ID']>;
  ename?: InputMaybe<Scalars['String']>;
  confirms?: InputMaybe<Scalars['ID']>;
}>;


export type ExecExerciseMutation = { __typename?: 'Mutation', execExercise?: { __typename?: 'ConfirmAction', message: string, id: string } | { __typename?: 'Exercise', id: string, name: string, type?: string | null } | null };

export type ExecBulkExercisesMutationVariables = Exact<{
  eids: Array<Scalars['ID']> | Scalars['ID'];
  mode: BulkMode;
}>;


export type ExecBulkExercisesMutation = { __typename?: 'Mutation', execBulkExercises?: boolean | null };

export type GetFeedQueryVariables = Exact<{
  type: ActivityFeedType;
  olderThan?: InputMaybe<Scalars['String']>;
  newerThan?: InputMaybe<Scalars['String']>;
}>;


export type GetFeedQuery = { __typename?: 'Query', getActivityFeed?: Array<{ __typename?: 'UCard', when?: string | null, text?: string | null, andXmore?: number | null, posted?: string | null, media?: string | null, itemsLeftAfterThis?: number | null, user?: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null } | null, workoutPreview?: Array<{ __typename?: 'EblockPreview', r?: number | null, w?: number | null, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null> | null } | null> | null };

type NotificationFields_Dm_Fragment = { __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string, isGlobal?: boolean | null };

type NotificationFields_JComment_Fragment = { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string };

type NotificationFields_LikeOnDm_Fragment = { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string };

type NotificationFields_LikeOnJComment_Fragment = { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string };

type NotificationFields_LikeOnLog_Fragment = { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string };

type NotificationFields_StartedFollowing_Fragment = { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string };

type NotificationFields_SystemNotification_Fragment = { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null };

export type NotificationFieldsFragment = NotificationFields_Dm_Fragment | NotificationFields_JComment_Fragment | NotificationFields_LikeOnDm_Fragment | NotificationFields_LikeOnJComment_Fragment | NotificationFields_LikeOnLog_Fragment | NotificationFields_StartedFollowing_Fragment | NotificationFields_SystemNotification_Fragment;

export type GetInboxQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  dmsWithUID?: InputMaybe<Scalars['ID']>;
}>;


export type GetInboxQuery = { __typename?: 'Query', getInbox?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string, isGlobal?: boolean | null } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type GetNotificationsQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', getNotifications?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string, isGlobal?: boolean | null } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type GetAnnouncementsQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  limit: Scalars['Int'];
}>;


export type GetAnnouncementsQuery = { __typename?: 'Query', getAnnouncements?: Array<{ __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null } | null> | null };

export type GetUserInfoQueryVariables = Exact<{
  userInfoUname: Scalars['String'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', userInfo: { __typename?: 'UserInfo', daysLogged: number, user: { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: string | null, slvl?: number | null, sok?: number | null, age?: number | null, bw?: number | null, private?: number | null, isf?: number | null, joined?: string | null, usekg?: number | null, custom1RM?: number | null, est1RMFactor?: number | null, jranges?: Array<number | null> | null, estimate1RMFormula?: string | null, socialLinks?: Array<string | null> | null }, best3?: Array<{ __typename?: 'BestLift', w: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } }> | null } };

export type GetCalendarDaysQueryVariables = Exact<{
  uid: Scalars['ID'];
  from: Scalars['YYYYMMDD'];
  to: Scalars['YYYYMMDD'];
}>;


export type GetCalendarDaysQuery = { __typename?: 'Query', getCalendarDays?: Array<any | null> | null };

export type JDayQueryVariables = Exact<{
  uid: Scalars['ID'];
  ymd?: InputMaybe<Scalars['YMD']>;
}>;


export type JDayQuery = { __typename?: 'Query', jday?: { __typename?: 'JLog', id: string, log?: string | null, fromMobile?: boolean | null, bw?: number | null, eblocks?: Array<{ __typename?: 'EBlock', eid: string, sets: Array<{ __typename?: 'Set', w: number, r: number, s: number, lb: number, ubw?: number | null, c?: string | null, rpe?: number | null, pr?: number | null, est1rm: number, eff: number, int: number } | null> } | null> | null, exercises?: Array<{ __typename?: 'ERef', exercise: { __typename?: 'Exercise', id: string, name: string, type?: string | null }, best?: { __typename?: 'EBestStats', eff?: { __typename?: 'BestEStat', w: number, r: number, lb: number, when: any, bw?: number | null, est1rm?: number | null } | null, int: { __typename?: 'BestEStat', w: number, r: number, lb: number, when: any, bw?: number | null } } | null } | null> | null } | null };

export type AlsoPostedQueryVariables = Exact<{
  ymd?: InputMaybe<Scalars['YMD']>;
}>;


export type AlsoPostedQuery = { __typename?: 'Query', alsoposted?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null } | null> | null };

export type JeditorDataFieldsFragment = { __typename?: 'JEditorData', etags: Array<string | null>, baseBW?: number | null, exercises: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null>, did?: Array<{ __typename?: 'JEditorBWTag', bw?: number | null } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorEBlock', e?: number | null, sets?: Array<{ __typename?: 'JEditorEROW', usebw?: number | null, v?: number | null, c?: string | null, s?: number | null, r?: number | null, lb?: number | null, rpe?: number | null } | null> | null } | { __typename?: 'JEditorNewExercise' } | { __typename?: 'JEditorText', text?: string | null } | null> | null };

export type GetJRangeQueryVariables = Exact<{
  uid: Scalars['ID'];
  ymd: Scalars['YMD'];
  range: Scalars['Int'];
}>;


export type GetJRangeQuery = { __typename?: 'Query', jrange?: { __typename?: 'JRangeData', exercises: Array<{ __typename?: 'Exercise', id: string, name: string, type?: string | null } | null>, days?: Array<{ __typename?: 'JRangeDayData', on?: any | null, did?: Array<{ __typename?: 'EBlock', eid: string, sets: Array<{ __typename?: 'Set', w: number, r: number, s: number, lb: number, ubw?: number | null, c?: string | null, rpe?: number | null, pr?: number | null, est1rm: number, eff: number, int: number } | null> } | null> | null } | null> | null } | null };

export type GetJEditorDataQueryVariables = Exact<{
  ymd?: InputMaybe<Scalars['YMD']>;
  range?: InputMaybe<Scalars['Int']>;
}>;


export type GetJEditorDataQuery = { __typename?: 'Query', jeditor?: { __typename?: 'JEditorData', etags: Array<string | null>, baseBW?: number | null, exercises: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null>, did?: Array<{ __typename?: 'JEditorBWTag', bw?: number | null } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorEBlock', e?: number | null, sets?: Array<{ __typename?: 'JEditorEROW', usebw?: number | null, v?: number | null, c?: string | null, s?: number | null, r?: number | null, lb?: number | null, rpe?: number | null } | null> | null } | { __typename?: 'JEditorNewExercise' } | { __typename?: 'JEditorText', text?: string | null } | null> | null } | null };

export type SaveJEditorMutationVariables = Exact<{
  rows?: InputMaybe<Array<InputMaybe<Scalars['JEditorSaveRow']>> | InputMaybe<Scalars['JEditorSaveRow']>>;
  defaultDate: Scalars['YMD'];
}>;


export type SaveJEditorMutation = { __typename?: 'Mutation', saveJEditor?: boolean | null };

export type DownloadLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type DownloadLogsQuery = { __typename?: 'Query', downloadLogs?: { __typename?: 'JEditorData', etags: Array<string | null>, baseBW?: number | null, exercises: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null>, did?: Array<{ __typename?: 'JEditorBWTag', bw?: number | null } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorEBlock', e?: number | null, sets?: Array<{ __typename?: 'JEditorEROW', usebw?: number | null, v?: number | null, c?: string | null, s?: number | null, r?: number | null, lb?: number | null, rpe?: number | null } | null> | null } | { __typename?: 'JEditorNewExercise' } | { __typename?: 'JEditorText', text?: string | null } | null> | null } | null };

export type GetFollowersQueryVariables = Exact<{
  of: Scalars['ID'];
  has?: InputMaybe<Scalars['ID']>;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowersCount: { __typename?: 'FollowersCount', has?: boolean | null, total: number } };

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
  not?: InputMaybe<Scalars['Boolean']>;
}>;


export type FollowMutation = { __typename?: 'Mutation', follow?: boolean | null };

export type GetLogInboxQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  logid: Scalars['ID'];
}>;


export type GetLogInboxQuery = { __typename?: 'Query', getLogInbox?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type GetPublicInteractionsInboxQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
}>;


export type GetPublicInteractionsInboxQuery = { __typename?: 'Query', getAllPublicInteractionsInbox?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String'];
  type: MessageType;
  targetID: Scalars['ID'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage?: { __typename?: 'SendMessageResult', id: string, when: any, msgid: string } | null };

export type DeleteMessageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage?: boolean | null };

export type GetSessionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionQuery = { __typename?: 'Query', getSession?: { __typename?: 'SessionInfo', time?: string | null, user: { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: string | null, slvl?: number | null, sok?: number | null, age?: number | null, bw?: number | null, private?: number | null, isf?: number | null, joined?: string | null, usekg?: number | null, custom1RM?: number | null, est1RMFactor?: number | null, jranges?: Array<number | null> | null, estimate1RMFormula?: string | null, socialLinks?: Array<string | null> | null } } | null };

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
  uname?: InputMaybe<Scalars['String']>;
  isf?: InputMaybe<Scalars['Int']>;
  usekg?: InputMaybe<Scalars['Int']>;
}>;


export type LoginWithGoogleMutation = { __typename?: 'Mutation', loginWithGoogle: string };

export type LoginWithFirebaseMutationVariables = Exact<{
  token: Scalars['String'];
  uname?: InputMaybe<Scalars['String']>;
  isf?: InputMaybe<Scalars['Int']>;
  usekg?: InputMaybe<Scalars['Int']>;
}>;


export type LoginWithFirebaseMutation = { __typename?: 'Mutation', loginWithFirebase: string };

type SettingsFields_BlockUsersSetting_Fragment = { __typename?: 'BlockUsersSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_CcSetting_Fragment = { __typename?: 'CCSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_Custom1RmFactorSetting_Fragment = { __typename?: 'Custom1RMFactorSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_DobSetting_Fragment = { __typename?: 'DOBSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_DeleteAccountSetting_Fragment = { __typename?: 'DeleteAccountSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_EmailSetting_Fragment = { __typename?: 'EmailSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_OptionSetting_Fragment = { __typename?: 'OptionSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_RpeSetting_Fragment = { __typename?: 'RPESetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_SocialMediasSetting_Fragment = { __typename?: 'SocialMediasSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_SupporterStatus_Fragment = { __typename?: 'SupporterStatus', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_UsernameSetting_Fragment = { __typename?: 'UsernameSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_VoidSetting_Fragment = { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null };

export type SettingsFieldsFragment = SettingsFields_BlockUsersSetting_Fragment | SettingsFields_CcSetting_Fragment | SettingsFields_Custom1RmFactorSetting_Fragment | SettingsFields_DobSetting_Fragment | SettingsFields_DeleteAccountSetting_Fragment | SettingsFields_EmailSetting_Fragment | SettingsFields_OptionSetting_Fragment | SettingsFields_RpeSetting_Fragment | SettingsFields_SocialMediasSetting_Fragment | SettingsFields_SupporterStatus_Fragment | SettingsFields_UsernameSetting_Fragment | SettingsFields_VoidSetting_Fragment;

type SettingFields_BlockUsersSetting_Fragment = { __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_CcSetting_Fragment = { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null };

type SettingFields_Custom1RmFactorSetting_Fragment = { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_DobSetting_Fragment = { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_DeleteAccountSetting_Fragment = { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_EmailSetting_Fragment = { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_OptionSetting_Fragment = { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null };

type SettingFields_RpeSetting_Fragment = { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_SocialMediasSetting_Fragment = { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_SupporterStatus_Fragment = { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_UsernameSetting_Fragment = { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_VoidSetting_Fragment = { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null };

export type SettingFieldsFragment = SettingFields_BlockUsersSetting_Fragment | SettingFields_CcSetting_Fragment | SettingFields_Custom1RmFactorSetting_Fragment | SettingFields_DobSetting_Fragment | SettingFields_DeleteAccountSetting_Fragment | SettingFields_EmailSetting_Fragment | SettingFields_OptionSetting_Fragment | SettingFields_RpeSetting_Fragment | SettingFields_SocialMediasSetting_Fragment | SettingFields_SupporterStatus_Fragment | SettingFields_UsernameSetting_Fragment | SettingFields_VoidSetting_Fragment;

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'Query', getUserSettings: Array<{ __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null } | { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null } | null> };

export type SetSettingMutationVariables = Exact<{
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['SettingValue']>;
}>;


export type SetSettingMutation = { __typename?: 'Mutation', setSetting?: { __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null } | { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null } | null };

export type SendVerificatonCodeMutationVariables = Exact<{
  id: Scalars['ID'];
  code: Scalars['String'];
}>;


export type SendVerificatonCodeMutation = { __typename?: 'Mutation', sendVerificationCode?: { __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null } | { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null } | null };

export type GetSupportersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSupportersQuery = { __typename?: 'Query', getSupporters?: Array<{ __typename?: 'Supporter', when?: string | null, user: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null } } | null> | null };

export type GetActiveSupportersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveSupportersQuery = { __typename?: 'Query', getActiveSupporters?: Array<{ __typename?: 'Supporter', when?: string | null, user: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null } } | null> | null };

export type GetTwitterChallengesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwitterChallengesQuery = { __typename?: 'Query', getTwitterChallenges?: Array<{ __typename?: 'TweetChallenge', description: string, title: string, type: TweetType } | null> | null };

export type GetTwitterChallengesStatusesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwitterChallengesStatusesQuery = { __typename?: 'Query', getTwitterChallengesStates?: Array<{ __typename?: 'TweetState', fecha: any, granted?: boolean | null, status?: string | null, tweet: string, type: TweetType, tweet_username?: string | null } | null> | null };

export type SetTweetMutationVariables = Exact<{
  tweetID?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<TweetType>;
}>;


export type SetTweetMutation = { __typename?: 'Mutation', setTweet?: boolean | null };

export type DeleteTweetMutationVariables = Exact<{
  tweetID?: InputMaybe<Scalars['ID']>;
}>;


export type DeleteTweetMutation = { __typename?: 'Mutation', deleteTweet?: boolean | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: string | null, slvl?: number | null, sok?: number | null, age?: number | null, bw?: number | null, private?: number | null, isf?: number | null, joined?: string | null, usekg?: number | null, custom1RM?: number | null, est1RMFactor?: number | null, jranges?: Array<number | null> | null, estimate1RMFormula?: string | null, socialLinks?: Array<string | null> | null };

export type BriefUserFieldsFragment = { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null };

export type GetVideosQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVideosQuery = { __typename?: 'Query', getVideos?: Array<{ __typename?: 'Video', when: string, posted: string, logid: string, link: string, user: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null } } | null> | null };

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
export const NotificationFieldsFragmentDoc = gql`
    fragment NotificationFields on Notification {
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
  ... on DM {
    isGlobal
  }
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
      ...NotificationFields
    }
  }
}
    ${BriefUserFieldsFragmentDoc}
${NotificationFieldsFragmentDoc}`;

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
export const GetNotificationsDocument = gql`
    query GetNotifications($olderThan: UTCDate, $newerThan: UTCDate) {
  getNotifications(olderThan: $olderThan, newerThan: $newerThan) {
    referencedUsers {
      ...BriefUserFields
    }
    notifications {
      ...NotificationFields
    }
  }
}
    ${BriefUserFieldsFragmentDoc}
${NotificationFieldsFragmentDoc}`;

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *      olderThan: // value for 'olderThan'
 *      newerThan: // value for 'newerThan'
 *   },
 * });
 */
export function useGetNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
      }
export function useGetNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options);
        }
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>;
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>;
export type GetNotificationsQueryResult = Apollo.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>;
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
export const GetTwitterChallengesDocument = gql`
    query GetTwitterChallenges {
  getTwitterChallenges {
    description
    title
    type
  }
}
    `;

/**
 * __useGetTwitterChallengesQuery__
 *
 * To run a query within a React component, call `useGetTwitterChallengesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTwitterChallengesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTwitterChallengesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTwitterChallengesQuery(baseOptions?: Apollo.QueryHookOptions<GetTwitterChallengesQuery, GetTwitterChallengesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTwitterChallengesQuery, GetTwitterChallengesQueryVariables>(GetTwitterChallengesDocument, options);
      }
export function useGetTwitterChallengesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTwitterChallengesQuery, GetTwitterChallengesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTwitterChallengesQuery, GetTwitterChallengesQueryVariables>(GetTwitterChallengesDocument, options);
        }
export type GetTwitterChallengesQueryHookResult = ReturnType<typeof useGetTwitterChallengesQuery>;
export type GetTwitterChallengesLazyQueryHookResult = ReturnType<typeof useGetTwitterChallengesLazyQuery>;
export type GetTwitterChallengesQueryResult = Apollo.QueryResult<GetTwitterChallengesQuery, GetTwitterChallengesQueryVariables>;
export const GetTwitterChallengesStatusesDocument = gql`
    query GetTwitterChallengesStatuses {
  getTwitterChallengesStates {
    fecha
    granted
    status
    tweet
    type
    tweet_username
  }
}
    `;

/**
 * __useGetTwitterChallengesStatusesQuery__
 *
 * To run a query within a React component, call `useGetTwitterChallengesStatusesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTwitterChallengesStatusesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTwitterChallengesStatusesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTwitterChallengesStatusesQuery(baseOptions?: Apollo.QueryHookOptions<GetTwitterChallengesStatusesQuery, GetTwitterChallengesStatusesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTwitterChallengesStatusesQuery, GetTwitterChallengesStatusesQueryVariables>(GetTwitterChallengesStatusesDocument, options);
      }
export function useGetTwitterChallengesStatusesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTwitterChallengesStatusesQuery, GetTwitterChallengesStatusesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTwitterChallengesStatusesQuery, GetTwitterChallengesStatusesQueryVariables>(GetTwitterChallengesStatusesDocument, options);
        }
export type GetTwitterChallengesStatusesQueryHookResult = ReturnType<typeof useGetTwitterChallengesStatusesQuery>;
export type GetTwitterChallengesStatusesLazyQueryHookResult = ReturnType<typeof useGetTwitterChallengesStatusesLazyQuery>;
export type GetTwitterChallengesStatusesQueryResult = Apollo.QueryResult<GetTwitterChallengesStatusesQuery, GetTwitterChallengesStatusesQueryVariables>;
export const SetTweetDocument = gql`
    mutation SetTweet($tweetID: ID, $type: TweetType) {
  setTweet(id: $tweetID, type: $type)
}
    `;
export type SetTweetMutationFn = Apollo.MutationFunction<SetTweetMutation, SetTweetMutationVariables>;

/**
 * __useSetTweetMutation__
 *
 * To run a mutation, you first call `useSetTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTweetMutation, { data, loading, error }] = useSetTweetMutation({
 *   variables: {
 *      tweetID: // value for 'tweetID'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSetTweetMutation(baseOptions?: Apollo.MutationHookOptions<SetTweetMutation, SetTweetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTweetMutation, SetTweetMutationVariables>(SetTweetDocument, options);
      }
export type SetTweetMutationHookResult = ReturnType<typeof useSetTweetMutation>;
export type SetTweetMutationResult = Apollo.MutationResult<SetTweetMutation>;
export type SetTweetMutationOptions = Apollo.BaseMutationOptions<SetTweetMutation, SetTweetMutationVariables>;
export const DeleteTweetDocument = gql`
    mutation DeleteTweet($tweetID: ID) {
  deleteTweet(id: $tweetID)
}
    `;
export type DeleteTweetMutationFn = Apollo.MutationFunction<DeleteTweetMutation, DeleteTweetMutationVariables>;

/**
 * __useDeleteTweetMutation__
 *
 * To run a mutation, you first call `useDeleteTweetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTweetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTweetMutation, { data, loading, error }] = useDeleteTweetMutation({
 *   variables: {
 *      tweetID: // value for 'tweetID'
 *   },
 * });
 */
export function useDeleteTweetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTweetMutation, DeleteTweetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTweetMutation, DeleteTweetMutationVariables>(DeleteTweetDocument, options);
      }
export type DeleteTweetMutationHookResult = ReturnType<typeof useDeleteTweetMutation>;
export type DeleteTweetMutationResult = Apollo.MutationResult<DeleteTweetMutation>;
export type DeleteTweetMutationOptions = Apollo.BaseMutationOptions<DeleteTweetMutation, DeleteTweetMutationVariables>;
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