import type { Trade } from '@trade-tracker/shared/types';

export interface TradeHistoryColumn {
  field: Extract<keyof Trade, string | number>;
  displayName: string;
  width?: number;
  renderCell?: (value: string | number | null | undefined) => string;
}
