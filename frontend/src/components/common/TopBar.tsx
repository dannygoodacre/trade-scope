import AddIcon from '@mui/icons-material/Add';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableViewIcon from '@mui/icons-material/TableView';
import { AppBar, Box, Button, Toolbar, Typography, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function TopBar() {
  const location = useLocation();

  const theme = useTheme();

  return (
    <AppBar
      position='static'
      elevation={0}
      color='default'
      sx={{
        backgroundColor: theme.palette.background.paper,
        backgroundImage: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        <Box
          component='a'
          href='/'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            color: 'text.primary'
          }}
        >
          <ShowChartIcon color='primary' sx={{ fontSize: 28 }} />
          <Typography variant='h6' fontWeight='bold' letterSpacing={-0.5}>
            Trade Tracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            href='/trades'
            variant='text'
            color='inherit'
            startIcon={<TableViewIcon />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 1.5,
              px: 1.75,
              py: 0.75
            }}
          >
            Browse
          </Button>

          {location.pathname !== '/trades/new' && (
            <Button
              href='/trades/new'
              variant='contained'
              color='primary'
              disableElevation
              startIcon={<AddIcon />}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                px: 1.75,
                py: 0.75
              }}
            >
              New Trade
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
