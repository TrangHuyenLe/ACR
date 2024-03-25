import { bus } from '../bus';
import { cfg, CollectionName, JobStatus, AppEvent } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { DKHPTDJobV1 } from 'shared-entities';

export const setup = () => {
  // user error + captcha error + no error
  bus.on(AppEvent.JOB_V1_DONE, async (result, job: DKHPTDJobV1) => {
    console.log(result.vars.registerResult);
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .updateOne({ _id: job._id }, { $set: { status: JobStatus.DONE } });
  });
};
