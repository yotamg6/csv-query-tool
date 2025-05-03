import crypto from 'crypto';

export const hashCsv = (csvText: string): string => {
  return crypto.createHash('sha256').update(csvText).digest('hex');
};
