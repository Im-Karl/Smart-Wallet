import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBudgetApi, fetchBudgetDetail, fetchBudgets } from "../api/apiClient";

export const useBudgets = () => {
  const limit = 5;

  return useInfiniteQuery({
    queryKey: ["budgets"],
    queryFn: async ({ pageParam = 0 }) => {
      const skip = pageParam * limit;
      const res = await fetchBudgets({ skip, limit });
      return res.data; 
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.flatMap(page => page.budgets).length;
      return loadedItems < lastPage.total ? allPages.length : undefined;
    },
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createBudgetApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });  
    },
  });
};

export const useBudgetDetail = (budgetId) => {
  return useQuery({
    queryKey: ["budgetDetail", budgetId],
    queryFn: async () => {
      const res = await fetchBudgetDetail(budgetId);
      return res.data;
    },
    enabled: !!budgetId,
  });
};