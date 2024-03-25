import { bus } from '../bus';
import { cfg, CollectionName, JobStatus, AppEvent } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { JobCrawl } from 'shared-entities';

export const setup = () => {
  bus.on(AppEvent.JOB_CRAWL_UNKNOWN_ERROR, async (result, job: JobCrawl) => {
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL)
      .updateOne(
        { _id: job._id },
        { $set: { status: JobStatus.UNKOWN_ERROR } }
      );
  });
};
