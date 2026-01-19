import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../../store/slices/users';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';

const createStore = (overrides?: Partial<ReturnType<typeof usersReducer>>) => {
  const baseState = usersReducer(undefined, { type: 'init' });
  return configureStore({
    reducer: { users: usersReducer },
    preloadedState: {
      users: { ...baseState, ...overrides },
    },
  });
};

const renderUsePull = (storeOverrides?: Partial<ReturnType<typeof usersReducer>>, listRefOverrides?: any) => {
  const onRefresh = vi.fn();
  const store = createStore(storeOverrides);
  const listRef = {
    current: { element: { scrollTop: 0 } },
    ...listRefOverrides,
  } as any;

  const { result } = renderHook(
    () =>
      usePullToRefresh({
        listRef,
        onRefresh,
        isLoading: storeOverrides?.searchStatus === 'loading' || false,
        threshold: 60,
        maxPull: 120,
      }),
    {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    },
  );

  return { result, onRefresh };
};

describe('usePullToRefresh', () => {
  it('calls onRefresh after pull passes the threshold', () => {
    const { result, onRefresh } = renderUsePull({ query: 'octo', searchStatus: 'idle' });

    act(() => {
      result.current.touchHandlers.onTouchStart({ touches: [{ clientY: 0 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchMove({ touches: [{ clientY: 100 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchEnd();
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('does not refresh while loading', () => {
    const { result, onRefresh } = renderUsePull({ query: 'octo', searchStatus: 'loading' });

    act(() => {
      result.current.touchHandlers.onTouchStart({ touches: [{ clientY: 0 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchMove({ touches: [{ clientY: 100 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchEnd();
    });

    expect(onRefresh).not.toHaveBeenCalled();
  });

  it('ignores pull when list is scrolled', () => {
    const { result, onRefresh } = renderUsePull({ query: 'octo', searchStatus: 'idle' }, { current: { element: { scrollTop: 10 } } });

    act(() => {
      result.current.touchHandlers.onTouchStart({ touches: [{ clientY: 0 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchMove({ touches: [{ clientY: 100 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchEnd();
    });

    expect(onRefresh).not.toHaveBeenCalled();
    expect(result.current.isPulling).toBe(false);
  });

  it('clamps pull distance to maxPull', () => {
    const { result } = renderUsePull({ query: 'octo', searchStatus: 'idle' });

    act(() => {
      result.current.touchHandlers.onTouchStart({ touches: [{ clientY: 0 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchMove({ touches: [{ clientY: 500 }] } as any);
    });

    expect(result.current.pullDistance).toBe(120);
    expect(result.current.isPulling).toBe(true);
  });

  it('resets state after touch end', () => {
    const { result } = renderUsePull({ query: 'octo', searchStatus: 'idle' });

    act(() => {
      result.current.touchHandlers.onTouchStart({ touches: [{ clientY: 0 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchMove({ touches: [{ clientY: 80 }] } as any);
    });
    act(() => {
      result.current.touchHandlers.onTouchEnd();
    });

    expect(result.current.pullDistance).toBe(0);
    expect(result.current.isPulling).toBe(false);
  });
});
