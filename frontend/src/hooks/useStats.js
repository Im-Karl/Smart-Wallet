import { useQuery } from "@tanstack/react-query";
import { fetchCategoryStats, fetchMonthlyFlow } from "../api/apiClient";

export const useCategoryStats = () => {
    return useQuery({
        queryKey: ['stats', 'categories'],
        queryFn: fetchCategoryStats,
        select: (response) => response.data,
    });
};

export const useMonthlyFlow = () => {
    return useQuery({
        queryKey: ['stats', 'monthlyFlow'],
        queryFn: fetchMonthlyFlow,
        select: (response) => response.data,
    });
};