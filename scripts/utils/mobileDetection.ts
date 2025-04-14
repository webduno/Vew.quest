export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  )
} 

export const calculateAccuracy = (target: number, guess: number, isGauge: boolean = false): number => {
  if (isGauge) {
    // For gauge values with larger input numbers
    const difference = Math.abs(target - guess);
    // Handle wrap-around cases for inputs > 100
    const wrappedDifference = Math.min(difference, Math.abs(360 - difference));
    // Convert to percentage where 100% means perfect match
    const accuracy = Math.round((1 - (wrappedDifference / 180)) * 100);
    // Ensure result is between 0 and 100
    return Math.max(0, Math.min(100, accuracy));
  } else {
    // For regular values (0-100)
    const difference = Math.abs(target - guess);
    // Convert to percentage where 100% means perfect match
    return Math.round((1 - (difference / 100)) * 100);
  }
};
