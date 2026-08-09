import type { SxProps, Theme } from '@mui/material';

export const heroCard: SxProps<Theme> = {
  p: { xs: 4, sm: 8 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  border: 'none'
};

export const heroTitle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const heroDescription: SxProps<Theme> = {
  maxWidth: 500,
  mb: 4,
};
