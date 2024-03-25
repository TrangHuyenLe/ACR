import { ObjectId } from 'mongodb';

export class Account {
  _id: ObjectId;
  username: string;
  name: string;
  password: string;
  role?: string;

  constructor(o: {
    _id?: ObjectId;
    username?: string;
    name?: string;
    password?: string;
    role?: string;
  }) {
    this._id = o._id;
    this.username = o.username;
    this.name = o.name;
    this.password = o.password;
    this.role = o.role;
  }
}

export class JobCrawl {
  _id: ObjectId;
  ownerAccountId: ObjectId;
  username: string;
  password: string;
  status: number;
  no: number;
  iv: string;

  constructor(o: {
    _id?: ObjectId;
    username?: string;
    password?: string;
    status?: number;
    ownerAccountId?: ObjectId;
    no?: number;
    iv?: string;
  }) {
    this._id = o._id;
    this.ownerAccountId = o.ownerAccountId;
    this.username = o.username;
    this.password = o.password;
    this.status = o.status;
    this.no = o.no || 0;
    this.iv = o.iv;
  }
}

export class JobCrawlResult {
  _id: ObjectId;
  jobId: ObjectId;
  workerId: string;
  ownerAccountId: ObjectId;
  logs: string; // encrypted
  vars: string; // encrypted
  iv: string;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    jobId?: ObjectId;
    ownerAccountId?: ObjectId;
    workerId?: string;
    logs?: string;
    vars?: string;
    createdAt?: number;
    iv?: string;
  }) {
    this._id = o._id;
    this.jobId = o.jobId;
    this.workerId = o.workerId;
    this.ownerAccountId = o.ownerAccountId;
    this.logs = o.logs;
    this.vars = o.vars;
    this.createdAt = o.createdAt;
    this.iv = o.iv;
  }
}

export class DKHPTDJobV1 {
  _id: ObjectId;
  ownerAccountId: ObjectId;
  username: string;
  password: string;
  classIds: string[][];
  timeToStart: number;
  originTimeToStart: number;
  status: number;
  createdAt: number;
  doingAt: number;
  iv: string;
  no: number; // lần thực thí thứ n
  termId: string;
  priority: number;

  constructor(o: {
    _id?: ObjectId;
    username?: string;
    password?: string;
    classIds?: string[][];
    timeToStart?: number;
    ownerAccountId?: ObjectId;
    status?: number;
    createdAt?: number;
    doingAt?: number;
    originTimeToStart?: number;
    iv?: string;
    no?: number;
    termId?: string;
    priority?: number;
  }) {
    this._id = o._id;
    this.ownerAccountId = o.ownerAccountId;
    this.username = o.username;
    this.password = o.password;
    this.classIds = o.classIds;
    this.timeToStart = o.timeToStart;
    this.originTimeToStart = o.originTimeToStart;
    this.status = o.status;
    this.createdAt = o.createdAt;
    this.doingAt = o.doingAt || -1;
    this.iv = o.iv;
    this.no = o.no || 0;
    this.termId = o.termId;
    this.priority = o.priority || 0;
  }
}

export class DKHPTDJobV1Result {
  _id: ObjectId;
  jobId: ObjectId;
  workerId: string;
  ownerAccountId: ObjectId;
  logs: string; // encrypted
  vars: string; // encrypted
  iv: string;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    jobId?: ObjectId;
    ownerAccountId?: ObjectId;
    workerId?: string;
    logs?: string;
    vars?: string;
    createdAt?: number;
    iv?: string;
  }) {
    this._id = o._id;
    this.jobId = o.jobId;
    this.workerId = o.workerId;
    this.ownerAccountId = o.ownerAccountId;
    this.logs = o.logs;
    this.vars = o.vars;
    this.createdAt = o.createdAt;
    this.iv = o.iv;
  }
}

