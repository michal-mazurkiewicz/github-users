import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router';
import usersReducer from '../../store/slices/users';
import { UserRow } from '../../components/UserRow';
import type { User } from '../../types/users';

const createStore = () => {
  const baseState = usersReducer(undefined, { type: 'init' });
  return configureStore({
    reducer: { users: usersReducer },
    preloadedState: { users: baseState },
  });
};

describe('UserRow', () => {
  const user: User = {
    id: '1',
    login: 'octo',
    avatar_url: 'https://example.com/avatar.png',
    url: 'https://api.github.com/users/octo',
  };

  it('links to the user profile', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserRow index={0} style={{}} users={[user]} ariaAttributes={{}} />
        </MemoryRouter>
      </Provider>,
    );

    const link = screen.getByRole('link', { name: '@octo' });
    expect(link.getAttribute('href')).toContain('/user/octo');
  });

  it('toggles favourite on star click', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserRow index={0} style={{}} users={[user]} ariaAttributes={{}} />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Toggle star'));
    expect(store.getState().users.favourites).toHaveLength(1);
  });
});
