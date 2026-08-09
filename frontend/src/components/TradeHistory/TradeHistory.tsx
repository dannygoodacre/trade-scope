import React, { useState } from 'react';
import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

import usePaginatedTrades from '@/hooks/usePaginatedTrades/usePaginatedTrades';

import Row from './Row';

export default function TradeHistory() {
  const rowsPerPageOptions = [10, 25, 50];

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageLimit: 25
  });

  const { data: pageData, isLoading } = usePaginatedTrades(paginationModel.page + 1, paginationModel.pageLimit);

  const handleChangePage = (_: unknown, newPage: number) =>
    setPaginationModel(previous => ({
      ...previous,
      page: newPage
    }));

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPaginationModel(previous => ({
      ...previous,
      pageLimit: parseInt(event.target.value, 10),
      page: 0
    }));

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Paper sx={{ width: '100%', mb: 0, boxShadow: 'none' }}>
        {isLoading && <LinearProgress />}

        <TableContainer sx={{ maxHeight: 'none' }}>
          <Table stickyHeader aria-label='collapsible table' size='small'>
            <TableHead>
              <TableRow>
                <TableCell width={50} />
                <TableCell style={{ minWidth: 100, fontWeight: 'bold' }}>Symbol</TableCell>
                <TableCell style={{ minWidth: 150, fontWeight: 'bold' }}>Sector</TableCell>
                <TableCell align='right' style={{ minWidth: 120, fontWeight: 'bold' }}>
                  Volume
                </TableCell>
                <TableCell align='right' style={{ minWidth: 150, fontWeight: 'bold' }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageData && pageData.trades.length > 0
                ? pageData.trades.map(trade => <Row key={trade.id} trade={trade} />)
                : !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} align='center' sx={{ py: 3 }}>
                        No Trades Found
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component='div'
          count={pageData?.totalItems ?? 0}
          rowsPerPage={paginationModel.pageLimit}
          page={paginationModel.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
