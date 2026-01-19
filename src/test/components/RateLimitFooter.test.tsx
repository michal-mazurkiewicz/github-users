import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../../store/slices/users';
import { RateLimitFooter } from '../../components/RateLimitFooter';

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
  vi.useRealTimers();
});

describe('RateLimitFooter', () => {
  it('shows countdown text while rate limit is active', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
    const nowSeconds = Math.floor(Date.now() / 1000);

    const store = createStore({
      rateLimitResetAt: nowSeconds + 65,
      query: 'octo',
      has_more: true,
    });

    render(
      <Provider store={store}>
        <RateLimitFooter />
      </Provider>,
    );

    expect(screen.getByText(/Rate limit reached\. Try again in 1m 5s\./i)).toBeInTheDocument();
  });

  it('disables Load more when query is too short', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
    const nowSeconds = Math.floor(Date.now() / 1000);

    const store = createStore({
      rateLimitResetAt: nowSeconds - 1,
      query: 'ab',
      has_more: true,
    });

    render(
      <Provider store={store}>
        <RateLimitFooter />
      </Provider>,
    );

    const button = screen.getByRole('button', { name: /load more/i });
    expect(button).toBeDisabled();
  });

  it('enables Load more when query is valid and has more results', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
    const nowSeconds = Math.floor(Date.now() / 1000);

    const store = createStore({
      rateLimitResetAt: nowSeconds - 1,
      query: 'octo',
      has_more: true,
    });

    render(
      <Provider store={store}>
        <RateLimitFooter />
      </Provider>,
    );

    const button = screen.getByRole('button', { name: /load more/i });
    expect(button).toBeEnabled();
  });
});
