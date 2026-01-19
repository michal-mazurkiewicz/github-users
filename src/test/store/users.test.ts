import { describe, it, expect, beforeEach } from 'vitest';
import usersReducer, { fetchUserByHandle, searchUsers, selectIsFavourite, toggleFavourite } from '../../store/slices/users';
import type { SearchUsersResponse, User } from '../../types/users';

describe('users slice', () => {
  const baseState = usersReducer(undefined, { type: 'init' });
  const user: User = {
    id: '1',
    login: 'octo',
    avatar_url: 'https://example.com/avatar.png',
    url: 'https://api.github.com/users/octo',
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('toggles favourites and persists to localStorage', () => {
    const added = usersReducer(baseState, toggleFavourite(user));
    expect(added.favourites).toHaveLength(1);

    const stored = JSON.parse(window.localStorage.getItem('github-users:favourites') ?? '[]');
    expect(stored).toHaveLength(1);

    const removed = usersReducer(added, toggleFavourite(user));
    expect(removed.favourites).toHaveLength(0);
  });

  it('resets pagination on searchUsers.pending for page 1', () => {
    const populated = {
      ...baseState,
      users: [user],
      total_count: 1,
      incomplete_results: false,
      has_more: true,
      page: 2,
    };

    const next = usersReducer(populated, searchUsers.pending('req', { query: 'octo', page: 1 }));

    expect(next.users).toHaveLength(0);
    expect(next.total_count).toBeUndefined();
    expect(next.incomplete_results).toBeUndefined();
    expect(next.has_more).toBe(false);
    expect(next.page).toBe(1);
  });

  it('keeps pagination on searchUsers.pending for page > 1', () => {
    const populated = {
      ...baseState,
      users: [user],
      total_count: 1,
      incomplete_results: false,
      has_more: true,
      page: 2,
    };

    const next = usersReducer(populated, searchUsers.pending('req', { query: 'octo', page: 2 }));

    expect(next.users).toHaveLength(1);
    expect(next.total_count).toBe(1);
    expect(next.has_more).toBe(true);
    expect(next.page).toBe(2);
  });

  it('handles searchUsers.fulfilled and pagination fields', () => {
    const payload: SearchUsersResponse = {
      total_count: 2,
      incomplete_results: false,
      items: [user],
      page: 2,
    };

    const next = usersReducer(baseState, searchUsers.fulfilled(payload, 'req', { query: 'octo', page: 1 }));

    expect(next.users).toHaveLength(1);
    expect(next.page).toBe(2);
    expect(next.has_more).toBe(true);
    expect(next.query).toBe('octo');
  });

  it('appends users on searchUsers.fulfilled for page > 1', () => {
    const payload: SearchUsersResponse = {
      total_count: 3,
      incomplete_results: false,
      items: [
        {
          id: '2',
          login: 'octo-two',
          avatar_url: 'https://example.com/avatar2.png',
          url: 'https://api.github.com/users/octo-two',
        },
      ],
      page: 3,
    };

    const populated = { ...baseState, users: [user] };
    const next = usersReducer(populated, searchUsers.fulfilled(payload, 'req', { query: 'octo', page: 2 }));

    expect(next.users).toHaveLength(2);
    expect(next.page).toBe(3);
    expect(next.has_more).toBe(true);
  });

  it('handles searchUsers.rejected', () => {
    const next = usersReducer(
      baseState,
      searchUsers.rejected(new Error('fail'), 'req', { query: 'octo', page: 1 }, { message: 'fail', rateLimitResetAt: 123 }),
    );

    expect(next.searchStatus).toBe('failed');
    expect(next.error?.message).toBe('fail');
    expect(next.rateLimitResetAt).toBe(123);
  });

  it('handles fetchUserByHandle pending/fulfilled/rejected', () => {
    const pending = usersReducer(baseState, fetchUserByHandle.pending('req', 'octo'));
    expect(pending.userStatus).toBe('loading');

    const fulfilled = usersReducer(baseState, fetchUserByHandle.fulfilled(user, 'req', 'octo'));
    expect(fulfilled.userStatus).toBe('succeeded');
    expect(fulfilled.selectedUser?.login).toBe('octo');

    const rejected = usersReducer(
      baseState,
      fetchUserByHandle.rejected(new Error('nope'), 'req', 'octo', { message: 'nope', rateLimitResetAt: 9 }),
    );
    expect(rejected.userStatus).toBe('failed');
    expect(rejected.error?.message).toBe('nope');
    expect(rejected.rateLimitResetAt).toBe(9);
  });

  it('selectIsFavourite returns false for missing handle', () => {
    const selector = selectIsFavourite();
    expect(selector({ users: baseState } as any)).toBe(false);
  });

  it('selectIsFavourite returns true when user is favourited', () => {
    const selector = selectIsFavourite('octo');
    const state = { users: { ...baseState, favourites: [user] } } as any;
    expect(selector(state)).toBe(true);
  });
});
