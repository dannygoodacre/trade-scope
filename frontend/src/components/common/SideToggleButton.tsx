import { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { Side } from '@trade-tracker/shared/enums.ts';

interface SideToggleButtonProps {
  id: number;
  onToggle: (id: number, side: Side) => void;
}

export default function SideToggleButton({ id, onToggle }: SideToggleButtonProps) {
  const [label, setLabel] = useState<string>('BUY');

  const handleToggle = () => {
    const nextLabel = label === 'BUY' ? 'SELL' : 'BUY';

    const nextSide = nextLabel === 'BUY' ? Side.Buy : Side.Sell;

    setLabel(nextLabel);

    onToggle(id, nextSide);
  };

  // TODO: buy green, sell red
  return (
    <Tooltip title={`Switch to ${label === 'BUY' ? 'SELL' : 'BUY'}`}>
      <Button onClick={handleToggle}>{label}</Button>
    </Tooltip>
  );
}
