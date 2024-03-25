import { bus } from '../bus';
import { cfg, CollectionName, JobStatus, AppEvent, SchoolName } from '../cfg';
import { mongoConnectionPool } from 'shared-connections';
import {
  Student,
  StudentGrade,
  StudentLearningResult,
  JobCrawl,
  Account,
  StudentLanguageResult,
} from 'shared-entities';

import { standardizeString } from 'shared-utils';

export const setup = () => {
  // user error + captcha error + no error
  bus.on(AppEvent.JOB_CRAWL_DONE, async (result, job: JobCrawl) => {
    await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.JOB_CRAWL)
      .updateOne({ _id: job._id }, { $set: { status: JobStatus.DONE } });

    const info = result.vars.studentInfo;
    const languageResult = result.vars.studentLanguageResult;
    const grade = result.vars.StudentGrade.grade;
    const resultSemester = result.vars.StudentGrade.result;

    const existed_student = await mongoConnectionPool
      .getClient()
      .db(cfg.DATABASE_NAME)
      .collection(CollectionName.STUDENT)
      .findOne({
        studentId: job.username,
      });

    const studentInfo = new Student({
      studentId: job.username,
      name: info.HoTen,
      yearOfAdmission: info.NamVaoTruong,
      degreeProgram: info.BacDaoTao,
      program: info.ChuongTrinh,
      school: SchoolName[standardizeString(info.KhoaVien)],
      studyStatus: info.TinhTrangHoc,
      gender: info.GioiTinh,
      class: info.Lop,
      cohort: info.KhoaHoc,
      email: info.Email,
    });

    if (!existed_student) {
      await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.STUDENT)
        .insertOne(studentInfo);
    } else {
      await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.STUDENT)
        .updateOne(
          {
            studentId: job.username,
          },
          {
            $set: {
              name: info.HoTen,
              yearOfAdmission: info.NamVaoTruong,
              degreeProgram: info.BacDaoTao,
              program: info.ChuongTrinh,
              school: SchoolName[standardizeString(info.KhoaVien)],
              studyStatus: info.TinhTrangHoc,
              gender: info.GioiTinh,
              class: info.Lop,
              cohort: info.KhoaHoc,
              email: info.Email,
            },
          }
        );
    }

    for (let i = 0; i < languageResult.length; i++) {
      const existed_result = await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.STUDENT_LANGUAGE_RESULT)
        .findOne({
          studentId: job.username,
          date: languageResult[i].NgayThi,
        });

      const languageGrade = new StudentLanguageResult({
        studentId: job.username,
        name: languageResult[i].HoTen,
        dob: languageResult[i].NgaySinh,
        termId: languageResult[i].HocKy,
        note: languageResult[i].GhiChu,
        date: languageResult[i].NgayThi,
        listening: languageResult[i].DiemNghe,
        reading: languageResult[i].DiemDoc,
        total: languageResult[i].DiemTong,
      });

      if (!existed_result) {
        await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.STUDENT_LANGUAGE_RESULT)
          .insertOne(languageGrade);
      } else {
        await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.STUDENT_LANGUAGE_RESULT)
          .updateOne(
            {
              studentId: job.username,
              date: languageResult[i].date,
            },
            {
              $set: {
                studentId: job.username,
                name: languageResult[i].HoTen,
                dob: languageResult[i].NgaySinh,
                termId: languageResult[i].HocKy,
                note: languageResult[i].GhiChu,
                date: languageResult[i].NgayThi,
                listening: languageResult[i].DiemNghe,
                reading: languageResult[i].DiemDoc,
                total: languageResult[i].DiemTong,
              },
            }
          );
      }
    }

    for (let i = 0; i < grade.length; i++) {
      const existed_grade = await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.STUDENT_GRADE)
        .findOne({
          studentId: job.username,
          termId: grade[i].HocKy,
          classId: grade[i].LopHoc,
        });

      const subjectGrade = new StudentGrade({
        studentId: job.username,
        termId: grade[i].HocKy,
        subjectId: grade[i].MaHocPhan,
        subjectName: grade[i].TenHocPhan,
        subjectVolume: grade[i].TinChi,
        classId: grade[i].LopHoc,
        midtermGrade: grade[i].DiemQuaTrinh,
        finalGrade: grade[i].DiemThi,
        letterGrade: grade[i].DiemChu,
      });

      if (!existed_grade) {
        await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.STUDENT_GRADE)
          .insertOne(subjectGrade);
      } else {
        await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.STUDENT_GRADE)
          .updateOne(
            {
              studentId: job.username,
              termId: grade[i].HocKy,
              classId: grade[i].LopHoc,
            },
            {
              $set: {
                studentId: job.username,
                termId: grade[i].HocKy,
                subjectId: grade[i].MaHocPhan,
                subjectName: grade[i].TenHocPhan,
                subjectVolume: grade[i].TinChi,
                classId: grade[i].LopHoc,
                midtermGrade: grade[i].DiemQuaTrinh,
                finalGrade: grade[i].DiemThi,
                letterGrade: grade[i].DiemChu,
              },
            }
          );
      }
    }

    for (let i = 0; i < resultSemester.length; i++) {
      const existed_result_semester = await mongoConnectionPool
        .getClient()
        .db(cfg.DATABASE_NAME)
        .collection(CollectionName.STUDENT_LEARNING_RESULT)
        .findOne({
          studentId: job.username,
          termId: resultSemester[i].HocKy,
        });

      const learningResult = new StudentLearningResult({
        studentId: job.username,
        termId: resultSemester[i].HocKy,
        GPA: resultSemester[i].GPA,
        CPA: resultSemester[i].CPA,
        passCredits: resultSemester[i].TCQua,
        accumulatedCredits: resultSemester[i].TCTichLuy,
        debtCredits: resultSemester[i].TCNoDky,
        registeredCredits: resultSemester[i].TCDky,
        studentLevel: resultSemester[i].TrinhDo,
        warningLevel: resultSemester[i].MucCanhBao,
      });

      if (!existed_result_semester) {
        await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.STUDENT_LEARNING_RESULT)
          .insertOne(learningResult);
      } else {
        await mongoConnectionPool
          .getClient()
          .db(cfg.DATABASE_NAME)
          .collection(CollectionName.STUDENT_LEARNING_RESULT)
          .updateOne(
            {
              studentId: job.username,
              termId: resultSemester[i].HocKy,
            },
            {
              $set: {
                studentId: job.username,
                termId: resultSemester[i].HocKy,
                GPA: resultSemester[i].GPA,
                CPA: resultSemester[i].CPA,
                passCredits: resultSemester[i].TCQua,
                accumulatedCredits: resultSemester[i].TCTichLuy,
                debtCredits: resultSemester[i].TCNoDky,
                registeredCredits: resultSemester[i].TCDky,
                studentLevel: resultSemester[i].TrinhDo,
                warningLevel: resultSemester[i].MucCanhBao,
              },
            }
          );
      }
    }
  });
};
