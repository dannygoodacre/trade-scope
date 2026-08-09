export const formatNumber = (value: number | bigint): string =>
  Intl.NumberFormat('en-GB').format(Number(value))

export const formatWithCommas = (value: string): string => {
  if (!value) {
    return '';
  }

  const [integerPart, decimalPart] = value.split('.');

  const formattedInteger = Number(integerPart).toLocaleString('en-GB');

  return decimalPart != null
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

export const foo = (dateTime: any): string =>
{
  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
