import express from 'express';
import { ObjectId, Filter } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, InjectTermId } from '../middlewares';
import { BaseResponse } from '../payloads';
import { modify, m } from '../modifiers';
import { toNormalizedString, toSafeInt } from '../utils';
import { resolveMongoFilter } from '../merin';
import { ClassToRegister } from 'shared-entities';

export const router = express.Router();

router.get(
  '/api/term-ids/:termId/class-to-registers',
  InjectTermId(),
  ExceptionWrapper(async (req, resp) => {
    const query = modify(req.query, [
      m.pick(['q', 'page', 'size'], { dropFalsy: true }),
      m.normalizeInt('page'),
      m.normalizeInt('size'),
    ]);
    const termId = req.__termId;

    const filter: Filter<ClassToRegister> = resolveMongoFilter(
      String(query.q).split(',')
    );

    filter.termId = termId;

    const page = query.page || 0;
    const size = query.size || 10;

    const classToRegisters = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.CTR)
      .find(filter)
      .skip(page * size)
      .limit(size)
      .toArray();
    resp.send(new BaseResponse().ok(classToRegisters));
  })
);

router.get(
  '/api/term-ids/:termId/class-to-registers/:id',
  InjectTermId(),
  ExceptionWrapper(async (req, resp) => {
    const id = toNormalizedString(req.params.id);
    const termId = req.__termId;
    const filter: Filter<ClassToRegister> = {
      _id: new ObjectId(id),
      termId: termId,
    };
    const classToRegister = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.CTR)
      .findOne(filter);
    resp.send(new BaseResponse().ok(classToRegister));
  })
);

router.get(
  '/api/term-ids/:termId/class-to-registers/class-ids/:classId',
  InjectTermId(),
  ExceptionWrapper(async (req, resp) => {
    const classId = toSafeInt(req.params.classId);
    const termId = req.__termId;
    const filter: Filter<ClassToRegister> = {
      classId: classId,
      termId: termId,
    };
    const classToRegister = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.CTR)
      .findOne(filter);
    resp.send(new BaseResponse().ok(classToRegister));
  })
);
