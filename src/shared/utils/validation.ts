export const sanitizeInput = (value: string): string => value.trim();

export const hasXssPattern = (value: string): boolean => {
  const xssRegex = /<\/?\w+.*?>|\b(on\w+)\s*=|javascript:/gi;
  return xssRegex.test(value);
};
