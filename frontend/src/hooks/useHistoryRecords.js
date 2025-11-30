import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';

export const useDailyRecordsList = (budgetId) => {
  return useInfiniteQuery({
    queryKey: ['dailyRecordList', budgetId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await apiClient.get(`/budgets/${budgetId}/history?skip=${pageParam}&limit=20`);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined; 
      return allPages.length * 20; 
    },
    enabled: !!budgetId,
  });
};
