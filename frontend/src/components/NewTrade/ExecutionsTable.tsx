import { useCallback, useEffect, useState } from 'react';
import { Checkbox, FormControl, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import ExecutionRow from './ExecutionRow.tsx';
import ExecutionsTableToolbar from './ExecutionsTableToolbar.tsx';

import type { Side } from '@trade-scope/shared/enums';
import type { Execution } from '@trade-scope/shared/types';
import type { Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';

interface ExecutionsTableProps {
  executions: Execution[];
  setExecutions: (executions: Execution[]) => void;
  isSubmitted: boolean;
}

export default function ExecutionsTable({ executions, setExecutions, isSubmitted }: ExecutionsTableProps) {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (executions.length === 0) {
      setExecutions([
        {
          id: 1,
          side: 0,
          price: '',
          order: 0,
          filled: 0,
          madeAt: '',
        },
      ]);
    }
  }, [setExecutions, executions]);

  const addExecution = useCallback(() => {
    const nextId = executions.length > 0 ? Math.max(...executions.map((t) => t.id)) + 1 : 1;

    setExecutions([
      ...executions,
      {
        id: nextId,
        side: 0,
        price: '',
        order: 0,
        filled: 0,
        madeAt: '',
      },
    ]);
  }, [setExecutions, executions]);

  const handleChange = (id: number, fieldName: string, value: string | number | Side | Dayjs) => {
    const newExecution = executions.map((execution) => {
      if (execution.id === id) {
        return {
          ...execution,
          [fieldName]: value,
        };
      }
      return execution;
    });

    setExecutions(newExecution);
  };

  const handleClick = (id: number) => {
    let newSelected: number[] = [];

    if (selected.indexOf(id) === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter((transactionId) => transactionId !== id);
    }

    setSelected(newSelected);
  };

  const handleDelete = () => {
    setExecutions(executions.filter((transaction) => !selected.includes(transaction.id)));

    setSelected([]);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setSelected([]);
      return;
    }

    setSelected(executions.map((n) => n.id));
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  return (
    <FormControl error={isSubmitted && executions.length < 2} fullWidth>
      <Paper variant='outlined' sx={{ borderColor: isSubmitted && executions.length < 2 ? 'error.main' : undefined }}>
        <ExecutionsTableToolbar selected={selected} addExecution={addExecution} handleDelete={handleDelete} />

        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  indeterminate={selected.length > 0 && selected.length < executions.length}
                  checked={executions.length > 0 && selected.length === executions.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>

              <TableCell>Side</TableCell>

              <TableCell>Price</TableCell>

              <TableCell>Order</TableCell>

              <TableCell>Filled</TableCell>

              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {executions.map((execution) => (
              <ExecutionRow
                key={execution.id}
                transaction={execution}
                isSelected={isSelected(execution.id)}
                onChange={handleChange}
                onClick={handleClick}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </FormControl>
  );
}
