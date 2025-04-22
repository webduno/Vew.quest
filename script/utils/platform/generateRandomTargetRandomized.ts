export function generateRandomTargetRandomized() {
  // Generate random 8-digit code in format XXXX-XXXX
  const code = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
  // random type 1-4 obejct, entity, place, event
  const typeNum = Math.floor(Math.random() * 4) + 1;
  const typeString = ['object', 'entity', 'place', 'event'][typeNum - 1];
  return {
    code,
    values: {
      type: typeString,
      natural: Math.floor(Math.random() * 100),
      temp: Math.floor(Math.random() * 100),
      light: Math.floor(Math.random() * 100),
      color: Math.floor(Math.random() * 100),
      solid: Math.floor(Math.random() * 100),
      confidence: Math.floor(Math.random() * 100),
    }
  };
}
