import { bus } from '../bus';
import { cfg, CollectionName, JobStatus, AppEvent } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { DKHPTDJobV1 } from 'shared-entities';
import logger from '../loggers/logger';

export const setup = () => {
  bus.on(AppEvent.JOB_V1_USER_ERROR, async (result, job: DKHPTDJobV1) => {
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .updateOne({ _id: job._id }, { $set: { status: JobStatus.FAILED } });
    logger.info(`Job V1 ${job._id} failed because of userError`);
  });
};
