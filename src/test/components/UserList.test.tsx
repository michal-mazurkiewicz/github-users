import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../../store/slices/users';
import UserList from '../../components/UserList';

const createStore = () => {
  const baseState = usersReducer(undefined, { type: 'init' });
  return configureStore({
    reducer: { users: usersReducer },
    preloadedState: { users: baseState },
  });
};

describe('UserList', () => {
  it('renders empty state when there are no users', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <UserList users={[]} />
      </Provider>,
    );

    expect(screen.getByText('No search results.')).toBeInTheDocument();
  });
});
