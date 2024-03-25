import express from 'express';
import { Filter, ObjectId } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper } from '../middlewares';
import { BaseResponse } from '../payloads';
import { toSHA256 } from '../utils';
import { JwtFilter } from '../middlewares';
import { isFalsy } from '../utils';
import { AccountNotFoundError } from '../exceptions';
import { Account } from 'shared-entities';
import { modify, m } from '../modifiers';
import { dropPassword } from '../dto';
import jwt from 'jsonwebtoken';
import { cypher } from 'shared-utils';

export const router = express.Router();

router.get(
  '/api/accounts/current',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;

    const filter: Filter<Account> = { _id: new ObjectId(accountId) };
    const account = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.ACCOUNT)
      .findOne(filter);

    if (isFalsy(account)) throw new AccountNotFoundError(accountId);

    resp.send(new BaseResponse().ok(dropPassword(new Account(account))));
  })
);

router.put(
  '/api/accounts/current/password',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const accountId = req.__accountId;

    const body = modify(req.body, [
      m.pick(['password']),
      m.normalizeString('password'),
      m.replace('password', oldValue => toSHA256(oldValue)),
    ]);

    const newHashedPassword = body.password;

    const filter: Filter<Account> = { _id: new ObjectId(accountId) };

    const account = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.ACCOUNT)
      .findOne(filter);

    if (isFalsy(account)) throw new AccountNotFoundError(accountId);

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.ACCOUNT)
      .updateOne(filter, { $set: { password: newHashedPassword } });

    const check_job_crawl = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL)
      .findOne({ ownerAccountId: new ObjectId(accountId) });
    if (check_job_crawl) {
      const ePassword = cypher(cfg.JOB_ENCRYPTION_KEY).encrypt(
        req.body.password,
        check_job_crawl.iv
      );
      await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.JOB_CRAWL)
        .updateOne(
          { ownerAccountId: new ObjectId(accountId) },
          { $set: { password: ePassword } }
        );
    }
    resp.send(new BaseResponse().ok(dropPassword(new Account(account))));
  })
);

router.get(
  '/api/accounts/current/renew-token',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const doc = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.ACCOUNT)
      .findOne({ _id: new ObjectId(req.__accountId) });

    if (!doc) throw new AccountNotFoundError(req.__accountId);

    const account = new Account(doc);

    const token = jwt.sign({ id: account._id }, cfg.SECRET, {
      expiresIn: '1d',
    });
    resp.send(
      new BaseResponse().ok({
        token,
        username: account.username,
        role: account.role,
      })
    );
  })
);
