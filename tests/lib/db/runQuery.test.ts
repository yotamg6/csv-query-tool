import db from '@/lib/db/connection';
import { runQuery } from '@/lib/db/runQuery';

jest.mock('@/lib/db/connection', () => ({
  __esModule: true,
  default: {
    prepare: jest.fn().mockReturnValue({ all: () => ['r1', 'r2'] }),
  },
}));

describe('runQuery', () => {
  afterEach(() => jest.resetAllMocks());

  it('returns results from all()', () => {
    const rows = runQuery('SELECT 1');
    expect(db.prepare).toHaveBeenCalledWith('SELECT 1');
    expect(rows).toEqual(['r1', 'r2']);
  });
});
