import { bus } from '../bus';
import { cfg, CollectionName, JobStatus, AppEvent } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { JobCrawl } from 'shared-entities';
import logger from '../loggers/logger';

export const setup = () => {
  bus.on(AppEvent.JOB_CRAWL_USER_ERROR, async (result, job: JobCrawl) => {
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL)
      .updateOne({ _id: job._id }, { $set: { status: JobStatus.FAILED } });
    logger.info(`Job crawl ${job._id} failed because of userError`);
  });
};
