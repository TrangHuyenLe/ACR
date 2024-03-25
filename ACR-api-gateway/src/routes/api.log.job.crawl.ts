import express from 'express';
import { Filter, ObjectId } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter, IsAdminFilter } from '../middlewares';
import { FalsyValueError, AccountNotFoundError } from '../exceptions';
import { BaseResponse } from '../payloads';
import { modify, m } from '../modifiers';
import { decryptJobCrawl } from '../dto';
import { isFalsy } from '../utils';
import { JobCrawl, Account } from 'shared-entities';

export const router = express.Router();

router.get(
  '/api/log/job/crawl',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const { limit, offset, sort, filter } = req.pagination;
    const { studentId } = modify(req.query, [m.pick(['studentId'])]);

    const filterJobCrawl: Filter<JobCrawl> = {};

    if (studentId) {
      filterJobCrawl.username = studentId;
    }

    const jobList = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL)
      .find(filterJobCrawl)
      .skip(offset)
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();

    const crawlJobList = jobList.map(job => decryptJobCrawl(new JobCrawl(job)));
    const quantity = crawlJobList.length;

    resp.send(new BaseResponse().ok({ quantity, crawlJobList }));
  })
);
