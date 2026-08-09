import { useCallback, useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import TransactionsTableToolbar from '@/components/TradeForm/TransactionsTableToolbar.tsx';

import TransactionRow from './TransactionRow';

import type { Side } from '@trade-scope/shared/enums';
import type { Execution } from '@trade-scope/shared/types';
import type { Dayjs } from 'dayjs';
import type { ChangeEvent } from 'react';

interface TransactionsTableProps {
  executions: Execution[];
  setExecutions: (executions: Execution[]) => void;
  isSubmitted: boolean;
}

export default function TransactionsTable({ executions, setExecutions, isSubmitted }: TransactionsTableProps) {
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
          madeAt: ''
        }
      ]);
    }
  }, [setExecutions, executions]);

  const addTransaction = useCallback(() => {
    const nextId = executions.length > 0 ? Math.max(...executions.map(t => t.id)) + 1 : 1;

    setExecutions([
      ...executions,
      {
        id: nextId,
        side: 0,
        price: '',
        order: 0,
        filled: 0,
        madeAt: ''
      }
    ]);
  }, [setExecutions, executions]);

  const handleChange = (id: number, fieldName: string, value: string | number | Side | Dayjs) => {
    const newTransactions = executions.map(transaction => {
      if (transaction.id === id) {
        return {
          ...transaction,
          [fieldName]: value
        };
      }
      return transaction;
    });

    setExecutions(newTransactions);
  };

  const handleClick = (id: number) => {
    let newSelected: number[] = [];

    if (selected.indexOf(id) === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter(transactionId => transactionId !== id);
    }

    setSelected(newSelected);
  };

  const handleDelete = () => {
    setExecutions(executions.filter(transaction => !selected.includes(transaction.id)));

    setSelected([]);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setSelected([]);
      return;
    }

    setSelected(executions.map(n => n.id));
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  return (
    <FormControl error={isSubmitted && executions.length < 2} fullWidth>
      <Paper variant='outlined' sx={{ borderColor: isSubmitted && executions.length < 2 ? 'error.main' : undefined }}>
        <TransactionsTableToolbar selected={selected} addTransaction={addTransaction} handleDelete={handleDelete} />

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
            {executions.map(transaction => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isSelected={isSelected(transaction.id)}
                onChange={handleChange}
                onClick={handleClick}
              />
            ))}
          </TableBody>
        </Table>
      </Paper>

      {isSubmitted && executions.length < 2 && <FormHelperText>At least two transactions are required</FormHelperText>}
    </FormControl>
  );
}
