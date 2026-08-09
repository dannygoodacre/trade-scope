import type { SxProps, Theme } from '@mui/material/styles';

export const container: SxProps<Theme> = (theme: Theme) => ({
  margin: '0 auto',
  maxWidth: theme.spacing(160),
  padding: theme.spacing(2)
});
