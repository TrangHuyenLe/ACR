import express from 'express';
import { ObjectId } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { AccountPreference } from 'shared-entities';
import { MissingRequestBodyDataError } from '../exceptions';
import { ExceptionWrapper, InjectTermId, JwtFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { modify, m } from '../modifiers';
import { isFalsy } from '../utils';

export const router = express.Router();

router.post(
  '/api/accounts/current/term-ids/:termId/preference',
  JwtFilter(cfg.SECRET),
  InjectTermId(),
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;
    const data = req.body;
    const termId = req.__termId;

    if (isFalsy(data)) throw new MissingRequestBodyDataError();

    const body = modify(data, [
      m.pick(['wantedSubjectIds']),
      m.normalizeArray('wantedSubjectIds', 'string'),
      m.set('ownerAccountId', new ObjectId(accountId)),
    ]);

    const newPreference = new AccountPreference(body);
    newPreference.termId = termId;

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.PREFERENCE)
      .insertOne(newPreference);

    resp.send(new BaseResponse().ok());
  })
);
