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
  OauthReplacementType: any;
  SBDSlot: any;
  SettingValue: any;
  UTCDate: any;
  Upload: any;
  YMD: any;
  YYYYMMDD: any;
};

/** A generic thing that was achieved.  */
export type Achievement = {
  __typename?: 'Achievement';
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Represents the state of an achievement for a particular user.  */
export type AchievementState = {
  __typename?: 'AchievementState';
  /** ID of the achievement */
  aid: Scalars['ID'];
  /** If it was achieved or not */
  gotit?: Maybe<Scalars['Boolean']>;
  /** Details particular to this specific achievement */
  note?: Maybe<Scalars['String']>;
  when?: Maybe<Scalars['YYYYMMDD']>;
};

export enum ActivityFeedType {
  /** Only jorunals that the currently logged user is following */
  Following = 'following',
  /** Every public journal */
  Global = 'global'
}

export type BaseStat = {
  bw?: Maybe<Weight>;
  /** If of the user that did this... */
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

export type BestWxDorT = {
  __typename?: 'BestWxDorT';
  maxDistance?: Maybe<UnitValueWhen>;
  maxForce?: Maybe<UnitValueWhen>;
  maxTime?: Maybe<UnitValueWhen>;
  minDistance?: Maybe<UnitValueWhen>;
  minTime?: Maybe<UnitValueWhen>;
  topSpeed?: Maybe<UnitValueWhen>;
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

/** Country code : ISO 3166-1 alpha-2 ( 2 letters ) */
export type Cc = {
  __typename?: 'CC';
  /** country code */
  cc: Scalars['ID'];
  /** Name of the country */
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

/** A message that the user should read before an action will execute. */
export type ConfirmAction = {
  __typename?: 'ConfirmAction';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type ConnectedService = {
  __typename?: 'ConnectedService';
  id: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['String'];
};

export type ConnectedServicesSetting = Setting & {
  __typename?: 'ConnectedServicesSetting';
  connections?: Maybe<Array<ConnectedService>>;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
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

export type DevConfigChanges = {
  __typename?: 'DevConfigChanges';
  changelog?: Maybe<Scalars['String']>;
  hash: Scalars['ID'];
};

export type DeveloperConfig = {
  __typename?: 'DeveloperConfig';
  confirmChanges?: Maybe<DevConfigChanges>;
  services?: Maybe<Array<DeveloperService>>;
};

export type DeveloperConfigSetting = Setting & {
  __typename?: 'DeveloperConfigSetting';
  config: DeveloperConfig;
  id: Scalars['ID'];
  waitingCodeToChange?: Maybe<Scalars['Boolean']>;
};

export type DeveloperService = {
  __typename?: 'DeveloperService';
  dbid?: Maybe<Scalars['ID']>;
  id: Scalars['String'];
  name: Scalars['String'];
  redirectUris: Array<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type EBestStats = {
  __typename?: 'EBestStats';
  eff?: Maybe<BestEStat>;
  int?: Maybe<BestEStat>;
  prsWxDorT?: Maybe<BestWxDorT>;
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

/** Represents the preview of the workout done with this exercise */
export type EblockPreview = {
  __typename?: 'EblockPreview';
  /** The exercise used */
  e: Exercise;
  /** Reps done with that max weight */
  r?: Maybe<Scalars['Int']>;
  /** The max weight used */
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
  /** If of the user that did this... */
  by: Scalars['ID'];
  e: Scalars['ID'];
  /** Original weight used in the set that resulted in this estimated 1RM. */
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
  /** If it is an "official" exercise, this is the TAG.  */
  type?: Maybe<Scalars['String']>;
};

/** Total days and reps done by this exercise */
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

export type ForumLike = IBy & IForum & IHasJOwner & IHasText & INotification & Ito & {
  __typename?: 'ForumLike';
  by: Scalars['ID'];
  dislike?: Maybe<Scalars['Boolean']>;
  forumSlug: Scalars['String'];
  id: Scalars['ID'];
  jowner: Scalars['ID'];
  postId: Scalars['ID'];
  text: Scalars['String'];
  threadId: Scalars['ID'];
  threadSlug: Scalars['String'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
  ymd: Scalars['YMD'];
};

export type ForumMessage = {
  __typename?: 'ForumMessage';
  dislikes?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  likes?: Maybe<Scalars['Int']>;
  message: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['ID']>;
  replies?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['ID']>;
  threadId?: Maybe<Scalars['ID']>;
  user: Scalars['ID'];
  when: Scalars['UTCDate'];
};

export type ForumNotification = IBy & IForum & IHasJOwner & IHasText & INotification & Ito & {
  __typename?: 'ForumNotification';
  by: Scalars['ID'];
  forumSlug: Scalars['String'];
  id: Scalars['ID'];
  isMention?: Maybe<Scalars['Boolean']>;
  jowner: Scalars['ID'];
  postId: Scalars['ID'];
  text: Scalars['String'];
  threadId: Scalars['ID'];
  threadSlug: Scalars['String'];
  to: Scalars['ID'];
  when: Scalars['UTCDate'];
  ymd: Scalars['YMD'];
};

export type ForumRole = {
  __typename?: 'ForumRole';
  /** Can do ALL, meaning, everything. Setting this to true will ignore the "can" */
  all?: Maybe<Scalars['Boolean']>;
  /** ID of the action that it can do... */
  can?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export enum ForumRoleKey {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  Noter = 'NOTER'
}

export type ForumSection = {
  __typename?: 'ForumSection';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  replies?: Maybe<Scalars['Int']>;
  slug: Scalars['String'];
  threads?: Maybe<Scalars['Int']>;
};

export type ForumStatus = {
  __typename?: 'ForumStatus';
  posts?: Maybe<Scalars['Int']>;
  role?: Maybe<ForumRole>;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type Heavyest = BaseStat & {
  __typename?: 'Heavyest';
  bw?: Maybe<Weight>;
  /** If of the user that did this... */
  by: Scalars['ID'];
  e: Scalars['ID'];
  reps: Scalars['Int'];
  w: Weight;
  ymd: Scalars['YMD'];
};

export type IBy = {
  by: Scalars['ID'];
};

export type IForum = {
  forumSlug: Scalars['String'];
  threadId: Scalars['ID'];
  threadSlug: Scalars['String'];
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
  utags?: Maybe<Array<Maybe<UTag>>>;
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
  d?: Maybe<Scalars['Int']>;
  dunit?: Maybe<Scalars['String']>;
  lb?: Maybe<Scalars['Int']>;
  r?: Maybe<Scalars['Int']>;
  rpe?: Maybe<Scalars['Float']>;
  s?: Maybe<Scalars['Int']>;
  t?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
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

export type JEditorUTag = {
  __typename?: 'JEditorUTag';
  tag?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type JLog = {
  __typename?: 'JLog';
  bw?: Maybe<Scalars['Float']>;
  eblocks?: Maybe<Array<Maybe<EBlock>>>;
  exercises?: Maybe<Array<Maybe<ERef>>>;
  fromMobile?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  log?: Maybe<Scalars['String']>;
  utags?: Maybe<Array<Maybe<UTag>>>;
  utagsValues?: Maybe<Array<Maybe<UTagValue>>>;
};

export type JRangeData = {
  __typename?: 'JRangeData';
  days?: Maybe<Array<Maybe<JRangeDayData>>>;
  exercises: Array<Maybe<Exercise>>;
  from?: Maybe<Scalars['YMD']>;
  to?: Maybe<Scalars['YMD']>;
  utags?: Maybe<UTagsUsed>;
};

export type JRangeDayData = {
  __typename?: 'JRangeDayData';
  did?: Maybe<Array<Maybe<EBlock>>>;
  on?: Maybe<Scalars['YMD']>;
};

export type JeditorRow = JEditorBwTag | JEditorDayTag | JEditorEBlock | JEditorNewExercise | JEditorText | UTagValue;

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

export type Messages = {
  __typename?: 'Messages';
  messages?: Maybe<Array<Maybe<ForumMessage>>>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type MostVolume = BaseStat & {
  __typename?: 'MostVolume';
  bw?: Maybe<Weight>;
  /** If of the user that did this... */
  by: Scalars['ID'];
  e: Scalars['ID'];
  totalReps: Scalars['Int'];
  w: Weight;
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['String']>;
  /** Removes the avatar from the currently logged in user. */
  deleteAvatar?: Maybe<Scalars['Boolean']>;
  deleteForumMessage?: Maybe<Scalars['Boolean']>;
  deleteMessage?: Maybe<Scalars['Boolean']>;
  deleteTweet?: Maybe<Scalars['Boolean']>;
  dislikeForumMessage: Scalars['ID'];
  execBulkExercises?: Maybe<Scalars['Boolean']>;
  execExercise?: Maybe<ExecExerciseResponse>;
  follow?: Maybe<Scalars['Boolean']>;
  forgot: Scalars['Boolean'];
  likeForumMessage: Scalars['ID'];
  likeJournalLog: Scalars['ID'];
  likeMessage: Scalars['ID'];
  login: Scalars['String'];
  loginWithFirebase: Scalars['String'];
  loginWithGoogle: Scalars['String'];
  postForumMessage?: Maybe<Scalars['ID']>;
  /** Save a journal post */
  saveJEditor?: Maybe<Scalars['Boolean']>;
  sendMessage?: Maybe<SendMessageResult>;
  /** Some settings, when changed, send a code to the user's email, then that code has to be used here to confirm the change of the setting. */
  sendVerificationCode?: Maybe<UserSetting>;
  setForumPostNote?: Maybe<Scalars['Boolean']>;
  /** Used to set the value of a setting for the currenlty logged in user. */
  setSetting?: Maybe<UserSetting>;
  setTweet?: Maybe<Scalars['Boolean']>;
  signup: Scalars['Boolean'];
  /** When the system sends an email, it provides a link at the bottom to unsub from recieving emails. That code is passed to this mutation to identify the user and remove the subscription. */
  unsubFromEmails?: Maybe<Scalars['Boolean']>;
  /** Uploads an image to be used as the avatar for the currently logged in user. */
  uploadAvatar: Scalars['String'];
  /** When a signup is made, a code is sent to the email. That code is then used here and the return will be a `session token` */
  verifySignup: Scalars['String'];
};


export type MutationDeleteForumMessageArgs = {
  id?: InputMaybe<Scalars['ID']>;
  why?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteMessageArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteTweetArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationDislikeForumMessageArgs = {
  target: Scalars['ID'];
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


export type MutationLikeForumMessageArgs = {
  target: Scalars['ID'];
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


export type MutationPostForumMessageArgs = {
  message: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
  sectionId: Scalars['ID'];
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


export type MutationSetForumPostNoteArgs = {
  messageId: Scalars['ID'];
  note: Scalars['String'];
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


export type MutationUnsubFromEmailsArgs = {
  token?: InputMaybe<Scalars['String']>;
};


export type MutationUploadAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationVerifySignupArgs = {
  code: Scalars['String'];
};

export type Notification = Dm | ForumLike | ForumNotification | JComment | LikeOnDm | LikeOnJComment | LikeOnLog | StartedFollowing | SystemNotification;

export enum OAuthAction {
  Error = 'ERROR',
  Replace = 'REPLACE'
}

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
  /** how much weight was added to the bodyweight (if any) */
  a2bw?: Maybe<Scalars['Float']>;
  bw?: Maybe<Scalars['Float']>;
  lb: Scalars['Int'];
  r: Scalars['Int'];
  w: Scalars['Float'];
  when: Scalars['YMD'];
};

/** Personal records of this particular exercise and stats */
export type PrHistory = {
  __typename?: 'PRHistory';
  exercise: Exercise;
  prs?: Maybe<Array<Maybe<Pr>>>;
  /** How many sets of X reps were performed by this exercise? (Like... how many singles or triples) */
  setsOf?: Maybe<Array<Maybe<RepStat>>>;
  totalWorkouts: Scalars['Int'];
  /** Records related to Weight for Distance or Time. This feature was added later that's why it is separated like this. */
  wxdotPRS?: Maybe<WxDotpRs>;
};

export type Query = {
  __typename?: 'Query';
  /** Who else posted on this date? */
  alsoposted?: Maybe<Array<Maybe<User>>>;
  communityStats?: Maybe<CommunityStats>;
  /** Downloads the current user logs */
  downloadLogs?: Maybe<JEditorData>;
  /** Returns all the available achievements that the system recognizes/has. */
  getAchievements?: Maybe<Array<Maybe<Achievement>>>;
  /** Returns all the achievements that this user has up to that particular date. */
  getAchievementsStateOf?: Maybe<Array<Maybe<AchievementState>>>;
  getActiveSupporters?: Maybe<Array<Maybe<Supporter>>>;
  /** Returns the activity of the users that fall in the context of `type`  */
  getActivityFeed?: Maybe<Array<Maybe<UCard>>>;
  getAllPublicInteractionsInbox?: Maybe<Inbox>;
  getAnnouncements?: Maybe<Array<Maybe<SystemNotification>>>;
  /** Returns the info to be used by the calendar UI to show the dates */
  getCalendarDays?: Maybe<Array<Maybe<Scalars['CalendarDayKey']>>>;
  getDate?: Maybe<Scalars['String']>;
  /** Get all the exercises of this user id (uid) */
  getExercises?: Maybe<Array<Maybe<ExerciseStat>>>;
  getFollowers?: Maybe<Array<Maybe<User>>>;
  getFollowersCount: FollowersCount;
  getFollowing?: Maybe<Array<Maybe<User>>>;
  getForumMessages?: Maybe<Messages>;
  getForumPostIndex: Scalars['Int'];
  getForumRolesDescription?: Maybe<Array<Maybe<RoleDescriptor>>>;
  getForumSections?: Maybe<Array<Maybe<ForumSection>>>;
  getInbox?: Maybe<Inbox>;
  getLogInbox?: Maybe<Inbox>;
  getNotifications?: Maybe<Inbox>;
  /** Get all personal record of this exercise */
  getPRsOf?: Maybe<PrHistory>;
  getSession?: Maybe<SessionInfo>;
  getSupporters?: Maybe<Array<Maybe<Supporter>>>;
  getThreadMessages?: Maybe<Messages>;
  getTwitterChallenges?: Maybe<Array<Maybe<TweetChallenge>>>;
  getTwitterChallengesStates?: Maybe<Array<Maybe<TweetState>>>;
  getUserSettings: Array<Maybe<UserSetting>>;
  getVideos?: Maybe<Array<Maybe<Video>>>;
  /** Data for the "year overview" widget. The mini calendar that shows an entire year and the number represent a score based on how much volume was done. */
  getYearOverview?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Years logged by the user. */
  getYearsLogged?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Get the jorunal data for a particular day */
  jday?: Maybe<JLog>;
  /**
   * Returs the data for the editor for the current user (the widget that is used to edit a workout)
   * Params work similar to `jrange`
   */
  jeditor?: Maybe<JEditorData>;
  /** Get the range data between a date `ymd` - `range * 7` and `ymd` */
  jrange?: Maybe<JRangeData>;
  officialExercises: Array<Maybe<OfficialExercise>>;
  sbdStats?: Maybe<SbdStats>;
  search?: Maybe<SearchResults>;
  totalJournals: Scalars['Int'];
  userBasicInfo?: Maybe<Array<User>>;
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
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
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


export type QueryGetFollowersArgs = {
  uid: Scalars['ID'];
};


export type QueryGetFollowersCountArgs = {
  has?: InputMaybe<Scalars['ID']>;
  uid: Scalars['ID'];
};


export type QueryGetFollowingArgs = {
  uid: Scalars['ID'];
};


export type QueryGetForumMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  sectionId?: InputMaybe<Scalars['ID']>;
};


export type QueryGetForumPostIndexArgs = {
  postId: Scalars['ID'];
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


export type QueryGetThreadMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  messageId?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryGetVideosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
};


export type QueryGetYearOverviewArgs = {
  uid: Scalars['ID'];
  year: Scalars['Int'];
};


export type QueryGetYearsLoggedArgs = {
  uid: Scalars['ID'];
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


export type QuerySearchArgs = {
  page?: InputMaybe<Scalars['Int']>;
  query: Scalars['String'];
};


export type QueryUserBasicInfoArgs = {
  of?: InputMaybe<Scalars['ID']>;
  ofThese?: InputMaybe<Array<Scalars['ID']>>;
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

/** How many sets were done of this many reps. */
export type RepStat = {
  __typename?: 'RepStat';
  /** Total sets done using this rep range. */
  count: Scalars['Int'];
  r: Scalars['Int'];
};

export enum Role {
  Admin = 'ADMIN',
  RegisteredUser = 'REGISTERED_USER'
}

export type RoleDescriptor = {
  __typename?: 'RoleDescriptor';
  description: Scalars['String'];
  key: Scalars['ID'];
  title: Scalars['String'];
};

export type SbdStat = {
  __typename?: 'SBDStat';
  graph?: Maybe<Array<Scalars['SBDSlot']>>;
  graphAge?: Maybe<Array<Maybe<Scalars['SBDSlot']>>>;
  wclass: WeightClass;
};

export type SbdStats = {
  __typename?: 'SBDStats';
  ageClasses?: Maybe<Array<Maybe<Scalars['String']>>>;
  date: Scalars['String'];
  perclass?: Maybe<Array<Maybe<SbdStat>>>;
  total: Scalars['Int'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  exercise: Scalars['ID'];
  inlbs: Scalars['Boolean'];
  reps: Scalars['Int'];
  sets: Scalars['Int'];
  user: Scalars['ID'];
  weight: Scalars['Float'];
  ymd: Scalars['YMD'];
};

export type SearchResults = {
  __typename?: 'SearchResults';
  page: Scalars['Int'];
  referencedExercises?: Maybe<Array<Exercise>>;
  referencedUsers?: Maybe<Array<User>>;
  results?: Maybe<Array<SearchResult>>;
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
  forum?: Maybe<ForumStatus>;
  time?: Maybe<Scalars['String']>;
  user: User;
};

export type Set = {
  __typename?: 'Set';
  c?: Maybe<Scalars['String']>;
  d?: Maybe<Scalars['Int']>;
  dunit?: Maybe<Scalars['String']>;
  eff?: Maybe<Scalars['Float']>;
  est1rm?: Maybe<Scalars['Float']>;
  force?: Maybe<Scalars['Float']>;
  int?: Maybe<Scalars['Float']>;
  lb?: Maybe<Scalars['Int']>;
  pr?: Maybe<Scalars['Int']>;
  r?: Maybe<Scalars['Float']>;
  rpe?: Maybe<Scalars['Float']>;
  s?: Maybe<Scalars['Float']>;
  speed?: Maybe<Scalars['Float']>;
  t?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['Int']>;
  ubw?: Maybe<Scalars['Int']>;
  w?: Maybe<Scalars['Float']>;
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
  type: TweetType;
};

export enum TweetType {
  AsDonation = 'AS_DONATION',
  AsDonation2 = 'AS_DONATION2'
}

/** Represent a journal post's minimal data to show the user what it was done. A brief detail of the log. */
export type UCard = {
  __typename?: 'UCard';
  andXmore?: Maybe<Scalars['Int']>;
  itemsLeftAfterThis?: Maybe<Scalars['Int']>;
  media?: Maybe<Scalars['String']>;
  posted?: Maybe<Scalars['YMD']>;
  text?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  utags?: Maybe<UTagsUsed>;
  when?: Maybe<Scalars['UTCDate']>;
  workoutPreview?: Maybe<Array<Maybe<EblockPreview>>>;
};

export type UTag = {
  __typename?: 'UTag';
  automatic?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type UTagValue = {
  __typename?: 'UTagValue';
  id?: Maybe<Scalars['ID']>;
  logid?: Maybe<Scalars['ID']>;
  tagid: Scalars['ID'];
  type: Scalars['String'];
  value: Scalars['String'];
  ymd?: Maybe<Scalars['YMD']>;
};

export type UTagsUsed = {
  __typename?: 'UTagsUsed';
  tags?: Maybe<Array<Maybe<UTag>>>;
  values?: Maybe<Array<Maybe<UTagValue>>>;
};

export type UnitValueWhen = {
  __typename?: 'UnitValueWhen';
  unit: Scalars['String'];
  val: Scalars['Float'];
  when: Scalars['YMD'];
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']>;
  /** Hash to add to the avatar url... */
  avatarhash: Scalars['String'];
  bw?: Maybe<Scalars['Float']>;
  /** Country code */
  cc?: Maybe<Scalars['String']>;
  /**
   *    Custom `factor` for the 1RM formula. Which is:
   * ```r>10? 0 : Math.min(9999, w * ( (factor || 46) / (((factor || 46)+1)-r) ) ) ```
   */
  custom1RM?: Maybe<Scalars['Int']>;
  email?: Maybe<Scalars['String']>;
  /** See above, but this is the system's DEFAULT value. */
  est1RMFactor?: Maybe<Scalars['Int']>;
  /** Javascript version of the 1RM forumyla to be used by the frontend using `eval(estimate1RMFormula)` */
  estimate1RMFormula?: Maybe<Scalars['String']>;
  /**
   * ```txt
   * 1 = Responsable for administrating the forum
   * 2 = Responsable for moderating the posts in the forum, can delete or attach notes to posts.
   * 3 = Can attach notes to posts to complement or dispute information.
   * ```
   */
  forumRole?: Maybe<ForumRoleKey>;
  id: Scalars['ID'];
  /** Is Female? 0 | 1 */
  isf?: Maybe<Scalars['Int']>;
  joined?: Maybe<Scalars['String']>;
  /** Ranges that the calendar's zoom UI has available. Used by the caldendar widget. */
  jranges?: Maybe<Array<Maybe<Scalars['Int']>>>;
  private?: Maybe<Scalars['Int']>;
  /** Days left as active supporter */
  sleft?: Maybe<Scalars['Int']>;
  /** Supporter Level */
  slvl?: Maybe<Scalars['Float']>;
  /** URLs of social media or whatever... */
  socialLinks?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Active supporter? 1 = true */
  sok?: Maybe<Scalars['Int']>;
  /** Username */
  uname: Scalars['String'];
  /** Prefered weight unit. 1= Uses Kilograms. 0=Uses Pounds */
  usekg?: Maybe<Scalars['Int']>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  best3?: Maybe<Array<BestLift>>;
  daysLogged: Scalars['Int'];
  forum?: Maybe<ForumStatus>;
  user: User;
};

export type UserSetting = BlockUsersSetting | CcSetting | ConnectedServicesSetting | Custom1RmFactorSetting | DobSetting | DeleteAccountSetting | DeveloperConfigSetting | EmailSetting | OptionSetting | RpeSetting | SocialMediasSetting | SupporterStatus | UsernameSetting | VoidSetting;

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
  /** 1 = If the weight is meant to be displayed as pounds. */
  lb: Scalars['Int'];
  /** Value of the weight (in kilograms) */
  v: Scalars['Float'];
};

export type WeightClass = {
  __typename?: 'WeightClass';
  male: Scalars['Boolean'];
  max: Scalars['Float'];
  min: Scalars['Float'];
  name: Scalars['String'];
};

/** Records related to using (W)eight for (D)istance (O)r (T)ime.  */
export type WxDotpRs = {
  __typename?: 'WxDOTPRs';
  /** Distance for time PRs. (Ex: goal is either increase or decrease distance over time) */
  DxTPR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Weight for distance PRs */
  WxD_PRs?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Weight for time PRs */
  WxT_PRs?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** Links `y = erows[i]` --> `ymds[y]` so you know when the erow was done.  */
  erowi2ymdi?: Maybe<Array<Maybe<Scalars['Int']>>>;
  erows?: Maybe<Array<Maybe<Set>>>;
  maxDistancePR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  maxForcePR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  maxTimePR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  minDistancePR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  minTimePR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  speedPR?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ymds?: Maybe<Array<Maybe<Scalars['YMD']>>>;
};

/** Weight for Distance PR */
export type WxDpr = {
  __typename?: 'WxDPR';
  /** Weight added to the user's bodyweight */
  a2bw?: Maybe<Scalars['Float']>;
  d: Scalars['Float'];
  dunit: Scalars['String'];
  lb?: Maybe<Scalars['Int']>;
  t?: Maybe<Scalars['Float']>;
  w?: Maybe<Scalars['Float']>;
  when: Scalars['YMD'];
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


export type GetSbdStatsQuery = { __typename?: 'Query', sbdStats?: { __typename?: 'SBDStats', total: number, date: string, ageClasses?: Array<string | null> | null, perclass?: Array<{ __typename?: 'SBDStat', graph?: Array<any> | null, graphAge?: Array<any | null> | null, wclass: { __typename?: 'WeightClass', name: string, max: number, min: number, male: boolean } } | null> | null } | null };

export type GetCommunityStatsQueryVariables = Exact<{
  etype: Scalars['String'];
}>;


export type GetCommunityStatsQuery = { __typename?: 'Query', communityStats?: { __typename?: 'CommunityStats', title: string, scanFrecuency: string, timestamp?: any | null, heavyest?: Array<{ __typename?: 'Heavyest', ymd: any, reps: number, e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null } | null> | null, estimated?: Array<{ __typename?: 'Estimated1RM', reps: number, ymd: any, e: string, by: string, originalw: { __typename?: 'Weight', lb: number, v: number }, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null } | null> | null, volume?: Array<{ __typename?: 'MostVolume', totalReps: number, e: string, by: string, w: { __typename?: 'Weight', v: number, lb: number }, bw?: { __typename?: 'Weight', v: number, lb: number } | null } | null> | null, exercises?: Array<{ __typename?: 'Exercise', id: string, type?: string | null, name: string } | null> | null, users?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null } | null };

export type GetExercisesQueryVariables = Exact<{
  uid: Scalars['ID'];
}>;


export type GetExercisesQuery = { __typename?: 'Query', getExercises?: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, type?: string | null, name: string } } | null> | null };

export type GetPRsOfQueryVariables = Exact<{
  eid: Scalars['ID'];
  till?: InputMaybe<Scalars['YMD']>;
}>;


export type GetPRsOfQuery = { __typename?: 'Query', getPRsOf?: { __typename?: 'PRHistory', totalWorkouts: number, exercise: { __typename?: 'Exercise', id: string, type?: string | null, name: string }, setsOf?: Array<{ __typename?: 'RepStat', r: number, count: number } | null> | null, prs?: Array<{ __typename?: 'PR', w: number, r: number, lb: number, when: any, bw?: number | null, a2bw?: number | null } | null> | null, wxdotPRS?: { __typename?: 'WxDOTPRs', ymds?: Array<any | null> | null, erowi2ymdi?: Array<number | null> | null, minDistancePR?: Array<number | null> | null, maxDistancePR?: Array<number | null> | null, maxTimePR?: Array<number | null> | null, minTimePR?: Array<number | null> | null, speedPR?: Array<number | null> | null, maxForcePR?: Array<number | null> | null, WxD_PRs?: Array<number | null> | null, WxT_PRs?: Array<number | null> | null, DxTPR?: Array<number | null> | null, erows?: Array<{ __typename?: 'Set', w?: number | null, r?: number | null, s?: number | null, lb?: number | null, ubw?: number | null, c?: string | null, rpe?: number | null, pr?: number | null, est1rm?: number | null, eff?: number | null, int?: number | null, type?: number | null, t?: number | null, d?: number | null, dunit?: string | null, speed?: number | null, force?: number | null } | null> | null } | null } | null };

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
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
}>;


export type GetFeedQuery = { __typename?: 'Query', getActivityFeed?: Array<{ __typename?: 'UCard', when?: any | null, text?: string | null, andXmore?: number | null, posted?: any | null, media?: string | null, itemsLeftAfterThis?: number | null, user?: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null, workoutPreview?: Array<{ __typename?: 'EblockPreview', r?: number | null, w?: number | null, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null> | null, utags?: { __typename?: 'UTagsUsed', tags?: Array<{ __typename?: 'UTag', id?: string | null, name: string } | null> | null, values?: Array<{ __typename?: 'UTagValue', id?: string | null, tagid: string, type: string, value: string } | null> | null } | null } | null> | null };

export type GetForumMessagesQueryVariables = Exact<{
  sectionId?: InputMaybe<Scalars['ID']>;
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetForumMessagesQuery = { __typename?: 'Query', getForumMessages?: { __typename?: 'Messages', messages?: Array<{ __typename?: 'ForumMessage', id: string, message: string, note?: string | null, parentId?: string | null, sectionId?: string | null, threadId?: string | null, user: string, when: any, replies?: number | null } | null> | null, users?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null } | null };

export type GetThreadMessagesQueryVariables = Exact<{
  messageId?: InputMaybe<Scalars['ID']>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetThreadMessagesQuery = { __typename?: 'Query', getThreadMessages?: { __typename?: 'Messages', messages?: Array<{ __typename?: 'ForumMessage', id: string, message: string, note?: string | null, parentId?: string | null, sectionId?: string | null, user: string, when: any, likes?: number | null, dislikes?: number | null, replies?: number | null } | null> | null, users?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null } | null };

export type GetForumSectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetForumSectionsQuery = { __typename?: 'Query', getForumSections?: Array<{ __typename?: 'ForumSection', description?: string | null, id: string, name: string, slug: string, threads?: number | null, replies?: number | null } | null> | null };

export type GetForumPostIndexQueryVariables = Exact<{
  postId: Scalars['ID'];
}>;


export type GetForumPostIndexQuery = { __typename?: 'Query', getForumPostIndex: number };

export type PostForumMessageMutationVariables = Exact<{
  sectionId: Scalars['ID'];
  parentId?: InputMaybe<Scalars['ID']>;
  message: Scalars['String'];
}>;


export type PostForumMessageMutation = { __typename?: 'Mutation', postForumMessage?: string | null };

export type DeleteForumMessageMutationVariables = Exact<{
  id: Scalars['ID'];
  why?: InputMaybe<Scalars['String']>;
}>;


export type DeleteForumMessageMutation = { __typename?: 'Mutation', deleteForumMessage?: boolean | null };

export type GetForumRolesDescriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetForumRolesDescriptionQuery = { __typename?: 'Query', getForumRolesDescription?: Array<{ __typename?: 'RoleDescriptor', key: string, title: string, description: string } | null> | null };

export type SetForumMessageNoteMutationVariables = Exact<{
  messageId: Scalars['ID'];
  note: Scalars['String'];
}>;


export type SetForumMessageNoteMutation = { __typename?: 'Mutation', setForumPostNote?: boolean | null };

type NotificationFields_Dm_Fragment = { __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string, isGlobal?: boolean | null };

type NotificationFields_ForumLike_Fragment = { __typename: 'ForumLike', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string, forumSlug: string, threadId: string, threadSlug: string, dislike?: boolean | null, postId: string };

type NotificationFields_ForumNotification_Fragment = { __typename: 'ForumNotification', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string, forumSlug: string, threadId: string, threadSlug: string, isMention?: boolean | null, postId: string };

type NotificationFields_JComment_Fragment = { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string };

type NotificationFields_LikeOnDm_Fragment = { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string };

type NotificationFields_LikeOnJComment_Fragment = { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string };

type NotificationFields_LikeOnLog_Fragment = { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string };

type NotificationFields_StartedFollowing_Fragment = { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string };

type NotificationFields_SystemNotification_Fragment = { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null };

export type NotificationFieldsFragment = NotificationFields_Dm_Fragment | NotificationFields_ForumLike_Fragment | NotificationFields_ForumNotification_Fragment | NotificationFields_JComment_Fragment | NotificationFields_LikeOnDm_Fragment | NotificationFields_LikeOnJComment_Fragment | NotificationFields_LikeOnLog_Fragment | NotificationFields_StartedFollowing_Fragment | NotificationFields_SystemNotification_Fragment;

export type GetInboxQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
  dmsWithUID?: InputMaybe<Scalars['ID']>;
}>;


export type GetInboxQuery = { __typename?: 'Query', getInbox?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string, isGlobal?: boolean | null } | { __typename: 'ForumLike', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string, forumSlug: string, threadId: string, threadSlug: string, dislike?: boolean | null, postId: string } | { __typename: 'ForumNotification', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string, forumSlug: string, threadId: string, threadSlug: string, isMention?: boolean | null, postId: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type GetNotificationsQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
}>;


export type GetNotificationsQuery = { __typename?: 'Query', getNotifications?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string, isGlobal?: boolean | null } | { __typename: 'ForumLike', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string, forumSlug: string, threadId: string, threadSlug: string, dislike?: boolean | null, postId: string } | { __typename: 'ForumNotification', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string, forumSlug: string, threadId: string, threadSlug: string, isMention?: boolean | null, postId: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type GetAnnouncementsQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  limit: Scalars['Int'];
}>;


export type GetAnnouncementsQuery = { __typename?: 'Query', getAnnouncements?: Array<{ __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null } | null> | null };

export type WxDoTFieldsFragment = { __typename?: 'Set', type?: number | null, t?: number | null, d?: number | null, dunit?: string | null };

export type WxDoTFieldsExtrasFragment = { __typename?: 'Set', speed?: number | null, force?: number | null };

export type SetFieldsFragment = { __typename?: 'Set', w?: number | null, r?: number | null, s?: number | null, lb?: number | null, ubw?: number | null, c?: string | null, rpe?: number | null, pr?: number | null, est1rm?: number | null, eff?: number | null, int?: number | null };

export type GetUserInfoQueryVariables = Exact<{
  userInfoUname: Scalars['String'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', userInfo: { __typename?: 'UserInfo', daysLogged: number, user: { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: string | null, slvl?: number | null, sok?: number | null, sleft?: number | null, age?: number | null, bw?: number | null, private?: number | null, isf?: number | null, joined?: string | null, usekg?: number | null, forumRole?: ForumRoleKey | null, custom1RM?: number | null, est1RMFactor?: number | null, jranges?: Array<number | null> | null, estimate1RMFormula?: string | null, socialLinks?: Array<string | null> | null }, forum?: { __typename?: 'ForumStatus', posts?: number | null, role?: { __typename?: 'ForumRole', title: string } | null } | null, best3?: Array<{ __typename?: 'BestLift', w: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } }> | null } };

export type GetUserBasicInfoQueryVariables = Exact<{
  of?: InputMaybe<Scalars['ID']>;
  ofThese?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type GetUserBasicInfoQuery = { __typename?: 'Query', userBasicInfo?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null }> | null };

export type GetCalendarDaysQueryVariables = Exact<{
  uid: Scalars['ID'];
  from: Scalars['YYYYMMDD'];
  to: Scalars['YYYYMMDD'];
}>;


export type GetCalendarDaysQuery = { __typename?: 'Query', getCalendarDays?: Array<any | null> | null };

export type GetYearOverviewQueryVariables = Exact<{
  uid: Scalars['ID'];
  year: Scalars['Int'];
}>;


export type GetYearOverviewQuery = { __typename?: 'Query', getYearOverview?: Array<number | null> | null, getYearsLogged?: Array<number | null> | null };

export type JDayQueryVariables = Exact<{
  uid: Scalars['ID'];
  ymd?: InputMaybe<Scalars['YMD']>;
}>;


export type JDayQuery = { __typename?: 'Query', jday?: { __typename?: 'JLog', id: string, log?: string | null, fromMobile?: boolean | null, bw?: number | null, eblocks?: Array<{ __typename?: 'EBlock', eid: string, sets: Array<{ __typename?: 'Set', w?: number | null, r?: number | null, s?: number | null, lb?: number | null, ubw?: number | null, c?: string | null, rpe?: number | null, pr?: number | null, est1rm?: number | null, eff?: number | null, int?: number | null, type?: number | null, t?: number | null, d?: number | null, dunit?: string | null, speed?: number | null, force?: number | null } | null> } | null> | null, exercises?: Array<{ __typename?: 'ERef', exercise: { __typename?: 'Exercise', id: string, name: string, type?: string | null }, best?: { __typename?: 'EBestStats', eff?: { __typename?: 'BestEStat', w: number, r: number, lb: number, when: any, bw?: number | null, est1rm?: number | null } | null, int?: { __typename?: 'BestEStat', w: number, r: number, lb: number, when: any, bw?: number | null } | null, prsWxDorT?: { __typename?: 'BestWxDorT', maxDistance?: { __typename?: 'UnitValueWhen', val: number, unit: string, when: any } | null, minDistance?: { __typename?: 'UnitValueWhen', val: number, unit: string, when: any } | null, topSpeed?: { __typename?: 'UnitValueWhen', val: number, unit: string, when: any } | null, minTime?: { __typename?: 'UnitValueWhen', val: number, unit: string, when: any } | null, maxTime?: { __typename?: 'UnitValueWhen', val: number, unit: string, when: any } | null, maxForce?: { __typename?: 'UnitValueWhen', val: number, unit: string, when: any } | null } | null } | null } | null> | null, utags?: Array<{ __typename?: 'UTag', id?: string | null, name: string } | null> | null, utagsValues?: Array<{ __typename?: 'UTagValue', id?: string | null, tagid: string, type: string, value: string, logid?: string | null } | null> | null } | null };

export type AlsoPostedQueryVariables = Exact<{
  ymd?: InputMaybe<Scalars['YMD']>;
}>;


export type AlsoPostedQuery = { __typename?: 'Query', alsoposted?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null };

export type JeditorDataFieldsFragment = { __typename?: 'JEditorData', etags: Array<string | null>, baseBW?: number | null, exercises: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null>, utags?: Array<{ __typename?: 'UTag', id?: string | null, name: string } | null> | null, did?: Array<{ __typename?: 'JEditorBWTag', bw?: number | null } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorEBlock', e?: number | null, sets?: Array<{ __typename?: 'JEditorEROW', usebw?: number | null, v?: number | null, c?: string | null, s?: number | null, r?: number | null, lb?: number | null, rpe?: number | null, t?: number | null, d?: number | null, dunit?: string | null, type?: number | null } | null> | null } | { __typename?: 'JEditorNewExercise' } | { __typename?: 'JEditorText', text?: string | null } | { __typename?: 'UTagValue', tagid: string, type: string, value: string } | null> | null };

export type GetJRangeQueryVariables = Exact<{
  uid: Scalars['ID'];
  ymd: Scalars['YMD'];
  range: Scalars['Int'];
}>;


export type GetJRangeQuery = { __typename?: 'Query', jrange?: { __typename?: 'JRangeData', from?: any | null, to?: any | null, exercises: Array<{ __typename?: 'Exercise', id: string, name: string, type?: string | null } | null>, days?: Array<{ __typename?: 'JRangeDayData', on?: any | null, did?: Array<{ __typename?: 'EBlock', eid: string, sets: Array<{ __typename?: 'Set', w?: number | null, r?: number | null, s?: number | null, lb?: number | null, ubw?: number | null, c?: string | null, rpe?: number | null, pr?: number | null, est1rm?: number | null, eff?: number | null, int?: number | null, type?: number | null, t?: number | null, d?: number | null, dunit?: string | null, speed?: number | null, force?: number | null } | null> } | null> | null } | null> | null, utags?: { __typename?: 'UTagsUsed', tags?: Array<{ __typename?: 'UTag', id?: string | null, name: string, automatic?: boolean | null } | null> | null, values?: Array<{ __typename?: 'UTagValue', tagid: string, ymd?: any | null, type: string, value: string } | null> | null } | null } | null };

export type GetJEditorDataQueryVariables = Exact<{
  ymd?: InputMaybe<Scalars['YMD']>;
  range?: InputMaybe<Scalars['Int']>;
}>;


export type GetJEditorDataQuery = { __typename?: 'Query', jeditor?: { __typename?: 'JEditorData', etags: Array<string | null>, baseBW?: number | null, exercises: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null>, utags?: Array<{ __typename?: 'UTag', id?: string | null, name: string } | null> | null, did?: Array<{ __typename?: 'JEditorBWTag', bw?: number | null } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorEBlock', e?: number | null, sets?: Array<{ __typename?: 'JEditorEROW', usebw?: number | null, v?: number | null, c?: string | null, s?: number | null, r?: number | null, lb?: number | null, rpe?: number | null, t?: number | null, d?: number | null, dunit?: string | null, type?: number | null } | null> | null } | { __typename?: 'JEditorNewExercise' } | { __typename?: 'JEditorText', text?: string | null } | { __typename?: 'UTagValue', tagid: string, type: string, value: string } | null> | null } | null };

export type SaveJEditorMutationVariables = Exact<{
  rows?: InputMaybe<Array<InputMaybe<Scalars['JEditorSaveRow']>> | InputMaybe<Scalars['JEditorSaveRow']>>;
  defaultDate: Scalars['YMD'];
}>;


export type SaveJEditorMutation = { __typename?: 'Mutation', saveJEditor?: boolean | null };

export type DownloadLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type DownloadLogsQuery = { __typename?: 'Query', downloadLogs?: { __typename?: 'JEditorData', etags: Array<string | null>, baseBW?: number | null, exercises: Array<{ __typename?: 'ExerciseStat', days: number, reps: number, e: { __typename?: 'Exercise', id: string, name: string, type?: string | null } } | null>, utags?: Array<{ __typename?: 'UTag', id?: string | null, name: string } | null> | null, did?: Array<{ __typename?: 'JEditorBWTag', bw?: number | null } | { __typename?: 'JEditorDayTag', on: any } | { __typename?: 'JEditorEBlock', e?: number | null, sets?: Array<{ __typename?: 'JEditorEROW', usebw?: number | null, v?: number | null, c?: string | null, s?: number | null, r?: number | null, lb?: number | null, rpe?: number | null, t?: number | null, d?: number | null, dunit?: string | null, type?: number | null } | null> | null } | { __typename?: 'JEditorNewExercise' } | { __typename?: 'JEditorText', text?: string | null } | { __typename?: 'UTagValue', tagid: string, type: string, value: string } | null> | null } | null };

export type GetFollowersQueryVariables = Exact<{
  of: Scalars['ID'];
  has?: InputMaybe<Scalars['ID']>;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowersCount: { __typename?: 'FollowersCount', has?: boolean | null, total: number } };

export type GetUsersFollowingQueryVariables = Exact<{
  who: Scalars['ID'];
}>;


export type GetUsersFollowingQuery = { __typename?: 'Query', getFollowers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null };

export type GetUsersFollowedByQueryVariables = Exact<{
  who: Scalars['ID'];
}>;


export type GetUsersFollowedByQuery = { __typename?: 'Query', getFollowing?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null };

export type GetFollowInfoQueryVariables = Exact<{
  uid: Scalars['ID'];
}>;


export type GetFollowInfoQuery = { __typename?: 'Query', getFollowers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null, getFollowing?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } | null> | null };

export type LikeMessageMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type LikeMessageMutation = { __typename?: 'Mutation', likeMessage: string };

export type LikeJournalLogMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type LikeJournalLogMutation = { __typename?: 'Mutation', likeJournalLog: string };

export type LikeForumMessageMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type LikeForumMessageMutation = { __typename?: 'Mutation', likeForumMessage: string };

export type DislikeForumMessageMutationVariables = Exact<{
  target: Scalars['ID'];
}>;


export type DislikeForumMessageMutation = { __typename?: 'Mutation', dislikeForumMessage: string };

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


export type GetLogInboxQuery = { __typename?: 'Query', getLogInbox?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'ForumLike', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string } | { __typename: 'ForumNotification', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type GetPublicInteractionsInboxQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  newerThan?: InputMaybe<Scalars['UTCDate']>;
}>;


export type GetPublicInteractionsInboxQuery = { __typename?: 'Query', getAllPublicInteractionsInbox?: { __typename?: 'Inbox', referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null }> | null, notifications?: Array<{ __typename: 'DM', id: string, when: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'ForumLike', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string } | { __typename: 'ForumNotification', id: string, when: any, jowner: string, ymd: any, by: string, to: string, text: string } | { __typename: 'JComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, inResponseTo?: string | null, inResponseToMsg?: string | null, text: string } | { __typename: 'LikeOnDM', id: string, when: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnJComment', id: string, when: any, jowner: string, ymd: any, by: string, to: string, msgid: string, text: string } | { __typename: 'LikeOnLog', id: string, when: any, jowner: string, ymd: any, by: string } | { __typename: 'StartedFollowing', id: string, when: any, by: string, to: string } | { __typename: 'SystemNotification', id: string, when: any, text: string, variant?: SystemNotificationType | null }> | null } | null };

export type SearchQueryVariables = Exact<{
  query: Scalars['String'];
  page?: InputMaybe<Scalars['Int']>;
}>;


export type SearchQuery = { __typename?: 'Query', search?: { __typename?: 'SearchResults', page: number, referencedUsers?: Array<{ __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null }> | null, referencedExercises?: Array<{ __typename?: 'Exercise', id: string, type?: string | null, name: string }> | null, results?: Array<{ __typename?: 'SearchResult', ymd: any, exercise: string, user: string, weight: number, inlbs: boolean, reps: number, sets: number }> | null } | null };

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


export type GetSessionQuery = { __typename?: 'Query', getSession?: { __typename?: 'SessionInfo', time?: string | null, user: { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: string | null, slvl?: number | null, sok?: number | null, sleft?: number | null, age?: number | null, bw?: number | null, private?: number | null, isf?: number | null, joined?: string | null, usekg?: number | null, forumRole?: ForumRoleKey | null, custom1RM?: number | null, est1RMFactor?: number | null, jranges?: Array<number | null> | null, estimate1RMFormula?: string | null, socialLinks?: Array<string | null> | null }, forum?: { __typename?: 'ForumStatus', role?: { __typename?: 'ForumRole', id: string, title: string, can?: Array<string> | null, all?: boolean | null } | null } | null } | null };

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

type SettingsFields_ConnectedServicesSetting_Fragment = { __typename?: 'ConnectedServicesSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_Custom1RmFactorSetting_Fragment = { __typename?: 'Custom1RMFactorSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_DobSetting_Fragment = { __typename?: 'DOBSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_DeleteAccountSetting_Fragment = { __typename?: 'DeleteAccountSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_DeveloperConfigSetting_Fragment = { __typename?: 'DeveloperConfigSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_EmailSetting_Fragment = { __typename?: 'EmailSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_OptionSetting_Fragment = { __typename?: 'OptionSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_RpeSetting_Fragment = { __typename?: 'RPESetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_SocialMediasSetting_Fragment = { __typename?: 'SocialMediasSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_SupporterStatus_Fragment = { __typename?: 'SupporterStatus', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_UsernameSetting_Fragment = { __typename?: 'UsernameSetting', id: string, waitingCodeToChange?: boolean | null };

type SettingsFields_VoidSetting_Fragment = { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null };

export type SettingsFieldsFragment = SettingsFields_BlockUsersSetting_Fragment | SettingsFields_CcSetting_Fragment | SettingsFields_ConnectedServicesSetting_Fragment | SettingsFields_Custom1RmFactorSetting_Fragment | SettingsFields_DobSetting_Fragment | SettingsFields_DeleteAccountSetting_Fragment | SettingsFields_DeveloperConfigSetting_Fragment | SettingsFields_EmailSetting_Fragment | SettingsFields_OptionSetting_Fragment | SettingsFields_RpeSetting_Fragment | SettingsFields_SocialMediasSetting_Fragment | SettingsFields_SupporterStatus_Fragment | SettingsFields_UsernameSetting_Fragment | SettingsFields_VoidSetting_Fragment;

type SettingFields_BlockUsersSetting_Fragment = { __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_CcSetting_Fragment = { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null };

type SettingFields_ConnectedServicesSetting_Fragment = { __typename?: 'ConnectedServicesSetting', id: string, waitingCodeToChange?: boolean | null, connections?: Array<{ __typename?: 'ConnectedService', id: string, name: string, url: string }> | null };

type SettingFields_Custom1RmFactorSetting_Fragment = { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_DobSetting_Fragment = { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_DeleteAccountSetting_Fragment = { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_DeveloperConfigSetting_Fragment = { __typename?: 'DeveloperConfigSetting', id: string, waitingCodeToChange?: boolean | null, config: { __typename?: 'DeveloperConfig', confirmChanges?: { __typename?: 'DevConfigChanges', hash: string, changelog?: string | null } | null, services?: Array<{ __typename?: 'DeveloperService', id: string, dbid?: string | null, name: string, url: string, redirectUris: Array<string>, secret?: string | null }> | null } };

type SettingFields_EmailSetting_Fragment = { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_OptionSetting_Fragment = { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null };

type SettingFields_RpeSetting_Fragment = { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_SocialMediasSetting_Fragment = { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_SupporterStatus_Fragment = { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_UsernameSetting_Fragment = { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null };

type SettingFields_VoidSetting_Fragment = { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null };

export type SettingFieldsFragment = SettingFields_BlockUsersSetting_Fragment | SettingFields_CcSetting_Fragment | SettingFields_ConnectedServicesSetting_Fragment | SettingFields_Custom1RmFactorSetting_Fragment | SettingFields_DobSetting_Fragment | SettingFields_DeleteAccountSetting_Fragment | SettingFields_DeveloperConfigSetting_Fragment | SettingFields_EmailSetting_Fragment | SettingFields_OptionSetting_Fragment | SettingFields_RpeSetting_Fragment | SettingFields_SocialMediasSetting_Fragment | SettingFields_SupporterStatus_Fragment | SettingFields_UsernameSetting_Fragment | SettingFields_VoidSetting_Fragment;

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { __typename?: 'Query', getUserSettings: Array<{ __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null } | { __typename?: 'ConnectedServicesSetting', id: string, waitingCodeToChange?: boolean | null, connections?: Array<{ __typename?: 'ConnectedService', id: string, name: string, url: string }> | null } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeveloperConfigSetting', id: string, waitingCodeToChange?: boolean | null, config: { __typename?: 'DeveloperConfig', confirmChanges?: { __typename?: 'DevConfigChanges', hash: string, changelog?: string | null } | null, services?: Array<{ __typename?: 'DeveloperService', id: string, dbid?: string | null, name: string, url: string, redirectUris: Array<string>, secret?: string | null }> | null } } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null } | { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null } | null> };

export type SetSettingMutationVariables = Exact<{
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['SettingValue']>;
}>;


export type SetSettingMutation = { __typename?: 'Mutation', setSetting?: { __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null } | { __typename?: 'ConnectedServicesSetting', id: string, waitingCodeToChange?: boolean | null, connections?: Array<{ __typename?: 'ConnectedService', id: string, name: string, url: string }> | null } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeveloperConfigSetting', id: string, waitingCodeToChange?: boolean | null, config: { __typename?: 'DeveloperConfig', confirmChanges?: { __typename?: 'DevConfigChanges', hash: string, changelog?: string | null } | null, services?: Array<{ __typename?: 'DeveloperService', id: string, dbid?: string | null, name: string, url: string, redirectUris: Array<string>, secret?: string | null }> | null } } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null } | { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null } | null };

export type SendVerificatonCodeMutationVariables = Exact<{
  id: Scalars['ID'];
  code: Scalars['String'];
}>;


export type SendVerificatonCodeMutation = { __typename?: 'Mutation', sendVerificationCode?: { __typename?: 'BlockUsersSetting', unames?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'CCSetting', cc?: string | null, id: string, waitingCodeToChange?: boolean | null, ccs?: Array<{ __typename?: 'CC', cc: string, name: string } | null> | null } | { __typename?: 'ConnectedServicesSetting', id: string, waitingCodeToChange?: boolean | null, connections?: Array<{ __typename?: 'ConnectedService', id: string, name: string, url: string }> | null } | { __typename?: 'Custom1RMFactorSetting', factor: number, formula?: string | null, default: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DOBSetting', dob?: any | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeleteAccountSetting', signature?: string | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'DeveloperConfigSetting', id: string, waitingCodeToChange?: boolean | null, config: { __typename?: 'DeveloperConfig', confirmChanges?: { __typename?: 'DevConfigChanges', hash: string, changelog?: string | null } | null, services?: Array<{ __typename?: 'DeveloperService', id: string, dbid?: string | null, name: string, url: string, redirectUris: Array<string>, secret?: string | null }> | null } } | { __typename?: 'EmailSetting', currentEmail: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'OptionSetting', i?: number | null, id: string, waitingCodeToChange?: boolean | null, options?: Array<{ __typename?: 'Option', i: number, name: string } | null> | null } | { __typename?: 'RPESetting', defaults?: Array<any | null> | null, overrides?: Array<any | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SocialMediasSetting', links?: Array<string | null> | null, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'SupporterStatus', slvl: number, daysLeftAsActive: number, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'UsernameSetting', uname: string, id: string, waitingCodeToChange?: boolean | null } | { __typename?: 'VoidSetting', id: string, waitingCodeToChange?: boolean | null } | null };

export type UnsubFromEmailsMutationVariables = Exact<{
  token?: InputMaybe<Scalars['String']>;
}>;


export type UnsubFromEmailsMutation = { __typename?: 'Mutation', unsubFromEmails?: boolean | null };

export type GetSupportersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSupportersQuery = { __typename?: 'Query', getSupporters?: Array<{ __typename?: 'Supporter', when?: string | null, user: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } } | null> | null };

export type GetActiveSupportersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveSupportersQuery = { __typename?: 'Query', getActiveSupporters?: Array<{ __typename?: 'Supporter', when?: string | null, user: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } } | null> | null };

export type GetTwitterChallengesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwitterChallengesQuery = { __typename?: 'Query', getTwitterChallenges?: Array<{ __typename?: 'TweetChallenge', description: string, title: string, type: TweetType } | null> | null };

export type GetTwitterChallengesStatusesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTwitterChallengesStatusesQuery = { __typename?: 'Query', getTwitterChallengesStates?: Array<{ __typename?: 'TweetState', fecha: any, granted?: boolean | null, status?: string | null, tweet: string, type: TweetType } | null> | null };

export type SetTweetMutationVariables = Exact<{
  tweetID?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<TweetType>;
}>;


export type SetTweetMutation = { __typename?: 'Mutation', setTweet?: boolean | null };

export type DeleteTweetMutationVariables = Exact<{
  tweetID?: InputMaybe<Scalars['ID']>;
}>;


export type DeleteTweetMutation = { __typename?: 'Mutation', deleteTweet?: boolean | null };

export type UserFieldsFragment = { __typename?: 'User', id: string, avatarhash: string, uname: string, cc?: string | null, slvl?: number | null, sok?: number | null, sleft?: number | null, age?: number | null, bw?: number | null, private?: number | null, isf?: number | null, joined?: string | null, usekg?: number | null, forumRole?: ForumRoleKey | null, custom1RM?: number | null, est1RMFactor?: number | null, jranges?: Array<number | null> | null, estimate1RMFormula?: string | null, socialLinks?: Array<string | null> | null };

export type BriefUserFieldsFragment = { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null };

export type UploadAvatarMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadAvatarMutation = { __typename?: 'Mutation', uploadAvatar: string };

export type DeleteAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAvatarMutation = { __typename?: 'Mutation', deleteAvatar?: boolean | null };

export type GetVideosQueryVariables = Exact<{
  olderThan?: InputMaybe<Scalars['UTCDate']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetVideosQuery = { __typename?: 'Query', getVideos?: Array<{ __typename?: 'Video', when: string, posted: string, logid: string, link: string, user: { __typename?: 'User', id: string, avatarhash: string, joined?: string | null, private?: number | null, uname: string, cc?: string | null, isf?: number | null, sok?: number | null, slvl?: number | null, forumRole?: ForumRoleKey | null } } | null> | null };

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
  ... on IForum {
    forumSlug
    threadId
    threadSlug
  }
  ... on ForumLike {
    dislike
    postId
  }
  ... on ForumNotification {
    isMention
    postId
  }
}
    `;
export const WxDoTFieldsFragmentDoc = gql`
    fragment WxDoTFields on Set {
  type
  t
  d
  dunit
}
    `;
export const WxDoTFieldsExtrasFragmentDoc = gql`
    fragment WxDoTFieldsExtras on Set {
  speed
  force
}
    `;
export const SetFieldsFragmentDoc = gql`
    fragment SetFields on Set {
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
  utags {
    id
    name
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
        t
        d
        dunit
        type
      }
    }
    ... on JEditorDayTag {
      on
    }
    ... on UTagValue {
      tagid
      type
      value
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
  ... on ConnectedServicesSetting {
    connections {
      id
      name
      url
    }
  }
  ... on DeveloperConfigSetting {
    config {
      confirmChanges {
        hash
        changelog
      }
      services {
        id
        dbid
        name
        url
        redirectUris
        secret
      }
    }
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
  sleft
  age
  bw
  private
  isf
  joined
  usekg
  forumRole
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
  forumRole
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
      graphAge
    }
    ageClasses
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
      a2bw
    }
    wxdotPRS {
      erows {
        ...SetFields
        ...WxDoTFields
        ...WxDoTFieldsExtras
      }
      ymds
      erowi2ymdi
      minDistancePR
      maxDistancePR
      maxTimePR
      minTimePR
      speedPR
      maxForcePR
      WxD_PRs
      WxT_PRs
      DxTPR
    }
  }
}
    ${SetFieldsFragmentDoc}
${WxDoTFieldsFragmentDoc}
${WxDoTFieldsExtrasFragmentDoc}`;

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
    query GetFeed($type: ActivityFeedType!, $olderThan: UTCDate, $newerThan: UTCDate) {
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
    utags {
      tags {
        id
        name
      }
      values {
        id
        tagid
        type
        value
      }
    }
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
export const GetForumMessagesDocument = gql`
    query GetForumMessages($sectionId: ID, $olderThan: UTCDate, $limit: Int) {
  getForumMessages(sectionId: $sectionId, olderThan: $olderThan, limit: $limit) {
    messages {
      id
      message
      note
      parentId
      sectionId
      threadId
      user
      when
      replies
    }
    users {
      ...BriefUserFields
    }
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetForumMessagesQuery__
 *
 * To run a query within a React component, call `useGetForumMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumMessagesQuery({
 *   variables: {
 *      sectionId: // value for 'sectionId'
 *      olderThan: // value for 'olderThan'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetForumMessagesQuery(baseOptions?: Apollo.QueryHookOptions<GetForumMessagesQuery, GetForumMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumMessagesQuery, GetForumMessagesQueryVariables>(GetForumMessagesDocument, options);
      }
export function useGetForumMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumMessagesQuery, GetForumMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumMessagesQuery, GetForumMessagesQueryVariables>(GetForumMessagesDocument, options);
        }
export type GetForumMessagesQueryHookResult = ReturnType<typeof useGetForumMessagesQuery>;
export type GetForumMessagesLazyQueryHookResult = ReturnType<typeof useGetForumMessagesLazyQuery>;
export type GetForumMessagesQueryResult = Apollo.QueryResult<GetForumMessagesQuery, GetForumMessagesQueryVariables>;
export const GetThreadMessagesDocument = gql`
    query GetThreadMessages($messageId: ID, $offset: Int, $limit: Int) {
  getThreadMessages(messageId: $messageId, offset: $offset, limit: $limit) {
    messages {
      id
      message
      note
      parentId
      sectionId
      user
      when
      likes
      dislikes
      replies
    }
    users {
      ...BriefUserFields
    }
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetThreadMessagesQuery__
 *
 * To run a query within a React component, call `useGetThreadMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThreadMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThreadMessagesQuery({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetThreadMessagesQuery(baseOptions?: Apollo.QueryHookOptions<GetThreadMessagesQuery, GetThreadMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThreadMessagesQuery, GetThreadMessagesQueryVariables>(GetThreadMessagesDocument, options);
      }
export function useGetThreadMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThreadMessagesQuery, GetThreadMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThreadMessagesQuery, GetThreadMessagesQueryVariables>(GetThreadMessagesDocument, options);
        }
export type GetThreadMessagesQueryHookResult = ReturnType<typeof useGetThreadMessagesQuery>;
export type GetThreadMessagesLazyQueryHookResult = ReturnType<typeof useGetThreadMessagesLazyQuery>;
export type GetThreadMessagesQueryResult = Apollo.QueryResult<GetThreadMessagesQuery, GetThreadMessagesQueryVariables>;
export const GetForumSectionsDocument = gql`
    query GetForumSections {
  getForumSections {
    description
    id
    name
    slug
    threads
    replies
  }
}
    `;

/**
 * __useGetForumSectionsQuery__
 *
 * To run a query within a React component, call `useGetForumSectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumSectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumSectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetForumSectionsQuery(baseOptions?: Apollo.QueryHookOptions<GetForumSectionsQuery, GetForumSectionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumSectionsQuery, GetForumSectionsQueryVariables>(GetForumSectionsDocument, options);
      }
export function useGetForumSectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumSectionsQuery, GetForumSectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumSectionsQuery, GetForumSectionsQueryVariables>(GetForumSectionsDocument, options);
        }
export type GetForumSectionsQueryHookResult = ReturnType<typeof useGetForumSectionsQuery>;
export type GetForumSectionsLazyQueryHookResult = ReturnType<typeof useGetForumSectionsLazyQuery>;
export type GetForumSectionsQueryResult = Apollo.QueryResult<GetForumSectionsQuery, GetForumSectionsQueryVariables>;
export const GetForumPostIndexDocument = gql`
    query GetForumPostIndex($postId: ID!) {
  getForumPostIndex(postId: $postId)
}
    `;

/**
 * __useGetForumPostIndexQuery__
 *
 * To run a query within a React component, call `useGetForumPostIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumPostIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumPostIndexQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetForumPostIndexQuery(baseOptions: Apollo.QueryHookOptions<GetForumPostIndexQuery, GetForumPostIndexQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumPostIndexQuery, GetForumPostIndexQueryVariables>(GetForumPostIndexDocument, options);
      }
export function useGetForumPostIndexLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumPostIndexQuery, GetForumPostIndexQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumPostIndexQuery, GetForumPostIndexQueryVariables>(GetForumPostIndexDocument, options);
        }
export type GetForumPostIndexQueryHookResult = ReturnType<typeof useGetForumPostIndexQuery>;
export type GetForumPostIndexLazyQueryHookResult = ReturnType<typeof useGetForumPostIndexLazyQuery>;
export type GetForumPostIndexQueryResult = Apollo.QueryResult<GetForumPostIndexQuery, GetForumPostIndexQueryVariables>;
export const PostForumMessageDocument = gql`
    mutation PostForumMessage($sectionId: ID!, $parentId: ID, $message: String!) {
  postForumMessage(sectionId: $sectionId, parentId: $parentId, message: $message)
}
    `;
export type PostForumMessageMutationFn = Apollo.MutationFunction<PostForumMessageMutation, PostForumMessageMutationVariables>;

/**
 * __usePostForumMessageMutation__
 *
 * To run a mutation, you first call `usePostForumMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostForumMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postForumMessageMutation, { data, loading, error }] = usePostForumMessageMutation({
 *   variables: {
 *      sectionId: // value for 'sectionId'
 *      parentId: // value for 'parentId'
 *      message: // value for 'message'
 *   },
 * });
 */
export function usePostForumMessageMutation(baseOptions?: Apollo.MutationHookOptions<PostForumMessageMutation, PostForumMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostForumMessageMutation, PostForumMessageMutationVariables>(PostForumMessageDocument, options);
      }
export type PostForumMessageMutationHookResult = ReturnType<typeof usePostForumMessageMutation>;
export type PostForumMessageMutationResult = Apollo.MutationResult<PostForumMessageMutation>;
export type PostForumMessageMutationOptions = Apollo.BaseMutationOptions<PostForumMessageMutation, PostForumMessageMutationVariables>;
export const DeleteForumMessageDocument = gql`
    mutation DeleteForumMessage($id: ID!, $why: String) {
  deleteForumMessage(id: $id, why: $why)
}
    `;
export type DeleteForumMessageMutationFn = Apollo.MutationFunction<DeleteForumMessageMutation, DeleteForumMessageMutationVariables>;

/**
 * __useDeleteForumMessageMutation__
 *
 * To run a mutation, you first call `useDeleteForumMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteForumMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteForumMessageMutation, { data, loading, error }] = useDeleteForumMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      why: // value for 'why'
 *   },
 * });
 */
export function useDeleteForumMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteForumMessageMutation, DeleteForumMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteForumMessageMutation, DeleteForumMessageMutationVariables>(DeleteForumMessageDocument, options);
      }
export type DeleteForumMessageMutationHookResult = ReturnType<typeof useDeleteForumMessageMutation>;
export type DeleteForumMessageMutationResult = Apollo.MutationResult<DeleteForumMessageMutation>;
export type DeleteForumMessageMutationOptions = Apollo.BaseMutationOptions<DeleteForumMessageMutation, DeleteForumMessageMutationVariables>;
export const GetForumRolesDescriptionDocument = gql`
    query GetForumRolesDescription {
  getForumRolesDescription {
    key
    title
    description
  }
}
    `;

/**
 * __useGetForumRolesDescriptionQuery__
 *
 * To run a query within a React component, call `useGetForumRolesDescriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetForumRolesDescriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetForumRolesDescriptionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetForumRolesDescriptionQuery(baseOptions?: Apollo.QueryHookOptions<GetForumRolesDescriptionQuery, GetForumRolesDescriptionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetForumRolesDescriptionQuery, GetForumRolesDescriptionQueryVariables>(GetForumRolesDescriptionDocument, options);
      }
export function useGetForumRolesDescriptionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetForumRolesDescriptionQuery, GetForumRolesDescriptionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetForumRolesDescriptionQuery, GetForumRolesDescriptionQueryVariables>(GetForumRolesDescriptionDocument, options);
        }
export type GetForumRolesDescriptionQueryHookResult = ReturnType<typeof useGetForumRolesDescriptionQuery>;
export type GetForumRolesDescriptionLazyQueryHookResult = ReturnType<typeof useGetForumRolesDescriptionLazyQuery>;
export type GetForumRolesDescriptionQueryResult = Apollo.QueryResult<GetForumRolesDescriptionQuery, GetForumRolesDescriptionQueryVariables>;
export const SetForumMessageNoteDocument = gql`
    mutation SetForumMessageNote($messageId: ID!, $note: String!) {
  setForumPostNote(messageId: $messageId, note: $note)
}
    `;
export type SetForumMessageNoteMutationFn = Apollo.MutationFunction<SetForumMessageNoteMutation, SetForumMessageNoteMutationVariables>;

/**
 * __useSetForumMessageNoteMutation__
 *
 * To run a mutation, you first call `useSetForumMessageNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetForumMessageNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setForumMessageNoteMutation, { data, loading, error }] = useSetForumMessageNoteMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useSetForumMessageNoteMutation(baseOptions?: Apollo.MutationHookOptions<SetForumMessageNoteMutation, SetForumMessageNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetForumMessageNoteMutation, SetForumMessageNoteMutationVariables>(SetForumMessageNoteDocument, options);
      }
export type SetForumMessageNoteMutationHookResult = ReturnType<typeof useSetForumMessageNoteMutation>;
export type SetForumMessageNoteMutationResult = Apollo.MutationResult<SetForumMessageNoteMutation>;
export type SetForumMessageNoteMutationOptions = Apollo.BaseMutationOptions<SetForumMessageNoteMutation, SetForumMessageNoteMutationVariables>;
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
    forum {
      posts
      role {
        title
      }
    }
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
export const GetUserBasicInfoDocument = gql`
    query GetUserBasicInfo($of: ID, $ofThese: [ID!]) {
  userBasicInfo(of: $of, ofThese: $ofThese) {
    ...BriefUserFields
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetUserBasicInfoQuery__
 *
 * To run a query within a React component, call `useGetUserBasicInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserBasicInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserBasicInfoQuery({
 *   variables: {
 *      of: // value for 'of'
 *      ofThese: // value for 'ofThese'
 *   },
 * });
 */
export function useGetUserBasicInfoQuery(baseOptions?: Apollo.QueryHookOptions<GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables>(GetUserBasicInfoDocument, options);
      }
export function useGetUserBasicInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables>(GetUserBasicInfoDocument, options);
        }
export type GetUserBasicInfoQueryHookResult = ReturnType<typeof useGetUserBasicInfoQuery>;
export type GetUserBasicInfoLazyQueryHookResult = ReturnType<typeof useGetUserBasicInfoLazyQuery>;
export type GetUserBasicInfoQueryResult = Apollo.QueryResult<GetUserBasicInfoQuery, GetUserBasicInfoQueryVariables>;
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
export const GetYearOverviewDocument = gql`
    query GetYearOverview($uid: ID!, $year: Int!) {
  getYearOverview(uid: $uid, year: $year)
  getYearsLogged(uid: $uid)
}
    `;

/**
 * __useGetYearOverviewQuery__
 *
 * To run a query within a React component, call `useGetYearOverviewQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetYearOverviewQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetYearOverviewQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *      year: // value for 'year'
 *   },
 * });
 */
export function useGetYearOverviewQuery(baseOptions: Apollo.QueryHookOptions<GetYearOverviewQuery, GetYearOverviewQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetYearOverviewQuery, GetYearOverviewQueryVariables>(GetYearOverviewDocument, options);
      }
export function useGetYearOverviewLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetYearOverviewQuery, GetYearOverviewQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetYearOverviewQuery, GetYearOverviewQueryVariables>(GetYearOverviewDocument, options);
        }
export type GetYearOverviewQueryHookResult = ReturnType<typeof useGetYearOverviewQuery>;
export type GetYearOverviewLazyQueryHookResult = ReturnType<typeof useGetYearOverviewLazyQuery>;
export type GetYearOverviewQueryResult = Apollo.QueryResult<GetYearOverviewQuery, GetYearOverviewQueryVariables>;
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
        ...SetFields
        ...WxDoTFields
        ...WxDoTFieldsExtras
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
        prsWxDorT {
          maxDistance {
            val
            unit
            when
          }
          minDistance {
            val
            unit
            when
          }
          topSpeed {
            val
            unit
            when
          }
          minTime {
            val
            unit
            when
          }
          maxTime {
            val
            unit
            when
          }
          maxForce {
            val
            unit
            when
          }
        }
      }
    }
    utags {
      id
      name
    }
    utagsValues {
      id
      tagid
      type
      value
      logid
    }
  }
}
    ${SetFieldsFragmentDoc}
${WxDoTFieldsFragmentDoc}
${WxDoTFieldsExtrasFragmentDoc}`;

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
    from
    to
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
          ...WxDoTFields
          ...WxDoTFieldsExtras
        }
      }
    }
    utags {
      tags {
        id
        name
        automatic
      }
      values {
        tagid
        ymd
        type
        value
      }
    }
  }
}
    ${WxDoTFieldsFragmentDoc}
${WxDoTFieldsExtrasFragmentDoc}`;

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
export const GetUsersFollowingDocument = gql`
    query GetUsersFollowing($who: ID!) {
  getFollowers(uid: $who) {
    ...BriefUserFields
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetUsersFollowingQuery__
 *
 * To run a query within a React component, call `useGetUsersFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersFollowingQuery({
 *   variables: {
 *      who: // value for 'who'
 *   },
 * });
 */
export function useGetUsersFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetUsersFollowingQuery, GetUsersFollowingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersFollowingQuery, GetUsersFollowingQueryVariables>(GetUsersFollowingDocument, options);
      }
export function useGetUsersFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersFollowingQuery, GetUsersFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersFollowingQuery, GetUsersFollowingQueryVariables>(GetUsersFollowingDocument, options);
        }
export type GetUsersFollowingQueryHookResult = ReturnType<typeof useGetUsersFollowingQuery>;
export type GetUsersFollowingLazyQueryHookResult = ReturnType<typeof useGetUsersFollowingLazyQuery>;
export type GetUsersFollowingQueryResult = Apollo.QueryResult<GetUsersFollowingQuery, GetUsersFollowingQueryVariables>;
export const GetUsersFollowedByDocument = gql`
    query GetUsersFollowedBy($who: ID!) {
  getFollowing(uid: $who) {
    ...BriefUserFields
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetUsersFollowedByQuery__
 *
 * To run a query within a React component, call `useGetUsersFollowedByQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersFollowedByQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersFollowedByQuery({
 *   variables: {
 *      who: // value for 'who'
 *   },
 * });
 */
export function useGetUsersFollowedByQuery(baseOptions: Apollo.QueryHookOptions<GetUsersFollowedByQuery, GetUsersFollowedByQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersFollowedByQuery, GetUsersFollowedByQueryVariables>(GetUsersFollowedByDocument, options);
      }
export function useGetUsersFollowedByLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersFollowedByQuery, GetUsersFollowedByQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersFollowedByQuery, GetUsersFollowedByQueryVariables>(GetUsersFollowedByDocument, options);
        }
export type GetUsersFollowedByQueryHookResult = ReturnType<typeof useGetUsersFollowedByQuery>;
export type GetUsersFollowedByLazyQueryHookResult = ReturnType<typeof useGetUsersFollowedByLazyQuery>;
export type GetUsersFollowedByQueryResult = Apollo.QueryResult<GetUsersFollowedByQuery, GetUsersFollowedByQueryVariables>;
export const GetFollowInfoDocument = gql`
    query GetFollowInfo($uid: ID!) {
  getFollowers(uid: $uid) {
    ...BriefUserFields
  }
  getFollowing(uid: $uid) {
    ...BriefUserFields
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useGetFollowInfoQuery__
 *
 * To run a query within a React component, call `useGetFollowInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowInfoQuery({
 *   variables: {
 *      uid: // value for 'uid'
 *   },
 * });
 */
export function useGetFollowInfoQuery(baseOptions: Apollo.QueryHookOptions<GetFollowInfoQuery, GetFollowInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowInfoQuery, GetFollowInfoQueryVariables>(GetFollowInfoDocument, options);
      }
export function useGetFollowInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowInfoQuery, GetFollowInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowInfoQuery, GetFollowInfoQueryVariables>(GetFollowInfoDocument, options);
        }
export type GetFollowInfoQueryHookResult = ReturnType<typeof useGetFollowInfoQuery>;
export type GetFollowInfoLazyQueryHookResult = ReturnType<typeof useGetFollowInfoLazyQuery>;
export type GetFollowInfoQueryResult = Apollo.QueryResult<GetFollowInfoQuery, GetFollowInfoQueryVariables>;
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
export const LikeForumMessageDocument = gql`
    mutation LikeForumMessage($target: ID!) {
  likeForumMessage(target: $target)
}
    `;
export type LikeForumMessageMutationFn = Apollo.MutationFunction<LikeForumMessageMutation, LikeForumMessageMutationVariables>;

/**
 * __useLikeForumMessageMutation__
 *
 * To run a mutation, you first call `useLikeForumMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeForumMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeForumMessageMutation, { data, loading, error }] = useLikeForumMessageMutation({
 *   variables: {
 *      target: // value for 'target'
 *   },
 * });
 */
export function useLikeForumMessageMutation(baseOptions?: Apollo.MutationHookOptions<LikeForumMessageMutation, LikeForumMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeForumMessageMutation, LikeForumMessageMutationVariables>(LikeForumMessageDocument, options);
      }
export type LikeForumMessageMutationHookResult = ReturnType<typeof useLikeForumMessageMutation>;
export type LikeForumMessageMutationResult = Apollo.MutationResult<LikeForumMessageMutation>;
export type LikeForumMessageMutationOptions = Apollo.BaseMutationOptions<LikeForumMessageMutation, LikeForumMessageMutationVariables>;
export const DislikeForumMessageDocument = gql`
    mutation DislikeForumMessage($target: ID!) {
  dislikeForumMessage(target: $target)
}
    `;
export type DislikeForumMessageMutationFn = Apollo.MutationFunction<DislikeForumMessageMutation, DislikeForumMessageMutationVariables>;

/**
 * __useDislikeForumMessageMutation__
 *
 * To run a mutation, you first call `useDislikeForumMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDislikeForumMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dislikeForumMessageMutation, { data, loading, error }] = useDislikeForumMessageMutation({
 *   variables: {
 *      target: // value for 'target'
 *   },
 * });
 */
export function useDislikeForumMessageMutation(baseOptions?: Apollo.MutationHookOptions<DislikeForumMessageMutation, DislikeForumMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DislikeForumMessageMutation, DislikeForumMessageMutationVariables>(DislikeForumMessageDocument, options);
      }
export type DislikeForumMessageMutationHookResult = ReturnType<typeof useDislikeForumMessageMutation>;
export type DislikeForumMessageMutationResult = Apollo.MutationResult<DislikeForumMessageMutation>;
export type DislikeForumMessageMutationOptions = Apollo.BaseMutationOptions<DislikeForumMessageMutation, DislikeForumMessageMutationVariables>;
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
export const SearchDocument = gql`
    query Search($query: String!, $page: Int) {
  search(query: $query, page: $page) {
    referencedUsers {
      ...BriefUserFields
    }
    referencedExercises {
      id
      type
      name
    }
    results {
      ymd
      exercise
      user
      weight
      inlbs
      reps
      sets
    }
    page
  }
}
    ${BriefUserFieldsFragmentDoc}`;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
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
    forum {
      role {
        id
        title
        can
        all
      }
    }
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
export const UnsubFromEmailsDocument = gql`
    mutation UnsubFromEmails($token: String) {
  unsubFromEmails(token: $token)
}
    `;
export type UnsubFromEmailsMutationFn = Apollo.MutationFunction<UnsubFromEmailsMutation, UnsubFromEmailsMutationVariables>;

/**
 * __useUnsubFromEmailsMutation__
 *
 * To run a mutation, you first call `useUnsubFromEmailsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubFromEmailsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubFromEmailsMutation, { data, loading, error }] = useUnsubFromEmailsMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUnsubFromEmailsMutation(baseOptions?: Apollo.MutationHookOptions<UnsubFromEmailsMutation, UnsubFromEmailsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsubFromEmailsMutation, UnsubFromEmailsMutationVariables>(UnsubFromEmailsDocument, options);
      }
export type UnsubFromEmailsMutationHookResult = ReturnType<typeof useUnsubFromEmailsMutation>;
export type UnsubFromEmailsMutationResult = Apollo.MutationResult<UnsubFromEmailsMutation>;
export type UnsubFromEmailsMutationOptions = Apollo.BaseMutationOptions<UnsubFromEmailsMutation, UnsubFromEmailsMutationVariables>;
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
export const UploadAvatarDocument = gql`
    mutation UploadAvatar($file: Upload!) {
  uploadAvatar(file: $file)
}
    `;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, options);
      }
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<UploadAvatarMutation, UploadAvatarMutationVariables>;
export const DeleteAvatarDocument = gql`
    mutation DeleteAvatar {
  deleteAvatar
}
    `;
export type DeleteAvatarMutationFn = Apollo.MutationFunction<DeleteAvatarMutation, DeleteAvatarMutationVariables>;

/**
 * __useDeleteAvatarMutation__
 *
 * To run a mutation, you first call `useDeleteAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAvatarMutation, { data, loading, error }] = useDeleteAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAvatarMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAvatarMutation, DeleteAvatarMutationVariables>(DeleteAvatarDocument, options);
      }
export type DeleteAvatarMutationHookResult = ReturnType<typeof useDeleteAvatarMutation>;
export type DeleteAvatarMutationResult = Apollo.MutationResult<DeleteAvatarMutation>;
export type DeleteAvatarMutationOptions = Apollo.BaseMutationOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>;
export const GetVideosDocument = gql`
    query GetVideos($olderThan: UTCDate, $limit: Int) {
  getVideos(olderThan: $olderThan, limit: $limit) {
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
 *      olderThan: // value for 'olderThan'
 *      limit: // value for 'limit'
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