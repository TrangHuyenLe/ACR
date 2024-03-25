import express from 'express';
import { ObjectId } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter, IsAdminFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { modify, m } from '../modifiers';
import { decryptJobCrawlResult } from '../dto';
import { JobCrawlResult } from 'shared-entities';
import { JobNotFoundError, InvalidValueError } from '../exceptions';
export const router = express.Router();

router.get(
  '/api/log/job-result/crawl',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const { jobId } = modify(req.query, [m.pick(['jobId'])]);

    if (!jobId) throw new InvalidValueError(jobId);
    const ejobCrawlResults = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL_RESULT)
      .find({ jobId: new ObjectId(jobId) })
      .toArray();

    if (ejobCrawlResults.length == 0) throw new JobNotFoundError(jobId);
    const jobCrawlResults = ejobCrawlResults.map(ejobCrawlResult =>
      decryptJobCrawlResult(new JobCrawlResult(ejobCrawlResult))
    );

    resp.send(new BaseResponse().ok(jobCrawlResults));
  })
);
