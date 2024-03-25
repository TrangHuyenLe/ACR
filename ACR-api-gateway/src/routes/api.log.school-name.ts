import express from 'express';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter, IsAdminFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { isFalsy } from '../utils';
import { FalsyValueError, AccountNotFoundError } from '../exceptions';
import { modify, m } from '../modifiers';
export const router = express.Router();

router.get(
  '/api/log/school-name',
  JwtFilter(cfg.SECRET),
  IsAdminFilter(),
  ExceptionWrapper(async (req, resp) => {
    const schoolName = {
      'truong co khi': 'SME',
      'vien cong nghe sinh hoc va cong nghe thuc pham': 'SBFT',
      'truong cong nghe thong tin va truyen thong': 'SOICT',
      'vien det may - da giay va thoi trang': 'STLF',
      'vien khoa hoc va cong nghe moi truong': 'SEST',
      'vien khoa hoc va ky thuat vat lieu': 'SMSE',
      'vien kinh te va quan ly': 'SEM',
      'vien ky thuat hoa hoc': 'SCE',
      'vien ngoai ngu': 'SOFL',
      'vien su pham ky thuat': 'SEPD',
      'vien toan ung dung va tin hoc': 'SAMI',
      'vien vat ly ky thuat': 'SEP',
      'truong dien - dien tu': 'SEEE',
    };

    resp.send(new BaseResponse().ok(schoolName));
  })
);
