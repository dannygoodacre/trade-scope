import { type FormEvent, type JSX, useState } from 'react';

import dayjs from 'dayjs';
import { Alert, type AlertColor, Box, Button, Typography } from '@mui/material';

import * as styles from '@/styles';

import { addTrade } from '@/api/trade';
import { ApiError,  type ValidationProblemDetails } from '@/types';
import Header from './Header';
import TransactionsTable from './TransactionsTable';
import type { Execution, Trade } from '@trade-tracker/shared/types';

interface FormStatus {
  type: AlertColor | null;
  message: JSX.Element | string;
}

export default function NewTrade() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  
  const initialTradeState = {
    id: 0,
    symbol: '',
    sector: '',
    date: dayjs().startOf('day').format('YYYY-MM-DD'),
    volume: 0,
    float: 0,
    news: '',
    newsTime: '',
    executions: executions
  };

  const [trade, setTrade] = useState<Trade>(initialTradeState);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [status, setStatus] = useState<FormStatus>({ type: null, message: '' });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const updatedTransactions = executions.map(transaction => ({
      ...transaction,
      madeAt: `${trade.date}${transaction.madeAt.slice(10)}`
    }));

    const finalTradeData = {
      ...trade,
      transactions: updatedTransactions
    };

    setExecutions(updatedTransactions);
    setTrade(finalTradeData);
    setIsSubmitted(true);

    try {
      await addTrade(trade, updatedTransactions);

      setStatus({ type: 'success', message: 'Trade saved successfully!' });
      setTrade(initialTradeState);
      setExecutions([]);
      setIsSubmitted(false);

    } catch (err: unknown) {
      let displayMessage: JSX.Element | string = "An unexpected error occurred.";

      if (err instanceof ApiError && err.details) {
        displayMessage = formatValidationError(err.details);
      } else if (err instanceof Error) {
        displayMessage = err.message;
      }

      setStatus({ type: 'error', message: displayMessage });
    }
  };

  const onFormChange = () => {
    if (status.message) {
      setStatus({type: null, message: ''});
    }
  }

  const formatValidationError = (details: ValidationProblemDetails): JSX.Element | string => {
    const title = details.title || "Validation Error";

    if (!details.errors || Object.keys(details.errors).length === 0) {
      return title;
    }

    return (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
        {Object.entries(details.errors).map(([field, messages]) => (
          <div key={field} style={{ fontSize: '0.875rem' }}>
            • <strong>{field}:</strong> {messages.join(", ")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>New Trade</Typography>

      {status.type && status.message && (
        <Alert
          severity={status.type}
          sx={{ mb: 2 }}
          onClose={() => setStatus({ type: null, message: '' })}
        >
          {status.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} onChange={onFormChange}>
        <Header trade={trade} setTrade={setTrade} isSubmitted={isSubmitted} />

        <TransactionsTable executions={executions} setExecutions={setExecutions} isSubmitted={isSubmitted} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type="submit" variant="contained" size="large">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