export class Student {
  _id: ObjectId;
  studentId: string;
  name: string;
  yearOfAdmission: string;
  degreeProgram: string;
  program: string;
  school: string;
  studyStatus: string;
  gender: string;
  class: string;
  cohort: string;
  email: string;

  constructor(o: {
    _id?: ObjectId;
    studentId?: string;
    name?: string;
    yearOfAdmission?: string;
    degreeProgram?: string;
    program?: string;
    school?: string;
    studyStatus?: string;
    gender?: string;
    class?: string;
    cohort?: string;
    email?: string;
  }) {
    this._id = o._id;
    this.studentId = o.studentId;
    this.name = o.name;
    this.yearOfAdmission = o.yearOfAdmission;
    this.degreeProgram = o.degreeProgram;
    this.program = o.program;
    this.school = o.school;
    this.studyStatus = o.studyStatus;
    this.gender = o.gender;
    this.class = o.class;
    this.cohort = o.cohort;
    this.email = o.email;
  }
}

export class StudentGrade {
  _id: ObjectId;
  studentId: string;
  termId: string;
  subjectId: string;
  subjectName: string;
  subjectVolume: number;
  classId: string;
  midtermGrade: number;
  finalGrade: number;
  letterGrade: number;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    studentId?: string;
    termId?: string;
    subjectId?: string;
    subjectName?: string;
    subjectVolume?: number;
    classId?: string;
    midtermGrade?: number;
    finalGrade?: number;
    letterGrade?: number;
    createdAt?: number;
  }) {
    this._id = o._id;
    this.studentId = o.studentId;
    this.termId = o.termId;
    this.subjectId = o.subjectId;
    this.subjectName = o.subjectName;
    this.subjectVolume = o.subjectVolume;
    this.classId = o.classId;
    this.midtermGrade = o.midtermGrade;
    this.finalGrade = o.finalGrade;
    this.letterGrade = o.letterGrade;
    this.createdAt = o.createdAt;
  }
}

export class StudentLearningResult {
  _id: ObjectId;
  studentId: string;
  termId: string;
  GPA: string;
  CPA: string;
  passCredits: number;
  accumulatedCredits: string;
  debtCredits: number;
  registeredCredits: number;
  studentLevel: string;
  warningLevel: string;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    studentId?: string;
    termId?: string;
    GPA?: string;
    CPA?: string;
    passCredits?: number;
    accumulatedCredits?: string;
    debtCredits?: number;
    registeredCredits?: number;
    studentLevel?: string;
    warningLevel?: string;
    createdAt?: number;
  }) {
    this._id = o._id;
    this.studentId = o.studentId;
    this.termId = o.termId;
    this.GPA = o.GPA;
    this.CPA = o.CPA;
    this.passCredits = o.passCredits;
    this.accumulatedCredits = o.accumulatedCredits;
    this.debtCredits = o.debtCredits;
    this.registeredCredits = o.registeredCredits;
    this.studentLevel = o.studentLevel;
    this.warningLevel = o.warningLevel;
    this.createdAt = o.createdAt;
  }
}

export class StudentLanguageResult {
  _id: ObjectId;
  studentId: string;
  name: string;
  dob: string;
  termId: string;
  note: string;
  date: string;
  listening: string;
  reading: string;
  total: string;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    studentId?: string;
    name?: string;
    dob?: string;
    termId?: string;
    note?: string;
    date?: string;
    listening?: string;
    reading?: string;
    total?: string;
    createdAt?: number;
  }) {
    this._id = o._id;
    this.studentId = o.studentId;
    this.name = o.name;
    this.dob = o.dob;
    this.termId = o.termId;
    this.note = o.note;
    this.date = o.date;
    this.listening = o.listening;
    this.reading = o.reading;
    this.total = o.total;
    this.createdAt = o.createdAt;
  }
}

