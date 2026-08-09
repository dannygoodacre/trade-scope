import type { Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/system';

export const flexPercent = (percent: number): SxProps<Theme> => ({
  flex: `1 1 ${percent}%`
});
