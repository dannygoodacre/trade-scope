import { Box, TextField } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import DatePicker from '@/components/common/DatePicker';
import NumberInput from '@/components/common/NumberInput';
import TimePicker from '@/components/common/TimePicker';
import { isNullEmptyOrWhitespace } from '@/utils';

import type { Trade } from '@trade-scope/shared/types';
import type { ChangeEvent } from 'react';

const FORM_ROW_SX = {
  display: 'flex',
  gap: 2,
  mb: 3,
  width: '100%',
} as const;

const MONOSPACE_FLEX_INPUT_SX = {
  flex: 1,
  '& .MuiInputBase-input': { fontFamily: 'monospace' },
} as const;

interface TradeFormHeaderProps {
  trade: Trade;
  setTrade: (trade: Trade) => void;
  isSubmitted: boolean;
}

export default function Header({ trade, setTrade, isSubmitted }: TradeFormHeaderProps) {
  const handleSymbolChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTrade({
      ...trade,
      symbol: event.target.value.replace(/\s/g, '').toUpperCase(),
    });
  };

  const handleSectorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTrade({
      ...trade,
      sector: event.target.value,
    });
  };

  const handleDateChange = (value: Dayjs | null) => {
    const newDateStr = value?.startOf('day')?.format('YYYY-MM-DD') ?? '';

    let updatedNewsTime = trade.newsTime;

    if (trade.newsTime && value) {
      const existingTime = dayjs(trade.newsTime);
      updatedNewsTime = value
        .hour(existingTime.hour())
        .minute(existingTime.minute())
        .second(0)
        .millisecond(0)
        .toISOString();
    }

    setTrade({
      ...trade,
      date: newDateStr,
      newsTime: updatedNewsTime,
    });
  };

  const handleNewsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTrade({
      ...trade,
      news: event.target.value,
    });
  };

  const handleNewsTimeChange = (value: Dayjs | null) => {
    if (!value) {
      setTrade({ ...trade, newsTime: '' });
      return;
    }

    const mergedDateTime = dayjs(trade.date || undefined)
      .hour(value.hour())
      .minute(value.minute())
      .second(0)
      .millisecond(0);

    setTrade({
      ...trade,
      newsTime: mergedDateTime.toISOString(),
    });
  };

  const isSectorInvalid = isSubmitted && isNullEmptyOrWhitespace(trade.sector);

  const isVolumeInvalid = isSubmitted && (!trade.volume || trade.volume <= 0);

  const isFloatInvalid = isSubmitted && (!trade.float || trade.float <= 0);

  const hasNewsText = !isNullEmptyOrWhitespace(trade.news);

  const isNewsTimeMissing = isNullEmptyOrWhitespace(trade.newsTime);

  const isNewsTimeInvalid = isSubmitted && hasNewsText && isNewsTimeMissing;

  return (
    <Box sx={{ width: '100%', mb: 1 }}>
      <Box sx={FORM_ROW_SX}>
        <TextField required label='Symbol' value={trade.symbol} onChange={handleSymbolChange} sx={{ flex: 1 }} />

        <TextField
          required
          label='Sector'
          value={trade.sector}
          onChange={handleSectorChange}
          error={isSectorInvalid}
          helperText={isSectorInvalid ? 'Must not be empty or whitespace.' : ''}
          sx={{ flex: 2 }}
        />

        <DatePicker
          label='Date'
          value={trade.date ? dayjs(trade.date) : dayjs()}
          onChange={handleDateChange}
          defaultValue={dayjs()}
          maxDate={dayjs()}
          sx={{ flex: 2 }}
        />
      </Box>

      <Box sx={FORM_ROW_SX}>
        <NumberInput
          required
          label='Volume'
          value={trade.volume}
          onChange={(val) => setTrade({ ...trade, volume: val })}
          error={isVolumeInvalid}
          helperText={isVolumeInvalid ? 'Must not be empty and must be greater than 0.' : ''}
          sx={MONOSPACE_FLEX_INPUT_SX}
        />

        <NumberInput
          required
          label='Float'
          value={trade.float}
          onChange={(val) => setTrade({ ...trade, float: val })}
          error={isFloatInvalid}
          helperText={isFloatInvalid ? 'Must not be empty and must be greater than 0.' : ''}
          sx={MONOSPACE_FLEX_INPUT_SX}
        />
      </Box>

      <Box sx={FORM_ROW_SX}>
        <TextField label='News' name='news' value={trade.news} onChange={handleNewsChange} sx={{ flex: 3 }} />

        <TimePicker
          label='Time'
          name='time'
          value={trade.newsTime ? dayjs(trade.newsTime) : null}
          onChange={handleNewsTimeChange}
          slotProps={{
            textField: {
              error: isNewsTimeInvalid,
              helperText: isNewsTimeInvalid ? 'Please specify a time for the news' : '',
              sx: { flex: 1 },
            },
          }}
        />
      </Box>
    </Box>
  );
}
