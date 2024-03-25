import express from 'express';
import { Filter } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter, IsAdminFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { modify, m } from '../modifiers';
import { Student } from 'shared-entities';
export const router = express.Router();

router.get(
  '/api/crawl/info',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const { studentId, school, cohort } = modify(req.query, [
      m.pick(['studentId', 'school', 'cohort']),
    ]);

    const filterStudent: Filter<Student> = {};

    if (studentId) {
      filterStudent.studentId = studentId;
    } else if (school && cohort) {
      filterStudent.cohort = cohort;
      filterStudent.school = school;
    } else if (school) {
      filterStudent.school = school;
    } else if (cohort) {
      filterStudent.cohort = cohort;
    }

    const students = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.STUDENT)
      .find(filterStudent)
      .toArray();

    const studentInfoList = students.map(
      ({ _id, ...studentInfo }) => studentInfo
    );

    resp.send(new BaseResponse().ok({ studentInfoList }));
  })
);
