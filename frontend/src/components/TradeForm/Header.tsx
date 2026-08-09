import type { ChangeEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, TextField } from '@mui/material';

import { DatePicker, TimePicker } from '@/components';
import NumberInput from '@/components/NumberInput';

import * as headerStyles from './Header.styles';
import * as commonStyles from '@/styles';
import { isNullEmptyOrWhitespace } from '@/utils';
import type { Trade } from '@trade-tracker/shared/types';

interface TradeFormHeaderProps {
  trade: Trade;
  setTrade: (trade: Trade) => void;
  isSubmitted: boolean;
}

export default function Header({ trade, setTrade, isSubmitted }: TradeFormHeaderProps) {
  const handleSymbolChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTrade({
      ...trade,
      symbol: event.target.value.replace(' ', '').toUpperCase()
    });

  const handleSectorChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTrade({
      ...trade,
      sector: event.target.value
    });

  const handleDateChange = (value: Dayjs | null) =>
    setTrade({
      ...trade,
      date: value?.startOf('day')?.format('YYYY-MM-DD') ?? ''
    });

  const handleNewsChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTrade({
      ...trade,
      news: event.target.value
    });

  const handleNewsTimeChange = (value: Dayjs | null) => {
    if (!value) {
      setTrade({
        ...trade,
        newsTime: ''
      });
      return;
    }

    const mergedDateTime = dayjs(trade.date)
      .hour(value.hour())
      .minute(value.minute())
      .second(0)
      .millisecond(0);

    setTrade({
      ...trade,
      newsTime: mergedDateTime.toISOString()
    });
  };

  return (
    <Box sx={headerStyles.formHeader}>
      <Box sx={headerStyles.formRow}>
        <TextField
          required
          label="Symbol"
          value={trade.symbol}
          onChange={handleSymbolChange}
        />
        <TextField
          required
          label="Sector"
          value={trade.sector}
          onChange={handleSectorChange}
          error={isSubmitted && isNullEmptyOrWhitespace(trade.sector)}
          helperText={isSubmitted && isNullEmptyOrWhitespace(trade.sector) ? 'Must not be empty or whitespace.' : ''}
          sx={commonStyles.flexPercent(50)}
        />
        <DatePicker
          label="Date"
          value={trade.date ? dayjs(trade.date) : dayjs()}
          onChange={handleDateChange}
          defaultValue={dayjs()}
          maxDate={dayjs()}
          sx={commonStyles.flexPercent(50)}
        />
      </Box>

      <Box sx={headerStyles.formRow}>
        <NumberInput
          required
          label="Volume"
          value={trade.volume}
          onChange={(val) => setTrade({ ...trade, volume: val })}
          error={isSubmitted && (trade.volume === null || trade.volume === undefined || trade.volume === 0)}
          helperText={isSubmitted && (trade.volume === null || trade.volume === undefined || trade.volume === 0) ? 'Must not be empty and must be greater than 0.' : ''}
          sx={{
            ...commonStyles.flexPercent(50),
            '& .MuiInputBase-input': { fontFamily: 'monospace' }
          }}
        />
        <NumberInput
          required
          label="Float"
          value={trade.float}
          onChange={(val) => setTrade({ ...trade, float: val })}
          error={isSubmitted && (trade.float === null || trade.float === undefined || trade.float === 0)}
          helperText={isSubmitted && (trade.float === null || trade.float === undefined || trade.float === 0) ? 'Must not be empty and must be greater than 0.' : ''}
          sx={{
            ...commonStyles.flexPercent(50),
            '& .MuiInputBase-input': { fontFamily: 'monospace' }
          }}
        />
      </Box>

      <Box sx={headerStyles.formRow}>
        <TextField
          label="News"
          name="news"
          value={trade.news}
          onChange={handleNewsChange}
          sx={commonStyles.flexPercent(75)}
        />
        <TimePicker
          label="Time"
          name="time"
          value={trade.newsTime ? dayjs(trade.newsTime) : null}
          onChange={handleNewsTimeChange}
          slotProps={{
            textField: {
              error: isSubmitted && isNullEmptyOrWhitespace(trade.newsTime) && !isNullEmptyOrWhitespace(trade.news),
              helperText: isSubmitted && isNullEmptyOrWhitespace(trade.newsTime) && !isNullEmptyOrWhitespace(trade.news)
                ? 'Please specify a time for the news'
                : ''
            }
          }}
        />
      </Box>
    </Box>
  );
}
