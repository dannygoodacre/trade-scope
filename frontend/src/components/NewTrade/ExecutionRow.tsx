import { Checkbox, TableCell, TableRow } from '@mui/material';
import dayjs from 'dayjs';

import NumberInput from '@/components/common/NumberInput';
import SideToggleButton from '@/components/common/SideToggleButton';
import TimePicker from '@/components/common/TimePicker';

import type { Side } from '@trade-scope/shared/enums';
import type { Execution } from '@trade-scope/shared/types';
import type { Dayjs } from 'dayjs';

interface ExecutionRowProps {
  execution: Execution;
  isSelected: boolean;
  onChange: (id: number, fieldName: string, value: string | number | Side | Dayjs) => void;
  onClick: (id: number) => void;
}

const MONOSPACE_INPUT_SX = {
  '& .MuiInputBase-input': { fontFamily: 'monospace' },
} as const;

export default function ExecutionRow({ execution, isSelected, onChange, onClick }: ExecutionRowProps) {
  const handleTimeChange = (value: Dayjs | null) => onChange(execution.id, 'madeAt', value?.toISOString() ?? '');

  return (
    <TableRow
      role='checkbox'
      tabIndex={-1}
      key={execution.id}
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
        <Checkbox color='primary' checked={isSelected} onClick={() => onClick(execution.id)} />
      </TableCell>

      <TableCell>
        <SideToggleButton id={execution.id} onToggle={(id, value) => onChange(id, 'side', value)} />
      </TableCell>

      <TableCell>
        <NumberInput
          value={typeof execution.price === 'number' ? execution.price : parseFloat(execution.price as string) || 0}
          onChange={(val) => onChange(execution.id, 'price', val.toString())}
          sx={MONOSPACE_INPUT_SX}
        />
      </TableCell>

      <TableCell>
        <NumberInput
          value={execution.order}
          step={1}
          onChange={(val) => onChange(execution.id, 'order', val)}
          sx={MONOSPACE_INPUT_SX}
        />
      </TableCell>

      <TableCell>
        <NumberInput
          value={execution.filled}
          step={1}
          onChange={(val) => onChange(execution.id, 'filled', val)}
          sx={MONOSPACE_INPUT_SX}
        />
      </TableCell>

      <TableCell>
        <TimePicker
          value={execution.madeAt ? dayjs(execution.madeAt) : null}
          onChange={handleTimeChange}
          views={['hours', 'minutes', 'seconds']}
        />
      </TableCell>
    </TableRow>
  );
}
