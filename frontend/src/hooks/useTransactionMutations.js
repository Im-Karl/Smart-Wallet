import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";
import { format, startOfDay } from "date-fns";

const addTransactionApi = ({ budgetId, amount, description, category }) => {
  return apiClient.post(`/budgets/${budgetId}/transactions`, {
    amount: parseFloat(amount),
    description,
    category,
  });
};

export const useAddTransaction = (budgetId) => {
  const queryClient = useQueryClient();
  const today = startOfDay(new Date());

  return useMutation({
    mutationFn: addTransactionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyRecordList", budgetId],
      });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
