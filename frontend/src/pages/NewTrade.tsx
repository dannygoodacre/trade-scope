import { Box } from '@mui/material';

import TopBar from '@/components/common/TopBar';
import NewTradeComponent from '@/components/NewTrade';
import * as styles from '@/styles/common';

export default function NewTrade() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      <Box sx={styles.container}>
        <NewTradeComponent />
      </Box>
    </Box>
  );
}
