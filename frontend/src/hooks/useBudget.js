import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBudgetApi, fetchBudgets } from "../api/apiClient";

export const useBudgets = () => {
  const limit = 5;

  return useInfiniteQuery({
    queryKey: ["budgets"],
    queryFn: async ({ pageParam = 0 }) => {
      const skip = pageParam * limit;
      const res = await fetchBudgets({ skip, limit });
      return res.data; // { budgets: [...], total: number }
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
