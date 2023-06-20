export const isValidLUD16 = (val: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
};
