import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton, TableCell, TableRow } from '@mui/material';

import { formatNumber } from '@/utils';
import { formatDate } from '@/utils/numberFormatters.ts';

import Detail from './Detail';

import type { TradeWithExecutions } from '@trade-scope/shared/types';

interface TradeRowProps {
  trade: TradeWithExecutions;
}

export default function Row({ trade }: TradeRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <>
      <TableRow hover onClick={toggleOpen} sx={{ cursor: 'pointer' }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen();
            }}
          >
            {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>

        <TableCell width={100}>{trade.symbol}</TableCell>

        <TableCell width={150}>{trade.sector}</TableCell>

        <TableCell width={120} align='right' sx={{ fontFamily: 'monospace' }}>
          {formatNumber(trade.volume)}
        </TableCell>

        <TableCell width={150} align='right' sx={{ fontFamily: 'monospace' }}>
          {formatDate(trade.date)}
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow>
          <TableCell colSpan={5}>
            <Detail trade={trade} isOpen={isOpen} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
