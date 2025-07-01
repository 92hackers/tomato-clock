/**
 * Format seconds into MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "25:00", "05:30")
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format seconds into human-readable duration
 * @param seconds - Time in seconds
 * @returns Human-readable duration (e.g., "25 minutes", "1 hour 30 minutes")
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
};

/**
 * Convert minutes to seconds
 * @param minutes - Time in minutes
 * @returns Time in seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Convert seconds to minutes
 * @param seconds - Time in seconds
 * @returns Time in minutes (rounded)
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.round(seconds / 60);
};

/**
 * Calculate progress percentage
 * @param elapsed - Elapsed time in seconds
 * @param total - Total duration in seconds
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (elapsed: number, total: number): number => {
  if (total <= 0) return 0;
  const progress = (elapsed / total) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

/**
 * Get time zone aware date string for today
 * @returns Date string in YYYY-MM-DD format for local timezone
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toLocaleDateString('sv-SE'); // YYYY-MM-DD format
};

/**
 * Check if a date is today in local timezone
 * @param date - Date to check
 * @returns True if the date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Format a date for display
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string => {
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
