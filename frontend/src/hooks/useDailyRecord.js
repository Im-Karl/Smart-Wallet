import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import { format } from 'date-fns'; 

const fetchDailyRecord = ({ queryKey }) => {
  const [, budgetId, date] = queryKey;
  const formattedDate = format(date, 'yyyy-MM-dd'); 
  return apiClient.get(`/budgets/${budgetId}/daily/${formattedDate}`);
};

export const useDailyRecord = (budgetId, date) => {
  return useQuery({
    queryKey: ['dailyRecord', budgetId, date], // Key động theo ID và Ngày
    queryFn: fetchDailyRecord,
    enabled: !!budgetId && !!date, 
    select: (response) => response.data,
  });
};