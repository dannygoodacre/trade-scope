import { Box } from '@mui/material';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import TopBar from '@/components/common/TopBar.tsx';
import * as styles from '@/styles/common.ts';

export default function RechartTest() {
  const data = [
    {
      name: 'Page A',
      uv: 400,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 300,
      pv: 4567,
      amt: 2400,
    },
    {
      name: 'Page C',
      uv: 320,
      pv: 1398,
      amt: 2400,
    },
    {
      name: 'Page D',
      uv: 200,
      pv: 9800,
      amt: 2400,
    },
    {
      name: 'Page E',
      uv: 278,
      pv: 3908,
      amt: 2400,
    },
    {
      name: 'Page F',
      uv: 189,
      pv: 4800,
      amt: 2400,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      <Box component='main' sx={{ ...styles.container, flex: 1, p: 4 }}>
        <LineChart style={{ width: '100%', aspectRatio: 1.618 }} responsive data={data}>
          <CartesianGrid />
          <Line dataKey='uv' />
          <XAxis dataKey='name' />
          <YAxis />
          <Legend />
        </LineChart>
      </Box>
    </Box>
  );
}
