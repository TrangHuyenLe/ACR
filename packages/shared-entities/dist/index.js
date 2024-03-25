"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = exports.Timestamp = exports.DKHPTDJobV2Result = exports.DKHPTDJobResult = exports.DKHPTDJobV2 = exports.DKHPTDJob = exports.ClassToRegister = exports.AccountPreference = exports.RequestLog = exports.Settings = exports.OverallResult = exports.StudentLanguageResult = exports.StudentLearningResult = exports.StudentGrade = exports.Student = exports.DKHPTDJobV1Result = exports.DKHPTDJobV1 = exports.JobCrawlResult = exports.JobCrawl = exports.Account = void 0;
class Account {
    constructor(o) {
        this._id = o._id;
        this.username = o.username;
        this.name = o.name;
        this.password = o.password;
        this.role = o.role;
    }
}
exports.Account = Account;
class JobCrawl {
    constructor(o) {
        this._id = o._id;
        this.ownerAccountId = o.ownerAccountId;
        this.username = o.username;
        this.password = o.password;
        this.status = o.status;
        this.no = o.no || 0;
        this.iv = o.iv;
    }
}
exports.JobCrawl = JobCrawl;
class JobCrawlResult {
    constructor(o) {
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
exports.JobCrawlResult = JobCrawlResult;
class DKHPTDJobV1 {
    constructor(o) {
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
exports.DKHPTDJobV1 = DKHPTDJobV1;
class DKHPTDJobV1Result {
    constructor(o) {
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
exports.DKHPTDJobV1Result = DKHPTDJobV1Result;
class Student {
    constructor(o) {
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
exports.Student = Student;
class StudentGrade {
    constructor(o) {
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
exports.StudentGrade = StudentGrade;
class StudentLearningResult {
    constructor(o) {
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
exports.StudentLearningResult = StudentLearningResult;
class StudentLanguageResult {
    constructor(o) {
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
exports.StudentLanguageResult = StudentLanguageResult;
class OverallResult {
    constructor(o) {
        this._id = o._id;
        this.studentId = o.studentId;
        this.StudentGrades = o.StudentGrades;
        this.studentLearningResults = o.studentLearningResults;
        this.createdAt = o.createdAt;
    }
}
exports.OverallResult = OverallResult;
class Settings {
    constructor(o) {
        this.termIds = [];
        this.termIds = o?.termIds || [];
        this.renewTokenEvery = o?.renewTokenEvery || '1m'; // 1 minute
        this.refreshJobEvery = o?.refreshJobEvery || '1s'; // 1 second
        this.crawl_cycle = o?.crawl_cycle || '1d';
        this.dkhptd_cycle = o?.dkhptd_cycle || '1h';
        this.from = o?.from;
        this.to = o?.to;
    }
    addTermIds(termIds) {
        this.termIds.push(...termIds);
        this.termIds = Array.from(new Set(this.termIds)).sort((a, b) => a.localeCompare(b));
    }
    replaceTermIds(termIds) {
        this.termIds = Array.from(new Set(termIds)).sort((a, b) => a.localeCompare(b));
    }
    addJobCycle(crawl_cycle, dkhptd_cycle) {
        this.crawl_cycle = crawl_cycle;
        this.dkhptd_cycle = dkhptd_cycle;
    }
    addDkhptdTime(from, to) {
        this.from = from;
        this.to = to;
    }
}
exports.Settings = Settings;
class RequestLog {
    constructor(o) {
        this._id = o._id;
        this.timestamp = o.timestamp;
        this.level = o.level;
        this.message = o.message;
        this.meta = o.meta;
    }
}
exports.RequestLog = RequestLog;
// ======================================================
class AccountPreference {
    constructor(o) {
        this._id = o._id;
        this.termId = o.termId;
        this.wantedSubjectIds = o.wantedSubjectIds;
        this.ownerAccountId = o.ownerAccountId;
    }
}
exports.AccountPreference = AccountPreference;
class ClassToRegister {
    constructor(o) {
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
exports.ClassToRegister = ClassToRegister;
class DKHPTDJob {
    constructor(o) {
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
exports.DKHPTDJob = DKHPTDJob;
class DKHPTDJobV2 {
    constructor(o) {
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
exports.DKHPTDJobV2 = DKHPTDJobV2;
class DKHPTDJobResult {
    constructor(o) {
        this._id = o._id;
        this.jobId = o.jobId;
        this.workerId = o.workerId;
        this.ownerAccountId = o.ownerAccountId;
        this.logs = o.logs;
        this.vars = o.vars;
        this.createdAt = o.createdAt;
    }
}
exports.DKHPTDJobResult = DKHPTDJobResult;
class DKHPTDJobV2Result {
    constructor(o) {
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
exports.DKHPTDJobV2Result = DKHPTDJobV2Result;
class Timestamp {
    constructor(date = new Date()) {
        this.n = date.getTime();
        this.s = date.toString();
    }
}
exports.Timestamp = Timestamp;
class Subject {
    constructor(o) {
        this.subjectId = o.subjectId;
        this.subjectName = o.subjectName;
    }
}
exports.Subject = Subject;
