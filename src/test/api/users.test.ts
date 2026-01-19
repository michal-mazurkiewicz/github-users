import { describe, it, expect, vi, afterEach } from 'vitest';
import { usersApi } from '../../api/users';
import type { SearchUsersResponse } from '../../types/users';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('UsersApi', () => {
  it('returns parsed data on success', async () => {
    const payload: SearchUsersResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [],
      page: 1,
    };

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await usersApi.searchUsers('octo');

    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws a rate limit error when headers indicate a limit', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
    const nowSeconds = Math.floor(Date.now() / 1000);
    const resetAt = nowSeconds + 90;

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 403,
        headers: {
          'x-ratelimit-remaining': '0',
          'x-ratelimit-reset': String(resetAt),
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(usersApi.searchUsers('octo')).rejects.toMatchObject({
      message: 'Rate limit reached. Try again in 1m 30s.',
      rateLimitResetAt: resetAt,
    });
    expect(toast.error).toHaveBeenCalledWith('Rate limit reached. Try again in 1m 30s.');
  });

  it('throws a generic error when request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 500,
        headers: {
          'x-ratelimit-remaining': '1',
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(usersApi.searchUsers('octo')).rejects.toMatchObject({
      message: 'Failed to fetch users',
    });
    expect(toast.error).toHaveBeenCalledWith('Failed to fetch users');
  });
});
