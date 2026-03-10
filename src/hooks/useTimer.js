import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer({ duration = 30, autoStart = false, onExpire } = {}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 0.1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }

        return Number((previous - 0.1).toFixed(1));
      });
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (nextDuration = duration, shouldStart = autoStart) => {
      setTimeLeft(nextDuration);
      setIsRunning(shouldStart);
    },
    [autoStart, duration],
  );

  return {
    timeLeft,
    secondsLeft: Math.ceil(timeLeft),
    progress: duration === 0 ? 0 : timeLeft / duration,
    isRunning,
    start,
    pause,
    reset,
  };
}
