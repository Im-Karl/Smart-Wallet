import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient, fetchHistoryRecords } from "../api/apiClient";

export const useHistoryRecords = (budgetId) => {
  return useInfiniteQuery({
    queryKey: ["historyRecords", budgetId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetchHistoryRecords({
        budgetId,
        skip: pageParam,
        limit: 20,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined; 
      return allPages.length * 20; 
    },
    enabled: !!budgetId,
  });
};
