import { Box } from '@mui/material';

import TopBar from '@/components/common/TopBar';
import TradeForm from '@/components/TradeForm';
import * as styles from '@/styles/common';

export default function NewTrade() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      <Box sx={styles.container}>
        <TradeForm />
      </Box>
    </Box>
  );
}
