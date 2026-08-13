import { Box } from '@mui/material';

import TopBar from '@/components/common/TopBar';
import TradeHistory from '@/components/TradeHistory';
import * as styles from '@/styles/common';

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
