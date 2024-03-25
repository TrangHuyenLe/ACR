import { ObjectId } from 'mongodb';
import express from 'express';
import { isEmpty } from 'lodash';
import { JobStatus, cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { DKHPTDJobV1 } from 'shared-entities';
import {
  MissingRequestBodyDataError,
  FalsyValueError,
  EmptyStringError,
  RequireLengthFailed,
  InvalidTermIdError,
} from '../exceptions';
import { ExceptionWrapper, InjectTermId, JwtFilter } from '../middlewares';
import { RateLimit } from '../middlewares';
import { BaseResponse } from '../payloads';
import { modify, m } from '../modifiers';
import { isFalsy, isValidTermId } from '../utils';
import { encryptJobV1 } from '../dto';

export const router = express.Router();

router.post(
  '/api/accounts/current/term-ids/:termId/v1/dkhptd',
  JwtFilter(cfg.SECRET),
  InjectTermId(),
  RateLimit({ windowMs: 5 * 60 * 1000, max: 5 }),
  ExceptionWrapper(async (req, resp) => {
    const data = req.body;
    const termId = req.__termId;

    if (isFalsy(data)) throw new MissingRequestBodyDataError();
    if (isFalsy(termId)) throw new FalsyValueError('termId');
    if (!isValidTermId(termId)) throw new InvalidTermIdError(termId);

    const ownerAccountId = new ObjectId(req.__accountId);
    const safeEntry = modify(data, [
      m.pick(['username', 'password', 'classIds', 'timeToStart']),
      m.normalizeString('username'),
      m.normalizeString('password'),
      m.normalizeArray('classIds', 'string'),
      m.normalizeInt('timeToStart'),
      m.set('termId', termId),
      m.set('createdAt', Date.now()),
      m.set('status', JobStatus.READY),
      m.set('ownerAccountId', ownerAccountId),
    ]);

    const job = new DKHPTDJobV1(safeEntry);
    job.originTimeToStart = job.timeToStart;
    job.termId = termId;

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
    if (job.classIds.length == 0) throw new RequireLengthFailed('job.classIds');

    if (isFalsy(job.timeToStart)) throw new FalsyValueError('job.timeToStart');
    if (isFalsy(job.termId)) throw new FalsyValueError('job.termId');

    const eJob = new DKHPTDJobV1(encryptJobV1(job));
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .insertOne(eJob);
    resp.send(new BaseResponse().ok(job));
  })
);
