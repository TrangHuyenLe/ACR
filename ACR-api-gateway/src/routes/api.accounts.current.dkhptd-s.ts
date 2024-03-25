import express from 'express';
import { Filter, ObjectId } from 'mongodb';
import { cfg, CollectionName, JobStatus } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper } from '../middlewares';
import { RateLimit } from '../middlewares';
import { modify, m } from '../modifiers';
import { BaseResponse } from '../payloads';
import { resolveMongoFilter } from '../merin';
import { isFalsy } from '../utils';
import { isEmpty } from 'lodash';
import {
  FalsyValueError,
  EmptyStringError,
  RequireLengthFailed,
  JobNotFoundError,
  NotAnArrayError,
} from '../exceptions';
import { DKHPTDJob } from 'shared-entities';

export const router = express.Router();

router.get(
  '/api/accounts/current/dkhptd-s',
  ExceptionWrapper(async (req, resp) => {
    const query = modify(req.query, [m.pick(['q'], { dropFalsy: true })]);
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJob> = query.q
      ? resolveMongoFilter(query.q.split(','))
      : {};
    filter.ownerAccountId = new ObjectId(accountId);
    const jobs = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .find(filter)
      .toArray();

    const data = jobs.map(x => new DKHPTDJob(x));
    resp.send(new BaseResponse().ok(data));
  })
);

router.post(
  '/api/accounts/current/dkhptd-s',
  RateLimit({ windowMs: 5 * 60 * 1000, max: 1 }),
  ExceptionWrapper(async (req, resp) => {
    const data = req.body?.data;

    if (isFalsy(data)) throw new FalsyValueError('body.data');
    if (!Array.isArray(data)) throw new NotAnArrayError('body.data');

    const ownerAccountId = new ObjectId(req.__accountId);
    const result = [];
    const jobsToInsert = [];

    for (const entry of data) {
      try {
        const safeEntry = modify(entry, [
          m.pick(['username', 'password', 'classIds', 'timeToStart']),
          m.normalizeString('username'),
          m.normalizeString('password'),
          m.normalizeArray('classIds', 'string'),
          m.normalizeInt('timeToStart'),
          m.set('createdAt', Date.now()),
          m.set('status', JobStatus.READY),
          m.set('ownerAccountId', ownerAccountId),
        ]);

        const job = new DKHPTDJob(safeEntry);

        if (isFalsy(job.username))
          throw new FalsyValueError('job.username', job.username);
        if (isEmpty(job.username))
          throw new EmptyStringError('job.username', job.username);
        if (job.username.length < 8)
          throw new RequireLengthFailed('job.username', job.username);

        if (isFalsy(job.password))
          throw new FalsyValueError('job.password', job.password);
        if (isEmpty(job.password))
          throw new EmptyStringError('job.password', job.password);

        if (isFalsy(job.classIds)) throw new FalsyValueError('job.classIds');
        if (job.classIds.length == 0)
          throw new RequireLengthFailed('job.classIds');

        if (isFalsy(job.timeToStart))
          throw new FalsyValueError('job.timeToStart');

        jobsToInsert.push(job);
        result.push(new BaseResponse().ok(job));
      } catch (err) {
        if (err.__isSafeError) {
          result.push(err.toBaseResponse());
        } else {
          result.push(new BaseResponse().failed(err).m(err.message));
        }
      }
    }

    if (jobsToInsert.length !== 0) {
      await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.DKHPTD)
        .insertMany(jobsToInsert);
    }
    resp.send(new BaseResponse().ok(result));
  })
);

router.delete(
  '/api/accounts/current/dkhptd-s/:jobId',
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJob> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .deleteOne(filter);
    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);

// use PUT instead
router.post(
  '/api/accounts/current/dkhptd-s/:jobId/retry',
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJob> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };

    const existedJob = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .findOne(filter);

    if (isFalsy(existedJob)) throw new JobNotFoundError(req.params.jobId);

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .updateOne(
        { _id: new ObjectId(existedJob._id) },
        { $set: { status: JobStatus.READY } }
      );

    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);

router.put(
  '/api/accounts/current/dkhptd-s/:jobId/retry',
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJob> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };

    const existedJob = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .findOne(filter);

    if (isFalsy(existedJob)) throw new JobNotFoundError(req.params.jobId);

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .updateOne(
        { _id: new ObjectId(existedJob._id) },
        { $set: { status: JobStatus.READY } }
      );

    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);

router.put(
  '/api/accounts/current/dkhptd-s/:jobId/cancel',
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJob> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .findOneAndUpdate(filter, { $set: { status: JobStatus.CANCELED } });
    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);
