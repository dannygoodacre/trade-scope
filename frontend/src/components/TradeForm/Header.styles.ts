import { type Theme } from '@mui/material/styles';

export const formHeader = {
  alignItems: 'flex-end',
  marginBottom: '10px',
  flexDirection: 'column',
};

export const formRow = (theme: Theme) => {
  return {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    width: '100%',
  };
};
