/* eslint-disable @typescript-eslint/no-var-requires */

import express from 'express';
import { cfg } from '../cfg';
import { FalsyValueError, NotAnArrayError } from '../exceptions';
import { ExceptionWrapper, IsAdminFilter, JwtFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { isFalsy } from '../utils';
import { getMySettings } from 'shared-configs';

export const router = express.Router();

router.get(
  '/api/term-ids',
  ExceptionWrapper(async (req, resp) => {
    resp.send(new BaseResponse().ok(getMySettings().getTermIds()));
  })
);

router.post(
  '/api/term-ids',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const termIds = req.body.data;
    if (isFalsy(termIds)) throw new FalsyValueError('body.data');
    if (!Array.isArray(termIds)) throw new NotAnArrayError('body.data');
    getMySettings().addTermIds(termIds);
    await getMySettings().save();
    resp.send(new BaseResponse().ok(getMySettings().getTermIds()));
  })
);

router.put(
  '/api/term-ids',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const termIds = req.body.data;
    if (isFalsy(termIds)) throw new FalsyValueError('body.data');
    if (!Array.isArray(termIds)) throw new NotAnArrayError('body.data');
    getMySettings().replaceTermIds(termIds);
    await getMySettings().save();
    resp.send(new BaseResponse().ok(getMySettings().getTermIds()));
  })
);
