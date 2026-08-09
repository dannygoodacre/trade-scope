import AddIcon from '@mui/icons-material/Add';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableViewIcon from '@mui/icons-material/TableView';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import * as styles from './Home.styles';

export default function Home() {
  return (
    <Box>
      <Paper variant='outlined' sx={styles.heroCard}>
        <Typography variant='h3' component='h1' fontWeight='bold' sx={styles.heroTitle}>
          <ShowChartIcon color='primary' fontSize='inherit' />
          Trade Scope
        </Typography>

        <Typography variant='body1' color='text.secondary' sx={styles.heroDescription}>
          Log trade executions and view your complete trade history.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant='outlined' size='large' href='/trades' startIcon={<TableViewIcon />}>
            Browse Trades
          </Button>

          <Button variant='contained' size='large' href='/trades/new' startIcon={<AddIcon />} disableElevation>
            Add New Trade
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
