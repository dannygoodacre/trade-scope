export const formatNumber = (value: number | bigint): string => Intl.NumberFormat('en-GB').format(Number(value));

export const formatDate = (dateTime: string | number | Date): string => {
  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const isNullEmptyOrWhitespace = (value: string | null | undefined): boolean =>
  value === null || value === undefined || value.trim().length === 0;
