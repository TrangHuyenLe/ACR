import express from 'express';
import { cfg, CollectionName, JobStatus } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { Account } from 'shared-entities';
import { FalsyValueError, UsernameExistedError } from '../exceptions';
import { ExceptionWrapper } from '../middlewares';
import { isFalsy } from '../utils';
import { modify, m } from '../modifiers';
import { BaseResponse, LoginWithUsernamePasswordRequest } from '../payloads';
import { toSHA256 } from '../utils';
import { dropPassword } from '../dto';

export const router = express.Router();

router.post(
  '/api/signup',
  ExceptionWrapper(async (req, resp) => {
    const body = new LoginWithUsernamePasswordRequest(
      modify(req.body, [
        m.pick(['username', 'password']),
        m.normalizeString('username'),
        m.normalizeString('password'),
        m.replace('password', oldValue => toSHA256(oldValue)),
      ])
    );

    if (isFalsy(body.username)) throw new FalsyValueError('body.username');
    if (isFalsy(body.password)) throw new FalsyValueError('body.password');

    const isUsernameExists = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.ACCOUNT)
      .findOne({ username: body.username });

    if (isUsernameExists) {
      throw new UsernameExistedError(body.username);
    }

    const account = new Account(body);

    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.ACCOUNT)
      .insertOne(account);

    resp.send(new BaseResponse().ok(dropPassword(account)));
  })
);
