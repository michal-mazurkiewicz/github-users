import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as router from 'react-router';
import { useGoBack } from '../../hooks/useGoBack';

const navigate = vi.fn();

beforeEach(() => {
  vi.spyOn(router, 'useNavigate').mockReturnValue(navigate);
});

afterEach(() => {
  vi.restoreAllMocks();
  navigate.mockReset();
  window.history.replaceState(null, '', '/');
});

describe('useGoBack', () => {
  it('navigates back when there is in-app history', () => {
    window.history.replaceState({ idx: 2 }, '', '/current');

    const { result } = renderHook(() => useGoBack('/fallback'));

    act(() => {
      result.current();
    });

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('falls back when there is no in-app history', () => {
    window.history.replaceState({ idx: 0 }, '', '/current');

    const { result } = renderHook(() => useGoBack('/fallback'));

    act(() => {
      result.current();
    });

    expect(navigate).toHaveBeenCalledWith('/fallback', { replace: true });
  });
});
