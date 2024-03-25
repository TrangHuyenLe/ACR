import * as dotenv from 'dotenv';
import { nextStr } from './next';

dotenv.config();

export const cfg = {
  SECRET: process.env.SECRET || String(Math.round(Math.random() * Date.now())),
  JOB_ENCRYPTION_KEY: process.env.JOB_ENCRYPTION_KEY,
  AMQP_ENCRYPTION_KEY: process.env.AMQP_ENCRYPTION_KEY,
  LOG_DIR: process.env.LOG_DIR || './logs',
  RABBITMQ_CONNECTION_STRING:
    process.env.RABBITMQ_CONNECTION_STRING || 'amqp://localhost:5672',
  MONGODB_CONNECTION_STRING:
    process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017',
  DATABASE_NAME: process.env.DATABASE_NAME || 'dkhptd',
  JOB_MAX_TRY: 100,
  LOG_WORKER_DOING: parseInt(process.env.LOG_WORKER_DOING),
  LOG_WORKER_PING: parseInt(process.env.LOG_WORKER_PING),
};

export const JobStatus = {
  READY: 0,
  DOING: 1,
  PENDING: 2,
  CANCELED: 20,
  DONE: 21,
  FAILED: 22,
  TIMEOUT_OR_STALE: 23,
  UNKOWN_ERROR: 30,
  MAX_RETRY_REACH: 24,
};

export const CollectionName = {
  ACCOUNT: 'account',
  CTR: 'classToRegister',
  PREFERENCE: 'preference',
  DKHPTD: 'dkhptd',
  DKHPTDResult: 'dkhptdResult',
  DKHPTDV1: 'dkhptdV1',
  DKHPTDV1Result: 'dkhptdV1Result',
  DKHPTDV2: 'dkhptdV2',
  DKHPTDV2Result: 'dkhptdV2Result',
  JOB_CRAWL: 'job-crawl',
  JOB_CRAWL_RESULT: 'job-crawl-result',
  STUDENT: 'student',
  STUDENT_LANGUAGE_RESULT: 'student-language-result',
  STUDENT_GRADE: 'student-grade',
  STUDENT_LEARNING_RESULT: 'student-learning-result',
};

export const QueueName = {
  RUN_JOB: 'run-job',
  PROCESS_JOB_RESULT: 'process-job-result',
  RUN_JOB_V1: 'run-job-v1',
  PROCESS_JOB_V1_RESULT: 'process-job-v1-result',
  RUN_JOB_V2: 'run-job-v2',
  PROCESS_JOB_V2_RESULT: 'process-job-v2-result',
  CRAWL_RESULT: 'crawl-result',
};

export const ExchangeName = {
  WORKER_PING: 'worker-ping',
  WORKER_DOING: 'worker-doing',
  MAYBE_STALE_JOB: 'maybe-stale-job',
  MAYBE_STALE_JOB_V1: 'maybe-stale-job-v1',
  MAYBE_STALE_JOB_V2: 'maybe-stale-job-v2',
  MAYBE_STALE_JOB_CRAWL: 'maybe-stale-job-crawl',
};

export const AppEvent = {
  NEW_JOB: nextStr(),
  NEW_JOB_RESULT: nextStr(),
  STALE_JOB: nextStr(),
  NEW_JOB_V1: nextStr(),
  NEW_JOB_V1_RESULT: nextStr(), // deprecated
  JOB_V1_UNKNOWN_ERROR: nextStr(),
  JOB_V1_SYSTEM_ERROR: nextStr(),
  JOB_V1_CAPTCHA_ERROR: nextStr(),
  JOB_V1_USER_ERROR: nextStr(),
  JOB_V1_SESSION_ERROR: nextStr(),
  JOB_V1_DONE: nextStr(),
  JOB_CRAWL_UNKNOWN_ERROR: nextStr(),
  JOB_CRAWL_SYSTEM_ERROR: nextStr(),
  JOB_CRAWL_CAPTCHA_ERROR: nextStr(),
  JOB_CRAWL_USER_ERROR: nextStr(),
  JOB_CRAWL_DONE: nextStr(),
  NEW_JOB_V2: nextStr(),
  NEW_JOB_V2_RESULT: nextStr(),
  STALE_JOB_V2: nextStr(),
};

export const SchoolName = {
  'truong co khi': 'sme',
  'vien cong nghe sinh hoc va cong nghe thuc pham': 'sbft',
  'truong cong nghe thong tin va truyen thong': 'soict',
  'vien det may - da giay va thoi trang': 'stlf',
  'vien khoa hoc va cong nghe moi truong': 'sest',
  'vien khoa hoc va ky thuat vat lieu': 'smse',
  'vien kinh te va quan ly': 'sem',
  'vien ky thuat hoa hoc': 'sce',
  'vien ngoai ngu': 'sofl',
  'vien su pham ky thuat': 'sepd',
  'vien toan ung dung va tin hoc': 'sami',
  'vien vat ly ky thuat': 'sep',
  'truong dien - dien tu': 'seee',
};