export class OverallResult {
  _id: ObjectId;
  studentId: string;
  StudentGrades: [];
  studentLearningResults: [];
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    studentId?: string;
    StudentGrades?: [];
    studentLearningResults?: [];
    createdAt?: number;
  }) {
    this._id = o._id;
    this.studentId = o.studentId;
    this.StudentGrades = o.StudentGrades;
    this.studentLearningResults = o.studentLearningResults;
    this.createdAt = o.createdAt;
  }
}

export class Settings {
  termIds: string[] = [];
  renewTokenEvery: string; // use ms lib
  refreshJobEvery: string; // use ms lib
  crawl_cycle: string;
  dkhptd_cycle: string;
  from: string;
  to: string;
  constructor(o?: {
    _id?: ObjectId;
    termIds?: string[];
    renewTokenEvery?: string; // use ms lib
    refreshJobEvery?: string; // use ms lib
    crawl_cycle?: string;
    dkhptd_cycle?: string;
    from?: string;
    to?: string;
  }) {
    this.termIds = o?.termIds || [];
    this.renewTokenEvery = o?.renewTokenEvery || '1m'; // 1 minute
    this.refreshJobEvery = o?.refreshJobEvery || '1s'; // 1 second
    this.crawl_cycle = o?.crawl_cycle || '1d';
    this.dkhptd_cycle = o?.dkhptd_cycle || '1h';
    this.from = o?.from;
    this.to = o?.to;
  }

  addTermIds(termIds: string[]) {
    this.termIds.push(...termIds);
    this.termIds = Array.from(new Set(this.termIds)).sort((a, b) =>
      a.localeCompare(b)
    );
  }

  replaceTermIds(termIds: string[]) {
    this.termIds = Array.from(new Set(termIds)).sort((a, b) =>
      a.localeCompare(b)
    );
  }

  addJobCycle(crawl_cycle: string, dkhptd_cycle: string) {
    this.crawl_cycle = crawl_cycle;
    this.dkhptd_cycle = dkhptd_cycle;
  }

  addDkhptdTime(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}

export class RequestLog {
  _id: ObjectId;
  timestamp: string;
  level: string;
  message: string;
  meta: string;

  constructor(o: {
    _id?: ObjectId;
    timestamp?: string;
    level?: string;
    message?: string;
    meta?: string;
  }) {
    this._id = o._id;
    this.timestamp = o.timestamp;
    this.level = o.level;
    this.message = o.message;
    this.meta = o.meta;
  }
}

// ======================================================

export class AccountPreference {
  _id: ObjectId;
  termId: string;
  wantedSubjectIds: string[];
  ownerAccountId: ObjectId;

  constructor(o: {
    _id?: ObjectId;
    termId?: string;
    ownerAccountId: ObjectId;
    wantedSubjectIds?: string[];
  }) {
    this._id = o._id;
    this.termId = o.termId;
    this.wantedSubjectIds = o.wantedSubjectIds;
    this.ownerAccountId = o.ownerAccountId;
  }
}

export class ClassToRegister {
  classId: number;
  secondClassId: number;
  learnDayNumber: number;
  classType: string;
  subjectId: string;
  subjectName: string;
  learnAtDayOfWeek: number;
  learnTime: string;
  learnRoom: string;
  learnWeek: string;
  describe: string;
  termId: string;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    classId?: number;
    secondClassId?: number;
    learnDayNumber?: number;
    classType?: string;
    subjectId?: string;
    subjectName?: string;
    learnAtDayOfWeek?: number;
    learnTime?: string;
    learnRoom?: string;
    learnWeek?: string;
    describe?: string;
    termId?: string;
    createdAt?: number;
  }) {
    this.classId = o.classId;
    this.secondClassId = o.secondClassId;
    this.classType = o.classType;
    this.subjectId = o.subjectId;
    this.subjectName = o.subjectName;
    this.learnDayNumber = o.learnDayNumber;
    this.learnAtDayOfWeek = o.learnAtDayOfWeek;
    this.learnTime = o.learnTime;
    this.learnRoom = o.learnRoom;
    this.learnWeek = o.learnWeek;
    this.describe = o.describe;
    this.termId = o.termId;
    this.createdAt = o.createdAt;
  }
}

