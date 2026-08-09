import { Box } from '@mui/material';

import { TopBar, TradeForm } from '@/components';
import * as styles from '@/styles';

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
