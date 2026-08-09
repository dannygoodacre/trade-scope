export const sanitizeAndParseFloat = (value: string): number | null => {
  const sanitizedValue = value
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .replace(/^0+(?=\d)/, '');

  if (sanitizedValue === '' || sanitizedValue === '.') {
    return null;
  }

  const parsed = parseFloat(sanitizedValue);

  return Number.isNaN(parsed) ? null : parsed;
};

export const sanitizeAndParseInteger = (value: string): number | null => {
  const sanitizedValue = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');

  return sanitizedValue === '' ? null : parseInt(sanitizedValue, 10);
};
