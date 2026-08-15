import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { addTrade } from '@/api/trade';

import useNewTrade from './useNewTrade';

import type { NewTrade } from '@trade-tracker/shared/types';
import type { JSX, ReactNode } from 'react';

vi.mock('@/api/trade', () => ({
  addTrade: vi.fn(),
}));

const CreateTestQueryClientProvider = (queryClient: QueryClient) => {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNewTrade', () => {
  let queryClient: QueryClient;

  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = CreateTestQueryClientProvider(queryClient);
  });

  it('handles error when addTrade fails', async () => {
    // Arrange
    const testError = new Error('Test Error');

    vi.mocked(addTrade).mockRejectedValueOnce(testError);

    const { result } = renderHook(() => useNewTrade(), { wrapper });

    // Act
    act(() => {
      result.current.mutate({} as NewTrade);
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(testError);
  });

  it('calls addTrade and invalidates the trades query on success', async () => {
    // Arrange
    const requestPayload: NewTrade = {
      date: '2026-08-15',
      float: 123,
      sector: 'Test Sector',
      symbol: 'TEST',
      volume: 456,
      executions: [],
    };

    vi.mocked(addTrade).mockResolvedValueOnce();

    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useNewTrade(), { wrapper });

    // Act
    act(() => {
      result.current.mutate(requestPayload);
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(addTrade).toHaveBeenCalledWith(requestPayload);

    expect(addTrade).toHaveBeenCalledTimes(1);

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['trades'] });
  });
});
