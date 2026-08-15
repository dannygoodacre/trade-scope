import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addTrade } from '@/api/trade';

import type { NewTrade } from '@trade-tracker/shared/types';

export default function useNewTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewTrade) => addTrade(payload),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });
}
