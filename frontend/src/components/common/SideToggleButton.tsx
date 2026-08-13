import { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { Side } from '@trade-scope/shared/enums';

interface SideToggleButtonProps {
  id: number;
  onToggle: (id: number, side: Side) => void;
}

export default function SideToggleButton({ id, onToggle }: SideToggleButtonProps) {
  const [label, setLabel] = useState<string>('BUY');
  const isBuy = label === 'BUY';

  const handleToggle = () => {
    const nextLabel = isBuy ? 'SELL' : 'BUY';
    const nextSide = nextLabel === 'BUY' ? Side.Buy : Side.Sell;

    setLabel(nextLabel);
    onToggle(id, nextSide);
  };

  return (
    <Tooltip title={`Switch to ${isBuy ? 'SELL' : 'BUY'}`}>
      <Button
        variant='outlined'
        size='small'
        onClick={handleToggle}
        sx={{
          fontWeight: 700,
          color: isBuy ? 'success.main' : 'error.main',
          borderColor: isBuy ? 'success.light' : 'error.light',
          backgroundColor: 'action.hover',
          '&:hover': {
            borderColor: isBuy ? 'success.main' : 'error.main',
            backgroundColor: 'action.selected',
          },
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );
}
