/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';
import express from 'express';

export const autoSetup = (dir: string) => {
  const filepaths = fs.readdirSync(dir).filter(x => x.endsWith('.js'));
  const loaded = [];

  for (const filepath of filepaths) {
    const relativeFilepath = `${dir}/${filepath}`;
    const stat = fs.statSync(relativeFilepath);

    if (stat.isDirectory()) {
      const childLoaded = autoSetup(relativeFilepath);
      loaded.push(...childLoaded);
    } else {
      require(path.resolve(relativeFilepath)).setup();
      loaded.push(relativeFilepath);
    }
  }

  return loaded;
};

export const routeSetup = (dir: string) => {
  const filepaths = fs.readdirSync(dir).filter(x => !x.endsWith('.ts'));
  const router = express.Router();
  const loadedPaths = [];

  for (const filepath of filepaths) {
    const relativeFilepath = path.join(dir, filepath);
    console.log(relativeFilepath);
    loadedPaths.push(relativeFilepath);
    router.use(require(path.resolve(relativeFilepath)).router);
  }

  return router;
};

/**
 * Thanks this tutorial https://www.tutorialspoint.com/encrypt-and-decrypt-data-in-nodejs
 * @author Mayank Agarwal
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

class Cypher {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  encrypt(text: string, iv: string) {
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(this.secret, 'hex'),
      Buffer.from(iv, 'hex')
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt(text: string, iv: string) {
    const encryptedText = Buffer.from(text, 'hex');
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(this.secret, 'hex'),
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export const cypher = (secret: string) => new Cypher(secret);

export const standardizeString = (str: string) => {
  // Trim the string
  str = str.trim();

  // Convert the string to lowercase
  str = str.toLowerCase();

  // Remove accents and diacritical marks
  const patterns = [
    { base: 'a', regex: /[àáạảãâầấậẩẫăằắặẳẵ]/g },
    { base: 'e', regex: /[èéẹẻẽêềếệểễ]/g },
    { base: 'i', regex: /[ìíịỉĩ]/g },
    { base: 'o', regex: /[òóọỏõôồốộổỗơờớợởỡ]/g },
    { base: 'u', regex: /[ùúụủũưừứựửữ]/g },
    { base: 'y', regex: /[ỳýỵỷỹ]/g },
    { base: 'd', regex: /[đ]/g },
  ];

  for (const pattern of patterns) {
    str = str.replace(pattern.regex, pattern.base);
  }

  return str;
};

export const toSafeString = input => String(input);

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
