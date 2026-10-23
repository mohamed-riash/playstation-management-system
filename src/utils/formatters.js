/**
 * Formatting helpers for Egyptian Pound currency, session durations, and Arabic dates/times.
 */

export const formatCurrency = (amount) => {
  const numeric = Number(amount) || 0;
  return `${numeric.toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ج.م`;
};

export const formatCurrencyEn = (amount) => {
  const numeric = Number(amount) || 0;
  return `${numeric.toFixed(2)} EGP`;
};

export const formatDuration = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) {
    return '00:00:00';
  }
  const sec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatDurationHuman = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 60) return 'أقل من دقيقة';
  const sec = Math.floor(totalSeconds);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (minutes > 0) parts.push(`${minutes} دقيقة`);
  return parts.join(' و ');
};

export const formatTime = (dateInput) => {
  if (!dateInput) return '--:--';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ar-EG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  return `${formatDate(dateInput)} - ${formatTime(dateInput)}`;
};

/**
 * Calculate cost for a session based on seconds elapsed and hourly rate.
 * Uses exact proportional minute calculation, rounded to 2 decimal places.
 */
export const calculateSessionCost = (seconds, hourlyRate) => {
  if (!seconds || !hourlyRate) return 0;
  // Calculate cost based on exact seconds, minimum 1 minute
  const effectiveSeconds = Math.max(60, seconds);
  const cost = (effectiveSeconds / 3600) * hourlyRate;
  return Math.round(cost * 100) / 100;
};
