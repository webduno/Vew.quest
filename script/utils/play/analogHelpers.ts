/**
 * Converts radians to degrees and normalizes to 0-360 range
 * @param rotation - Rotation value in radians
 * @returns Normalized rotation in degrees (0-360)
 */
export const normalizeRotation = (rotation: number): number => {
  // Convert radians to degrees
  const degrees = (rotation * 180 / Math.PI) % 360;
  // Normalize to 0-360
  return degrees < 0 ? degrees + 360 : degrees;
};

/**
 * Button colors used in the analog modal
 */
export const buttonColors = ['#ff5555', '#55ff55', '#ffff55', '#55ffff'];

/**
 * Button types used in the analog modal
 */
export const buttonTypes = ['Object', 'Entity', 'Place', 'Event']; 