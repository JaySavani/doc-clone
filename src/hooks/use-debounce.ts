import { useCallback, useRef } from "react";

export function useDebounce<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(callback: T, delay: number = 500) {
  const timerRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => { 
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}
