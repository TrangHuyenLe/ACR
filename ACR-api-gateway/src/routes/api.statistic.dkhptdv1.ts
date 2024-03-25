import express from 'express';
import { Filter, ObjectId } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter, IsAdminFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { DKHPTDJobV1, Account } from 'shared-entities';
import { decryptJobV1 } from '../dto';
import { modify, m } from '../modifiers';
export const router = express.Router();

router.get(
  '/api/statistics/dkhptdv1',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const { studentId, termId } = modify(req.query, [
      m.pick(['studentId', 'termId']),
    ]);

    const filterAccount: Filter<Account> = { role: null };
    const filter: Filter<DKHPTDJobV1> = {};

    if (studentId) {
      filterAccount.username = studentId;
      const account = await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.ACCOUNT)
        .findOne(filterAccount);

      if (account) {
        filter.ownerAccountId = new ObjectId(account._id);
      }
    }

    if (termId) {
      filter.termId = termId;
    }

    const docs = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.DKHPTDV1)
      .find(filter)
      .toArray();

    const quantity = docs.length;
    const jobList = docs.map(job => decryptJobV1(new DKHPTDJobV1(job)));

    resp.send(new BaseResponse().ok({ quantity, jobList }));
  })
);
