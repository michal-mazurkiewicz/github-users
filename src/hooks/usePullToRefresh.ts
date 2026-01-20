import { useCallback, useRef, useState, type RefObject, type TouchEvent } from 'react';
import type { ListImperativeAPI } from 'react-window';

type UsePullToRefreshOptions = {
  listRef: RefObject<ListImperativeAPI>;
  onRefresh: () => void;
  isLoading: boolean;
  threshold?: number;
  maxPull?: number;
};

type UsePullToRefreshResult = {
  pullDistance: number;
  isPulling: boolean;
  touchHandlers: {
    onTouchStart: (event: TouchEvent<HTMLDivElement>) => void;
    onTouchMove: (event: TouchEvent<HTMLDivElement>) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
  };
};

const DEFAULT_THRESHOLD = 60;
const DEFAULT_MAX_PULL = 120;

export function usePullToRefresh({
  listRef,
  onRefresh,
  isLoading,
  threshold = DEFAULT_THRESHOLD,
  maxPull = DEFAULT_MAX_PULL,
}: UsePullToRefreshOptions): UsePullToRefreshResult {
  const touchStartYRef = useRef<number | null>(null);
  const pullDistanceRef = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  const resetPull = () => {
    touchStartYRef.current = null;
    pullDistanceRef.current = 0;
    setIsPulling(false);
    setPullDistance(0);
  };

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const element = listRef.current?.element;
      if (!element || element.scrollTop > 0) {
        touchStartYRef.current = null;
        return;
      }

      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    },
    [listRef],
  );

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY ?? 0;
    const distance = Math.max(0, currentY - touchStartYRef.current);
    if (distance <= 0) {
      return;
    }
    const nextDistance = Math.min(maxPull, distance);
    pullDistanceRef.current = nextDistance;
    setPullDistance(nextDistance);
    setIsPulling(true);
  };

  const handleTouchEnd = () => {
    if (touchStartYRef.current === null) {
      return;
    }

    const shouldRefresh = pullDistanceRef.current >= threshold;
    resetPull();

    if (shouldRefresh && !isLoading) {
      onRefresh();
    }
  };

  return {
    pullDistance,
    isPulling,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}
