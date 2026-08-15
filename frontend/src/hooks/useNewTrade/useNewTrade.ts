import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addTrade } from '@/api/trade';

export default function useNewTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTrade,

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trades'] }),
  });
}
