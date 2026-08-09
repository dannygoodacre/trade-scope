import { Checkbox, TableCell, TableRow } from '@mui/material';
import dayjs from 'dayjs';

import { SideToggleButton, TimePicker } from '@/components';
import NumberInput from '@/components/common/NumberInput.tsx';

import type { Side } from '@trade-tracker/shared/enums';
import type { Execution } from '@trade-tracker/shared/types';
import type { Dayjs } from 'dayjs';

interface TransactionRowProps {
  transaction: Execution;
  isSelected: boolean;
  onChange: (id: number, fieldName: string, value: string | number | Side | Dayjs) => void;
  onClick: (id: number) => void;
}

export default function TransactionRow({ transaction, isSelected, onChange, onClick }: TransactionRowProps) {
  const handleTimeChange = (value: Dayjs | null) => onChange(transaction.id, 'madeAt', value?.toISOString() ?? '');

  const monospaceInputSx = {
    '& .MuiInputBase-input': { fontFamily: 'monospace' }
  };

  return (
    <TableRow hover role='checkbox' tabIndex={-1} key={transaction.id} selected={isSelected}>
      <TableCell padding='checkbox'>
        <Checkbox color='primary' checked={isSelected} onClick={() => onClick(transaction.id)} />
      </TableCell>

      <TableCell>
        <SideToggleButton id={transaction.id} onToggle={(id, value) => onChange(id, 'side', value)} />
      </TableCell>

      <TableCell>
        <NumberInput
          value={
            typeof transaction.price === 'number' ? transaction.price : parseFloat(transaction.price as string) || 0
          }
          onChange={val => onChange(transaction.id, 'price', val)}
          sx={monospaceInputSx}
        />
      </TableCell>

      <TableCell>
        <NumberInput
          value={transaction.order}
          step={1}
          onChange={val => onChange(transaction.id, 'order', val)}
          sx={monospaceInputSx}
        />
      </TableCell>

      <TableCell>
        <NumberInput
          value={transaction.filled}
          step={1}
          onChange={val => onChange(transaction.id, 'filled', val)}
          sx={monospaceInputSx}
        />
      </TableCell>

      <TableCell>
        <TimePicker
          value={transaction.madeAt ? dayjs(transaction.madeAt) : null}
          onChange={handleTimeChange}
          views={['hours', 'minutes', 'seconds']}
        />
      </TableCell>
    </TableRow>
  );
}
