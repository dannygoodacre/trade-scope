export const isNullEmptyOrWhitespace = (value: string | null | undefined): boolean =>
  value === null || value === undefined || value.trim().length === 0;
