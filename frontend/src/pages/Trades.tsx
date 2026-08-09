import { Box } from '@mui/material';

import { TopBar, TradeHistory } from '@/components';
import * as styles from '@/styles';

export default function Trades() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      <Box component='main' sx={{ ...styles.container, flex: 1, p: 4 }}>
        <TradeHistory />
      </Box>
    </Box>
  );
}
