import { formatWithCommas, sanitizeAndParseFloat, sanitizeAndParseInteger } from '@/utils/index.ts';

import type { ChangeEvent } from 'react';

export const numericChangeHandler =
  (type: 'int' | 'float', setValue: (value: string) => void, onParsed: (value: number) => void) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const regex = type === 'float' ? /^\d*\.?\d*$/ : /^\d*$/;

    if (!regex.test(value)) {
      return;
    }

    setValue(value);

    const parsed = type === 'float' ? sanitizeAndParseFloat(value) : sanitizeAndParseInteger(value);

    if (parsed !== null) {
      onParsed(parsed);
    }
  };

export const numericBlurHandler = (value: string, setValue: (value: string) => void) => () => {
  if (value !== '') {
    setValue(formatWithCommas(value.replace(/,/g, '')));
  }
};
