import { useMemo } from 'react';
import {
  Box,
  Chip,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import type { TradeWithExecutions } from '@trade-scope/shared/types';

interface DetailProps {
  trade: TradeWithExecutions;
  isOpen: boolean;
}

export default function Detail({ trade, isOpen }: DetailProps) {
  const sortedExecutions = useMemo(() => {
    return [...trade.executions].sort((a, b) => new Date(a.madeAt).getTime() - new Date(b.madeAt).getTime());
  }, [trade.executions]);

  return (
    <Collapse in={isOpen} timeout='auto' unmountOnExit>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          m: 1,
          backgroundColor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5
        }}
      >
        <Table size='small' sx={{ mb: trade.news ? 2 : 0 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Time</TableCell>

              <TableCell align='center' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Side
              </TableCell>

              <TableCell align='right' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Price
              </TableCell>

              <TableCell align='right' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Order Qty
              </TableCell>

              <TableCell align='right' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Filled Qty
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedExecutions.map(execution => {
              const isBuy = execution.side === 0;
              return (
                <TableRow key={execution.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                    {new Date(execution.madeAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </TableCell>

                  <TableCell align='center'>
                    <Chip
                      label={isBuy ? 'BUY' : 'SELL'}
                      size='small'
                      sx={{
                        width: 52,
                        height: 20,
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        borderRadius: '4px',
                        backgroundColor: 'action.hover',
                        color: isBuy ? 'success.main' : 'error.main',
                        border: '1px solid',
                        borderColor: isBuy ? 'success.light' : 'error.light',
                        '& .MuiChip-label': {
                          px: 0,
                          width: '100%',
                          textAlign: 'center'
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell align='right' sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                    {execution.price}
                  </TableCell>

                  <TableCell align='right' sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                    {execution.order}
                  </TableCell>

                  <TableCell align='right' sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                    {execution.filled}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {trade.news && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: 'action.hover',
              borderRadius: 1,
              borderLeft: '3px solid',
              borderColor: 'primary.main'
            }}
          >
            <Typography variant='body2' color='text.secondary'>
              <Box component='span' sx={{ fontWeight: 600, color: 'text.primary', mr: 0.5 }}>
                News:
              </Box>

              {trade.news}
            </Typography>
          </Box>
        )}
      </Paper>
    </Collapse>
  );
}
