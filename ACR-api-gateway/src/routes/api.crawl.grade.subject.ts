import express from 'express';
import { Filter } from 'mongodb';
import { cfg, CollectionName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import { ExceptionWrapper, JwtFilter, IsAdminFilter } from '../middlewares';
import { BaseResponse } from '../payloads';
import { Student } from 'shared-entities';
import { modify, m } from '../modifiers';
export const router = express.Router();

router.get(
  '/api/crawl/grade/subject',
  JwtFilter(cfg.SECRET),
  ExceptionWrapper(async (req, resp) => {
    const { studentId, school, cohort, termId } = modify(req.query, [
      m.pick(['studentId', 'school', 'cohort', 'termId']),
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

    const studentCollection = mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.STUDENT);

    const students = await studentCollection.find(filterStudent).toArray();
    const studentIds = students.map(student => student.studentId);

    const studentGradeCollection = mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.STUDENT_GRADE);

    const studentSubjectGrades = termId
      ? await studentGradeCollection
          .find({ studentId: { $in: studentIds }, termId })
          .toArray()
      : await studentGradeCollection
          .find({ studentId: { $in: studentIds } })
          .toArray();

    resp.send(new BaseResponse().ok({ studentSubjectGrades }));
  })
);