export class DKHPTDJob {
  _id: ObjectId;
  ownerAccountId: ObjectId;
  username: string;
  password: string;
  classIds: string[];
  timeToStart: number;
  status: number;
  createdAt: number;
  doingAt: number;
  termId: string;

  constructor(o: {
    _id?: ObjectId;
    ownerAccountId?: ObjectId;
    username?: string;
    password?: string;
    classIds?: string[];
    timeToStart?: number;
    status?: number;
    createdAt?: number;
    doingAt?: number;
    termId?: string;
  }) {
    this._id = o._id;
    this.ownerAccountId = o.ownerAccountId;
    this.username = o.username;
    this.password = o.password;
    this.classIds = o.classIds;
    this.timeToStart = o.timeToStart;
    this.status = o.status;
    this.createdAt = o.createdAt;
    this.doingAt = o.doingAt;
    this.termId = o.termId;
  }
}

export class DKHPTDJobV2 {
  _id: ObjectId;
  ownerAccountId: ObjectId;
  username: string;
  password: string;
  classIds: string[][];
  timeToStart: number;
  status: number;
  createdAt: number;
  doingAt: number;
  iv: string;

  constructor(o: {
    _id?: ObjectId;
    username?: string;
    password?: string;
    classIds?: string[][];
    timeToStart?: number;
    ownerAccountId?: ObjectId;
    status?: number;
    createdAt?: number;
    doingAt?: number;
    iv?: string;
  }) {
    this._id = o._id;
    this.ownerAccountId = o.ownerAccountId;
    this.username = o.username;
    this.password = o.password;
    this.classIds = o.classIds;
    this.timeToStart = o.timeToStart;
    this.status = o.status;
    this.createdAt = o.createdAt;
    this.doingAt = o.doingAt;
    this.iv = o.iv;
  }
}

export class DKHPTDJobResult {
  _id: ObjectId;
  jobId: ObjectId;
  workerId: string;
  ownerAccountId: ObjectId;
  logs: [];
  vars: unknown;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    jobId?: ObjectId;
    ownerAccountId?: ObjectId;
    workerId?: string;
    logs?: [];
    createdAt?: number;
    vars?: unknown;
  }) {
    this._id = o._id;
    this.jobId = o.jobId;
    this.workerId = o.workerId;
    this.ownerAccountId = o.ownerAccountId;
    this.logs = o.logs;
    this.vars = o.vars;
    this.createdAt = o.createdAt;
  }
}

export class DKHPTDJobV2Result {
  _id: ObjectId;
  jobId: ObjectId;
  workerId: string;
  ownerAccountId: ObjectId;
  logs: string; // encrypted
  vars: string; // encrypted
  iv: string;
  createdAt: number;

  constructor(o: {
    _id?: ObjectId;
    jobId?: ObjectId;
    ownerAccountId?: ObjectId;
    workerId?: string;
    logs?: string;
    vars?: string;
    createdAt?: number;
    iv?: string;
  }) {
    this._id = o._id;
    this.jobId = o.jobId;
    this.workerId = o.workerId;
    this.ownerAccountId = o.ownerAccountId;
    this.logs = o.logs;
    this.vars = o.vars;
    this.createdAt = o.createdAt;
    this.iv = o.iv;
  }
}

export class Timestamp {
  n: number;
  s: string;

  constructor(date = new Date()) {
    this.n = date.getTime();
    this.s = date.toString();
  }
}

export class Subject {
  subjectId: string;
  subjectName?: string;
  constructor(o: { _id?: ObjectId; subjectId: string; subjectName?: string }) {
    this.subjectId = o.subjectId;
    this.subjectName = o.subjectName;
  }
}
