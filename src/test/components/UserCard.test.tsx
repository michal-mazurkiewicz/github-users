import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../../store/slices/users';
import UserCard from '../../components/UserCard';

const createStore = () => {
  const baseState = usersReducer(undefined, { type: 'init' });
  return configureStore({
    reducer: { users: usersReducer },
    preloadedState: { users: baseState },
  });
};

describe('UserCard', () => {
  it('toggles favourite on star click', () => {
    const store = createStore();
    const user = {
      id: '1',
      login: 'octo',
      avatar_url: 'https://example.com/avatar.png',
      followers: 1,
      following: 2,
      public_repos: 3,
    };

    render(
      <Provider store={store}>
        <UserCard user={user} />
      </Provider>,
    );

    fireEvent.click(screen.getByLabelText('Star user'));
    expect(store.getState().users.favourites).toHaveLength(1);
  });
});
