import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { addTrade } from '@/api/trade';

import useNewTrade from './useNewTrade';

import type { NewTrade } from '@trade-tracker/shared/types';
import type { JSX, PropsWithChildren } from 'react';
import type { MockInstance } from 'vitest';

vi.mock('@/api/trade', () => ({
  addTrade: vi.fn(),
}));

const CreateTestQueryClientProvider = (queryClient: QueryClient) => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useNewTrade', () => {
  let queryClient: QueryClient;

  let wrapper: ({ children }: PropsWithChildren) => JSX.Element;

  let invalidateQueriesSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = CreateTestQueryClientProvider(queryClient);

    invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  });

  it('handles error when addTrade fails', async () => {
    // Arrange
    const requestPayload: NewTrade = {
      date: '2026-08-15',
      float: 123,
      sector: 'Test Sector',
      symbol: 'TEST',
      volume: 456,
      executions: [],
    };

    const testError = new Error('Test Error');

    vi.mocked(addTrade).mockRejectedValueOnce(testError);

    // Act
    const { result } = renderHook(() => useNewTrade(), { wrapper });

    act(() => {
      result.current.mutate(requestPayload);
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect.soft(result.current.error).toEqual(testError);

    expect.soft(addTrade).toHaveBeenCalledWith(requestPayload);
    expect.soft(addTrade).toHaveBeenCalledTimes(1);

    expect.soft(invalidateQueriesSpy).toHaveBeenCalledTimes(0);
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

    // Act
    const { result } = renderHook(() => useNewTrade(), { wrapper });

    act(() => {
      result.current.mutate(requestPayload);
    });

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect.soft(addTrade).toHaveBeenCalledWith(requestPayload);
    expect.soft(addTrade).toHaveBeenCalledTimes(1);

    expect.soft(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['trades'] });
    expect.soft(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });
});
