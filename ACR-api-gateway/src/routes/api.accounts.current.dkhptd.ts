import express from 'express';
import { ObjectId } from 'mongodb';
import { cfg, CollectionName, JobStatus } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { DKHPTDJob } from 'shared-entities';
import {
  EmptyStringError,
  FalsyValueError,
  MissingRequestBodyDataError,
  NotAnArrayError,
  RequireLengthFailed,
} from '../exceptions';
import { ExceptionWrapper, JwtFilter } from '../middlewares';
import { RateLimit } from '../middlewares';
import { modify, m } from '../modifiers';
import { BaseResponse } from '../payloads';
import { isEmpty, isFalsy } from '../utils';

export const router = express.Router();

router.post(
  '/api/accounts/current/dkhptd',
  JwtFilter(cfg.SECRET),
  RateLimit({ windowMs: 5 * 60 * 1000, max: 5 }),
  ExceptionWrapper(async (req, resp) => {
    const data = req.body;

    if (isFalsy(data)) throw new MissingRequestBodyDataError();

    const ownerAccountId = new ObjectId(req.__accountId);
    const safeData = modify(data, [
      m.pick(['username', 'password', 'classIds', 'timeToStart']),
      m.normalizeString('username'),
      m.normalizeString('password'),
      m.normalizeArray('classIds', 'string'),
      m.normalizeInt('timeToStart'),
      m.set('createdAt', Date.now()),
      m.set('status', JobStatus.READY),
      m.set('ownerAccountId', ownerAccountId),
    ]);

    const job = new DKHPTDJob(safeData);

    if (isFalsy(job.username)) throw new FalsyValueError('job.username');
    if (isEmpty(job.username)) throw new EmptyStringError('job.username');
    if (job.username.length < 8)
      throw new RequireLengthFailed('job.username', job.username);

    if (isFalsy(job.password)) throw new FalsyValueError('job.password');
    if (isEmpty(job.password)) throw new EmptyStringError('job.password');

    if (isFalsy(job.classIds)) throw new FalsyValueError('job.classIds');
    if (!Array.isArray(job.classIds)) throw new NotAnArrayError('job.classIds');
    if (job.classIds.length == 0)
      throw new RequireLengthFailed('job.classIds', job.username);

    if (isFalsy(job.timeToStart)) throw new FalsyValueError('job.timeToStart');

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTD)
      .insertOne(job);
    resp.send(new BaseResponse().ok(job));
  })
);
