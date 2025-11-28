import { useQuery } from '@tanstack/react-query';
import { createBudgetApi, fetchBudgets } from '../api/apiClient'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets,
    select: (response) => response.data,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBudgetApi(data),
    onSuccess: () => {
      // ⚠️ Rất quan trọng: Báo cho React Query biết data ['budgets'] đã cũ
      queryClient.invalidateQueries({ queryKey: ['budgets'] }); 
    },
  });
};