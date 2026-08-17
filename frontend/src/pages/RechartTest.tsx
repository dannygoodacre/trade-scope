import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function RechartTest() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/analytics/profit-loss?from=2025-08-01&to=2027-08-16&interval=week')
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 400, p: 4 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey='netProfit'
            shape={(props: any) => {
              const value = props.payload.netProfit;

              if (value === 0) {
                const lineHeight = 3;

                return <Rectangle {...props} y={props.y - lineHeight / 2} height={lineHeight} fill='#1976d2' />;
              }

              const fill = value > 0 ? '#2e7d32' : '#d32f2f';

              return <Rectangle {...props} fill={fill} />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
