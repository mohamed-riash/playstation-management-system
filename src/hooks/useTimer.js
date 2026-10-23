import { useState, useEffect } from 'react';

/**
 * useTimer custom hook that calculates live seconds elapsed / remaining
 * using true wall-clock time deltas, ensuring accuracy across backgrounding or reloads.
 */
export function useTimer(session, warningMinutes = 5) {
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    if (!session || session.isPaused) return;

    const interval = setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.isPaused, session?.startTime]);

  if (!session || !session.startTime) {
    return {
      elapsedSeconds: 0,
      remainingSeconds: 0,
      totalSeconds: 0,
      progressPercent: 0,
      isTimeUp: false,
      isWarning: false,
      isPaused: false,
    };
  }

  const now = session.isPaused && session.pausedAt ? session.pausedAt : Date.now();
  const pausedAccumulated = session.pausedDuration || 0;
  const elapsedMillis = Math.max(0, now - session.startTime - pausedAccumulated);
  const elapsedSeconds = Math.floor(elapsedMillis / 1000);

  if (session.type === 'fixed' && session.durationMinutes) {
    const totalSeconds = session.durationMinutes * 60;
    const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
    const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100));
    const isTimeUp = remainingSeconds <= 0;
    const isWarning = !isTimeUp && remainingSeconds <= (warningMinutes * 60);

    return {
      elapsedSeconds,
      remainingSeconds,
      totalSeconds,
      progressPercent,
      isTimeUp,
      isWarning,
      isPaused: Boolean(session.isPaused),
    };
  }

  // Open-ended session
  return {
    elapsedSeconds,
    remainingSeconds: null,
    totalSeconds: null,
    progressPercent: null,
    isTimeUp: false,
    isWarning: false,
    isPaused: Boolean(session.isPaused),
  };
}
