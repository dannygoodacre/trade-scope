import Home from "@/pages/Home.tsx";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';

import NewTrade from '@/pages/NewTrade';
import Trades from '@/pages/Trades';

import { theme } from '@/styles';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/trades/new" element={<NewTrade />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
