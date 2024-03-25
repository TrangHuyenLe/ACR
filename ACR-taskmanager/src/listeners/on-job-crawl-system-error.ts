import { bus } from '../bus';
import { cfg, CollectionName, JobStatus, AppEvent } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { JobCrawl } from 'shared-entities';
import logger from '../loggers/logger';
import ms from 'ms';

export const setup = () => {
  bus.on(AppEvent.JOB_CRAWL_SYSTEM_ERROR, async (result, job: JobCrawl) => {
    if (job.no > cfg.JOB_MAX_TRY) {
      // max tries reach
      logger.info(`Max retry reach for job crawl ${job._id}`);
      await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.JOB_CRAWL)
        .updateOne(
          { _id: job._id },
          { $set: { status: JobStatus.MAX_RETRY_REACH } }
        );
      return;
    }
    logger.info(`Retry job crawl ${job._id} because of systemError`);
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL)
      .updateOne(
        { _id: job._id },
        {
          $set: {
            status: JobStatus.READY,
          },
        }
      ); // set READY and delay 1p for scheduler retry it
  });
};
