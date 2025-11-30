import React from "react";
import { useBudgets } from "../hooks/useBudget";
import BudgetCard from "../components/BudgetCard";
import CreateBudgetForm from "../components/CreateBudgetForm";

const Dashboard = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useBudgets();

  if (isLoading) return <div className="p-10 text-center">Đang tải danh sách ngân sách...</div>;
  if (isError) return <div className="p-10 text-center text-red-600">Lỗi: {error.message}</div>;

  const budgets = data?.pages.flatMap(page => page.budgets) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left side: Budget list */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Tổng Quan Ngân Sách</h1>
        <div className="space-y-6">
          {budgets.length > 0 ? (
            budgets.map(budget => <BudgetCard key={budget._id} budget={budget} />)
          ) : (
            <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              Bạn chưa có ngân sách nào. Hãy tạo một ngân sách mới!
            </div>
          )}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full bg-indigo-600 text-white py-2 rounded mt-4"
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
            </button>
          )}
        </div>
      </div>

      {/* Right side: Create budget */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">➕ Tạo Ngân Sách Mới</h2>
          <CreateBudgetForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
