import { useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { ApiError } from '@/error';
import useNewTrade from '@/hooks/useNewTrade';
import * as styles from '@/styles/common';

import ExecutionsTable from './ExecutionsTable';
import Header from './Header';

import type { AlertColor } from '@mui/material';
import type {
  Execution,
  NewTrade,
  Trade,
  TradeWithExecutions,
  ValidationProblemDetails,
} from '@trade-scope/shared/types';
import type { JSX, SyntheticEvent } from 'react';

interface FormStatus {
  open: boolean;
  type: AlertColor;
  message: JSX.Element | string;
}

const initialTradeState: TradeWithExecutions = {
  id: 0,
  symbol: '',
  sector: '',
  date: dayjs().startOf('day').format('YYYY-MM-DD'),
  volume: 0,
  float: 0,
  news: '',
  newsTime: '',
  executions: [],
};

const formatValidationError = (details: ValidationProblemDetails): JSX.Element | string => {
  const title = details.title || 'Validation Error';

  if (!details.errors || Object.keys(details.errors).length === 0) {
    return title;
  }

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
      {details.errors.map((error, index) => {
        const fieldName = error.pointer.replace(/^\//, '') || 'general';

        return (
          <div key={`${error.pointer}-${index}`} style={{ fontSize: '0.875rem' }}>
            - <strong>{fieldName}:</strong> {error.message}
          </div>
        );
      })}
    </div>
  );
};

export default function NewTrade() {
  const [trade, setTrade] = useState<Trade>(initialTradeState);

  const [executions, setExecutions] = useState<Execution[]>([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [status, setStatus] = useState<FormStatus>({
    open: false,
    type: 'info',
    message: '',
  });

  const closeSnackbar = () => {
    setStatus((prev) => ({ ...prev, open: false }));
  };

  const handleInteract = () => {
    setIsSubmitted(false);

    closeSnackbar();
  };

  const { mutate, isPending } = useNewTrade();

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitted(true);

    if (executions.length < 2) {
      setStatus({
        open: true,
        type: 'error',
        message: 'A valid trade requires at least two executions (e.g. an entry and exit).',
      });
      return;
    }

    const updatedExecutions = executions.map((execution) => ({
      ...execution,
      madeAt: `${trade.date}${execution.madeAt.slice(10)}`,
    }));

    const payload: NewTrade = {
      ...trade,
      executions: updatedExecutions,
    };

    mutate(payload, {
      onSuccess: () => {
        setStatus({ open: true, type: 'success', message: 'Trade saved successfully!' });

        setTrade(initialTradeState);

        setExecutions([]);

        setIsSubmitted(false);
      },
      onError: (err: unknown) => {
        let displayMessage: JSX.Element | string = 'An unexpected error occurred.';

        if (err instanceof ApiError && err.details) {
          displayMessage = formatValidationError(err.details);
        } else if (err instanceof Error) {
          displayMessage = err.message;
        }

        setStatus({ open: true, type: 'error', message: displayMessage });
      },
    });
  };

  const handleCloseSnackbar = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'clickaway') {
      closeSnackbar();
    }
  };

  return (
    <Box sx={styles.container} onClick={handleInteract}>
      <Typography variant='h4' gutterBottom>
        New Trade
      </Typography>

      <form onSubmit={handleSubmit} onChange={closeSnackbar}>
        <Header trade={trade} setTrade={setTrade} isSubmitted={isSubmitted} />

        <ExecutionsTable executions={executions} setExecutions={setExecutions} isSubmitted={isSubmitted} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type='submit' variant='contained' size='large' disabled={isPending}>
            {isPending ? 'Saving...' : 'Submit'}
          </Button>
        </Box>

        <Snackbar
          open={status.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={status.type} variant='filled' sx={{ width: '100%' }}>
            {status.message}
          </Alert>
        </Snackbar>
      </form>
    </Box>
  );
}
