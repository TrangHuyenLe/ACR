import { mongoConnectionPool } from 'shared-connections';
import { Settings } from 'shared-entities';
import { toNormalizedString } from 'shared-utils';
class CachedSettings {
  settings: Settings;

  constructor() {
    this.settings = new Settings();
  }

  async loadFromDb() {
    const doc = await mongoConnectionPool
      .getClient()
      .db('Automatic_Course_Registration_System')
      .collection(CollectionName.SETTINGS)
      .findOne();
    if (!doc) {
      return (this.settings = new Settings());
    }
    return (this.settings = new Settings(doc));
  }
  getAllSettings() {
    return this.settings;
  }

  addJobCycle(crawl_cycle: string, dkhptd_cycle: string) {
    this.settings.addJobCycle(crawl_cycle, dkhptd_cycle);
  }

  addDkhptdTime(from: string, to: string) {
    this.settings.addDkhptdTime(from, to);
  }

  addTermIds(termIds: string[]) {
    this.settings.addTermIds(
      Array.from(new Set(termIds.map(x => toNormalizedString(x)))).sort(
        (a, b) => a.localeCompare(b)
      )
    );
  }

  replaceTermIds(termIds: string[]) {
    this.settings.replaceTermIds(
      Array.from(new Set(termIds.map(x => toNormalizedString(x)))).sort(
        (a, b) => a.localeCompare(b)
      )
    );
  }

  getTermIds() {
    return this.settings.termIds;
  }
  async save() {
    return mongoConnectionPool
      .getClient()
      .db('Automatic_Course_Registration_System')
      .collection(CollectionName.SETTINGS)
      .replaceOne({}, this.settings, { upsert: true });
  }
}

let cachedSettings: CachedSettings;

const getMySettings = () => {
  if (!cachedSettings) {
    cachedSettings = new CachedSettings();
  }
  return cachedSettings;
};

export { getMySettings };

export const JobStatus = {
  READY: 0,
  DOING: 1,
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
  SETTINGS: 'settings',
  SUBJECT: 'subject',
  REQUEST_LOG: 'request-log',
};

export const ExchangeName = {
  WORKER_PING: 'worker-ping',
  WORKER_DOING: 'worker-doing',
  MAYBE_STALE_JOB: 'maybe-stale-job',
  MAYBE_STALE_JOB_V1: 'maybe-stale-job-v1',
  MAYBE_STALE_JOB_V2: 'maybe-stale-job-v2',
};

export const QueueName = {
  RUN_JOB: 'run-job',
  PROCESS_JOB_RESULT: 'process-job-result',

  RUN_JOB_V1: 'run-job-v1',
  PROCESS_JOB_V1_RESULT: 'process-job-v1-result',

  RUN_JOB_V2: 'run-job-v2',
  PROCESS_JOB_V2_RESULT: 'process-job-v2-result',

  CRAWL: 'crawl',
  CRAWL_RESULT: 'crawl-result',

  PARSE_TKB_XLSX: 'parse-tkb-xslx',
  PROCESS_PARSE_TKB_XLSX_RESULT: 'process-parse-tkb-xlsx-result',
};
