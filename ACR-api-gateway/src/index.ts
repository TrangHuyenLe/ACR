/* eslint-disable @typescript-eslint/no-var-requires */
import http from 'http';
import express from 'express';
import * as amqplib from 'amqplib/callback_api';
import { MongoClient } from 'mongodb';
import cors from 'cors';
const morgan = require('morgan');

import { cfg, CollectionName, QueueName, Role } from './cfg';
import logger from './loggers/logger';
import { ensureIndex, toJson, toKeyValueString, toSHA256 } from './utils';
import {
  mongoConnectionPool,
  rabbitmqConnectionPool,
} from 'shared-connections';
import { getMySettings } from 'shared-configs';
import { Account } from 'shared-entities';
import { autoSetup, routeSetup } from 'shared-utils';
import { JwtFilter, pagination } from './middlewares';
import { logConfig } from './logging/index';
import { createLogMiddleware } from '@hoangnam.io/log-lib/logging/log-middleware';

async function ensureRootAccount() {
  const doc = await mongoConnectionPool
    .getClient()
    .db(cfg.DATABASE_NAME)
    .collection(CollectionName.ACCOUNT)
    .findOne({ username: 'root' });

  if (doc) return;
  const password = cfg.INIT_ROOT_PASSWORD;
  const account = new Account({
    username: 'root',
    password: toSHA256(password),
    role: Role.ADMIN,
  });

  await mongoConnectionPool
    .getClient()
    .db(cfg.DATABASE_NAME)
    .collection(CollectionName.ACCOUNT)
    .insertOne(account);

  logger.info(`Insert root account with password ${password}`);
}

async function main() {
  logger.info(`Config: \n${toKeyValueString(cfg)}`);

  const app = express();
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(morgan('dev', {}));
  app.use(pagination);

  const server = http.createServer(app);
  server.listen(cfg.PORT, cfg.BIND);

  const client = await new MongoClient(cfg.MONGODB_CONNECTION_STRING);
  client.connect();
  mongoConnectionPool.addClient(client);

  await getMySettings().loadFromDb();

  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.ACCOUNT, {
    username: 1,
    password: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.JOB_CRAWL, {
    ownerAccountId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.JOB_CRAWL, {
    status: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.JOB_CRAWL, {
    ownerAccountId: 1,
    status: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.JOB_CRAWL, {
    ownerAccountId: 1,
    status: 1,
    doingAt: 1,
    timeToStart: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.CTR, { classId: 1 });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.CTR, {
    classId: 1,
    learnDayNumber: 1,
    termId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.DKHPTDV1, {
    ownerAccountId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.DKHPTDV1, {
    ownerAccountId: 1,
    termId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.DKHPTDV1, {
    timeToStart: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.DKHPTDV1Result, {
    jobId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.DKHPTDV1Result, {
    ownerAccountId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.DKHPTDV1Result, {
    ownerAccountId: 1,
    jobId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.PREFERENCE, {
    ownerAccountId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.PREFERENCE, {
    ownerAccountId: 1,
    termId: 1,
  });
  ensureIndex(
    client.db(cfg.DATABASE_NAME),
    CollectionName.STUDENT_LANGUAGE_RESULT,
    {
      studentId: 1,
      date: 1,
    }
  );
  ensureIndex(
    client.db(cfg.DATABASE_NAME),
    CollectionName.STUDENT_LANGUAGE_RESULT,
    {
      studentId: 1,
      termId: 1,
      date: 1,
    }
  );
  ensureIndex(
    client.db(cfg.DATABASE_NAME),
    CollectionName.STUDENT_LEARNING_RESULT,
    {
      studentId: 1,
      termId: 1,
    }
  );
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.STUDENT_GRADE, {
    studentId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.STUDENT_GRADE, {
    studentId: 1,
    termId: 1,
    classId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.SUBJECT, {
    subjectId: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.SUBJECT, {
    subjectName: 1,
  });
  ensureIndex(client.db(cfg.DATABASE_NAME), CollectionName.SUBJECT, {
    subjectId: 1,
    subjectName: 1,
  });

  ensureRootAccount();

  app.use('/api', createLogMiddleware(app, logConfig));
  app.use(routeSetup('./dist/routes'));

  amqplib.connect(cfg.RABBITMQ_CONNECTION_STRING, (error0, connection) => {
    if (error0) {
      logger.error(error0);
      return;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        logger.error(error1);
        return;
      }
      rabbitmqConnectionPool.addChannel(channel);
      // channel.assertQueue(QueueName.PARSE_TKB_XLSX);
      // channel.assertQueue(QueueName.PROCESS_PARSE_TKB_XLSX_RESULT);
      channel.assertQueue(QueueName.CRAWL_DIRECT);
      app.use(routeSetup('./dist/routes'));
      const loadedConsumers = autoSetup('./dist/consumers');
      logger.info(`Loaded consumers: ${toJson(loadedConsumers, 2)}`);
      const loadedListeners = autoSetup('./dist/listeners');
      logger.info(`Loaded listeners ${toJson(loadedListeners, 2)}`);
    });
  });
}

main();
