export const sanitizeAndParseInteger = (value: string): number | null => {
  const sanitizedValue = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');

  return sanitizedValue === '' ? null : parseInt(sanitizedValue, 10);
};
