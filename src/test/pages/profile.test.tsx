import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router';
import usersReducer from '../../store/slices/users';
import { ProfilePage } from '../../pages/profile';

const createStore = (overrides?: Partial<ReturnType<typeof usersReducer>>) => {
  const baseState = usersReducer(undefined, { type: 'init' });
  return configureStore({
    reducer: { users: usersReducer },
    preloadedState: {
      users: { ...baseState, ...overrides },
    },
  });
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('ProfilePage', () => {
  it('dispatches fetch on mount and renders the user', async () => {
    const user = {
      id: '1',
      login: 'octo',
      avatar_url: 'https://example.com/avatar.png',
      followers: 2,
      following: 3,
      public_repos: 4,
    };

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/user/octo']}>
          <Routes>
            <Route path="/user/:handle" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(await screen.findByText('@octo')).toBeInTheDocument();
  });

  it('shows a loader while fetching', () => {
    const store = createStore({ userStatus: 'loading' });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/user/octo']}>
          <Routes>
            <Route path="/user/:handle" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows not found when user is missing', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 404,
        headers: { 'x-ratelimit-remaining': '1' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const store = createStore({ userStatus: 'idle', selectedUser: undefined });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/user/octo']}>
          <Routes>
            <Route path="/user/:handle" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });
});
