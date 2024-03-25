/* eslint-disable @typescript-eslint/no-var-requires */

import express from 'express';
import { cfg, AppEvent } from '../cfg';
import { ExceptionWrapper, IsAdminFilter, JwtFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { getMySettings } from 'shared-configs';
import { cachedSettings } from '../services';
import { jobCycleSettings, dkhptdTimeSettings } from '../validators';
import { bus } from '../bus';

export const router = express.Router();

router.get(
  '/api/settings',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    resp.send(new BaseResponse().ok(getMySettings().getAllSettings()));
  })
);

router.get(
  '/api/settings/renew-token-every',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    resp.send(new BaseResponse().ok(cachedSettings.settings.renewTokenEvery));
  })
);

router.get(
  '/api/settings/refresh-job-every',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    resp.send(new BaseResponse().ok(cachedSettings.settings.refreshJobEvery));
  })
);

router.put(
  '/api/settings/renew-token-every',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const every = req.body.every;
    cachedSettings.settings.renewTokenEvery = every;
    await cachedSettings.save();
    resp.send(new BaseResponse().ok(cachedSettings.settings.renewTokenEvery));
  })
);

router.put(
  '/api/settings/refresh-job-every',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const every = req.body.every;
    cachedSettings.settings.refreshJobEvery = every;
    await cachedSettings.save();
    resp.send(new BaseResponse().ok(cachedSettings.settings.refreshJobEvery));
  })
);

router.post(
  '/api/settings/job-cycle',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  jobCycleSettings,
  ExceptionWrapper(async (req, res) => {
    const { crawl_cycle, dkhptd_cycle } = req.body;
    getMySettings().settings.addJobCycle(crawl_cycle, dkhptd_cycle);
    await getMySettings().save();
    bus.emit(AppEvent.UPDATE_SETTINGS, getMySettings().settings);
    res.status(200).json(
      new BaseResponse().ok({
        crawl_cycle: getMySettings().settings.crawl_cycle,
        dkhptd_cycle: getMySettings().settings.dkhptd_cycle,
      })
    );
  })
);

router.post(
  '/api/settings/dkhptd-time',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  dkhptdTimeSettings,
  ExceptionWrapper(async (req, res) => {
    const { from, to } = req.body;
    getMySettings().settings.addDkhptdTime(from, to);
    await getMySettings().save();
    bus.emit(AppEvent.UPDATE_SETTINGS, getMySettings().settings);
    res.status(200).json(
      new BaseResponse().ok({
        from: getMySettings().settings.from,
        to: getMySettings().settings.to,
      })
    );
  })
);
