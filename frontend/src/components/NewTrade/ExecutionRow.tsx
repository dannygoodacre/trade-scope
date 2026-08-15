import { Checkbox, TableCell, TableRow } from '@mui/material';
import dayjs from 'dayjs';

import NumberInput from '@/components/common/NumberInput';
import SideToggleButton from '@/components/common/SideToggleButton';
import TimePicker from '@/components/common/TimePicker';

import type { Side } from '@trade-scope/shared/enums';
import type { Execution } from '@trade-scope/shared/types';
import type { Dayjs } from 'dayjs';

interface ExecutionRowProps {
  transaction: Execution;
  isSelected: boolean;
  onChange: (id: number, fieldName: string, value: string | number | Side | Dayjs) => void;
  onClick: (id: number) => void;
}

const MONOSPACE_INPUT_SX = {
  '& .MuiInputBase-input': { fontFamily: 'monospace' },
} as const;

export default function ExecutionRow({ transaction, isSelected, onChange, onClick }: ExecutionRowProps) {
  const handleTimeChange = (value: Dayjs | null) => onChange(transaction.id, 'madeAt', value?.toISOString() ?? '');

  return (
    <TableRow
      role='checkbox'
      tabIndex={-1}
      key={transaction.id}
      selected={isSelected}
      sx={{
        '&:hover': {
          backgroundColor: 'inherit',
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'action.selected',
        },
      }}
    >
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
          onChange={(val) => onChange(transaction.id, 'price', val.toString())}
          sx={MONOSPACE_INPUT_SX}
        />
      </TableCell>

      <TableCell>
        <NumberInput
          value={transaction.order}
          step={1}
          onChange={(val) => onChange(transaction.id, 'order', val)}
          sx={MONOSPACE_INPUT_SX}
        />
      </TableCell>

      <TableCell>
        <NumberInput
          value={transaction.filled}
          step={1}
          onChange={(val) => onChange(transaction.id, 'filled', val)}
          sx={MONOSPACE_INPUT_SX}
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
