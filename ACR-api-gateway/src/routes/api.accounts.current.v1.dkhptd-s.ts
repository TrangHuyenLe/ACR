import { Filter, ObjectId } from 'mongodb';
import express from 'express';
import { cfg, CollectionName, JobStatus } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter } from '../middlewares';
import { modify, m } from '../modifiers';
import { BaseResponse } from '../payloads';
import { resolveMongoFilter } from '../merin';
import { RateLimit } from '../middlewares';
import {
  FalsyValueError,
  NotAnArrayError,
  JobNotFoundError,
  EmptyStringError,
  RequireLengthFailed,
  OutOfTryError,
} from '../exceptions';
import { isEmpty, isFalsy } from '../utils';
import { decryptJobV1Result } from '../dto';
import {
  DKHPTDJobV1,
  DKHPTDJobResult,
  DKHPTDJobV1Result,
} from 'shared-entities';
import { encryptJobV1 } from '../dto';
import { dkhptdJob } from '../validators';

export const router = express.Router();

router.get(
  '/api/accounts/current/v1/dkhptd-s/:jobId/results',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const query = modify(req.query, [m.pick(['q'], { dropFalsy: true })]);
    const accountId = req.__accountId;

    const filter: Filter<DKHPTDJobV1Result> = query.q
      ? resolveMongoFilter(query.q.split(','))
      : {};
    filter.ownerAccountId = new ObjectId(accountId);
    filter.jobId = new ObjectId(req.params.jobId);

    const logs = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1Result)
      .find(filter)
      .toArray();
    const data = logs.map(x => new DKHPTDJobV1Result(x));
    resp.send(new BaseResponse().ok(data));
  })
);

router.get(
  '/api/accounts/current/v1/dkhptd-s/:jobId/d/results',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const query = modify(req.query, [m.pick(['q'], { dropFalsy: true })]);
    const accountId = req.__accountId;

    const filter: Filter<DKHPTDJobV1Result> = query.q
      ? resolveMongoFilter(query.q.split(','))
      : {};
    filter.ownerAccountId = new ObjectId(accountId);
    filter.jobId = new ObjectId(req.params.jobId);

    const logs = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1Result)
      .find(filter)
      .toArray();
    const data = logs.map(
      x => new DKHPTDJobResult(decryptJobV1Result(new DKHPTDJobV1Result(x)))
    );
    resp.send(new BaseResponse().ok(data));
  })
);

router.get(
  '/api/accounts/current/v1/dkhptd-s',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const query = modify(req.query, [m.pick(['q'], { dropFalsy: true })]);
    const accountId = req.__accountId;

    const filter: Filter<DKHPTDJobV1> = query.q
      ? resolveMongoFilter(query.q.split(','))
      : {};
    filter.ownerAccountId = new ObjectId(accountId);

    const jobs = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .find(filter)
      .toArray();
    const data = jobs.map(x => new DKHPTDJobV1(x));
    resp.send(new BaseResponse().ok(data));
  })
);

router.post(
  '/api/accounts/current/v1/dkhptd-s',
  JwtFilter(cfg.SECRET),
  // RateLimit({ windowMs: 5 * 60 * 1000, max: 1 }),
  dkhptdJob,
  ExceptionWrapper(async (req, resp) => {
    const data = req.body?.classIds;
    if (isFalsy(data)) throw new FalsyValueError('body.classIds');
    if (!Array.isArray(data)) throw new NotAnArrayError('body.classIds');
    const { username, password, termId, timeToStart, priority } = modify(
      req.body,
      [
        m.pick(['username', 'password', 'timeToStart', 'termId', 'priority'], {
          dropFalsy: true,
        }),
        m.normalizeString('username'),
        m.normalizeString('password'),
        m.normalizeInt('timeToStart'),
        m.normalizeString('termId'),
      ]
    );

    const ownerAccountId = new ObjectId(req.__accountId);
    const result = [];
    const jobsToInsert = [];

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .deleteMany({ username, termId });

    for (const entry of data) {
      try {
        const safeEntry = modify(entry, [
          m.set('classIds', entry),
          m.set('createdAt', Date.now()),
          m.set('status', JobStatus.READY),
          m.set('ownerAccountId', ownerAccountId),
          m.set('username', username),
          m.set('password', password),
          m.set('termId', termId),
          m.set('timeToStart', timeToStart),
          m.set('priority', priority),
        ]);

        const job = new DKHPTDJobV1(safeEntry);
        job.originTimeToStart = job.timeToStart;

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
        if (isFalsy(job.termId)) throw new FalsyValueError('job.termId');

        jobsToInsert.push(job);
        job.priority = undefined;
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
      const eJobsToInsert = jobsToInsert.map(x => encryptJobV1(x));
      let tmpNextJobId = null;
      let jobStatus = JobStatus.PENDING;
      for (let i = eJobsToInsert.length - 1; i >= 0; i--) {
        if (i == 0) {
          jobStatus = JobStatus.READY;
        }
        const newJob = await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.DKHPTDV1)
          .insertOne({
            ...eJobsToInsert[i],
            priority: priority || i,
            nextJobId: tmpNextJobId,
            status: jobStatus,
          });

        tmpNextJobId = newJob.insertedId;
      }
    }
    resp.send(new BaseResponse().ok(result));
  })
);

router.post(
  '/api/accounts/current/v1/dkhptd-s/:jobId/retry',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJobV1> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };
    const doc = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .findOne(filter);

    if (!doc) throw new JobNotFoundError(req.params.jobId);
    const existedJob = new DKHPTDJobV1(doc);
    if (existedJob.no > 10) throw new OutOfTryError(existedJob._id);

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .updateOne(
        { _id: new ObjectId(existedJob._id) },
        { $set: { status: JobStatus.READY } }
      );

    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);

router.put(
  '/api/accounts/current/v1/dkhptd-s/:jobId/cancel',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJobV1> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .findOneAndUpdate(filter, { $set: { status: JobStatus.CANCELED } });
    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);

router.delete(
  '/api/accounts/current/v1/dkhptd-s/:jobId',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const filter: Filter<DKHPTDJobV1> = {
      _id: new ObjectId(req.params.jobId),
      ownerAccountId: new ObjectId(accountId),
    };
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .deleteOne(filter);
    resp.send(new BaseResponse().ok(req.params.jobId));
  })
);
