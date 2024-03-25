/* eslint-disable no-param-reassign */
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { cfg } from './cfg';
import { cypher } from 'shared-utils';
import { JobCrawl } from 'shared-entities';

export const toBuffer = input => Buffer.from(input);
export const toJson = (input, space?: string | number) =>
  JSON.stringify(input, null, space);
export const toKeyValueString = input =>
  Object.keys(input)
    .reduce((agg: string, cur: string) => `${agg + cur} = ${input[cur]}\n`, '')
    .trim();
export const toNormalizedString = input => {
  const safeString = toSafeString(input);
  if (safeString.match(/^"*null"*$/i)) {
    return null;
  }
  if (safeString.match(/^"*undefined"*$/i)) {
    return undefined;
  }
  return safeString.trim().replace(/\s{2,}/g, ' ');
};
export const toObjectId = input => (input ? null : new ObjectId(input));
export const toSafeArray = <T>(input): T[] => {
  try {
    return Array.from(input);
  } catch (err) {
    return [];
  }
};
export const toSafeInt = input => parseInt(input) || 0;
export const toSafeString = input => String(input);
export const toSHA256 = (input: string) =>
  crypto.createHash('sha256').update(input).digest('hex');

export const decryptJobCrawl = (input: JobCrawl) => {
  const dPassword = cypher(cfg.JOB_ENCRYPTION_KEY).decrypt(
    input.password,
    input.iv
  );
  // const dUsername = cypher(cfg.JOB_ENCRYPTION_KEY).decrypt(
  //   input.username,
  //   input.iv
  // );
  return {
    _id: input._id,
    ownerAccountId: input.ownerAccountId,
    username: input.username,
    password: dPassword,
    status: input.status,
    no: input.no,
  };
};
