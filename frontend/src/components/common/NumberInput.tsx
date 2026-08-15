import { useState } from 'react';
import { TextField } from '@mui/material';

import type { TextFieldProps } from '@mui/material';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

export type NumberInputProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  value?: number;
  onChange: (value: number) => void;
  step?: number | string;
  min?: number;
};

export default function NumberInput({
  value,
  onChange,
  className,
  step = 'any',
  min = 0,
  placeholder = '0',
  disabled = false,
  onBlur,
  onFocus,
  onKeyDown,
  slotProps,
  sx,
  ...restProps
}: NumberInputProps) {
  const [prevValue, setPrevValue] = useState<number | undefined>(value);
  const [displayValue, setDisplayValue] = useState<string>(value === undefined || value === 0 ? '' : String(value));

  const isInteger = typeof step === 'number' ? Number.isInteger(step) : Number.isInteger(Number(step));

  if (value !== prevValue) {
    setPrevValue(value);

    const numericDisplay = displayValue === '' ? 0 : parseFloat(displayValue);
    if (value !== numericDisplay) {
      setDisplayValue(value === undefined || value === 0 ? '' : String(value));
    }
  }

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === '' || isNaN(parseFloat(val))) {
      setDisplayValue('');
      onChange(0);
    }

    onBlur?.(e);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    if (val === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    if (isInteger) {
      val = val.replace(/\D/g, '');
    } else {
      const parts = val.split('.');
      if (parts.length > 2) {
        val = `${parts[0]}.${parts.slice(1).join('')}`;
      }
    }

    setDisplayValue(val);

    const numericVal = parseFloat(val);
    if (!isNaN(numericVal)) {
      onChange(numericVal);
    }
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) {
      onKeyDown?.(e);
      return;
    }

    if (e.key === '.') {
      if (isInteger || e.currentTarget.value.includes('.')) {
        e.preventDefault();
        return;
      }
      onKeyDown?.(e);
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    onKeyDown?.(e);
  };

  const handleOnFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
    onFocus?.(e);
  };

  return (
    <TextField
      {...restProps}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      value={displayValue}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      onKeyDown={handleOnKeyDown}
      slotProps={{
        ...slotProps,
        htmlInput: {
          step,
          min,
          inputMode: isInteger ? 'numeric' : 'decimal',
          autocomplete: 'off',
          ...slotProps?.htmlInput,
        },
      }}
      sx={{
        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
        ...sx,
      }}
    />
  );
}
