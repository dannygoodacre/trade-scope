import { Foo } from '@/controllers/analytics.types';
import * as analyticsRepo from '@/repositories/analytics.repository';

export async function getProfitLoss(
  from: string,
  to: string,
  interval: 'day' | 'week' | 'month',
  symbol?: string,
): Promise<Foo[]> {
  const trades = await analyticsRepo.getTrades(from, to, symbol);

  if (trades.length === 0) {
    return {
      totalNetProfit: 0,
      winRate: 0,
      interval,
      data: [],
    };
  }

  const perDateProfit = Array.from(
    trades.reduce((acc, trade) => {
      const key = getGroupKey(trade.date, interval);

      acc.set(key, (acc.get(key) ?? 0) + trade.netProfit);

      return acc;
    }, new Map<string, number>()),
    ([date, netProfit]) => ({ date, netProfit })
  );

  return {
    totalNetProfit: trades.map((trade) => trade.netProfit).reduce((sum, x) => sum + x),
    winRate: trades.filter((x) => x.netProfit > 0).length / trades.length,
    interval: 'day',
    data: perDateProfit,
  };
}

function getGroupKey(dateStr: string, interval: 'day' | 'week' | 'month'): string {
  if (interval === 'month') {
    return dateStr.slice(0, 7); // Yields 'YYYY-MM'
  }

  if (interval === 'week') {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    // Shift date back to Monday of the current week
    const dayOfWeek = date.getUTCDay(); // 0 = Sun, 1 = Mon, ...
    const distanceToMonday = (dayOfWeek + 6) % 7;
    date.setUTCDate(date.getUTCDate() - distanceToMonday);

    return date.toISOString().split('T')[0]; // Yields Monday's 'YYYY-MM-DD'
  }

  return dateStr; // 'day'
}
