import React from 'react';
import { useParams } from 'react-router-dom';
import { useDailyRecordsList } from '../hooks/useHistoryRecords';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/apiClient';
import AddTransactionForm from '../components/AddTransactionForm';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../utils/formatMoney';

const BudgetDetails = () => {
  const { id: budgetId } = useParams();

  const { data: budget } = useQuery({
  queryKey: ['budgetDetail', budgetId],
  queryFn: async () => {
    const res = await apiClient.get(`/budgets/${budgetId}`);
    return res.data;
  },
  enabled: !!budgetId,
});

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useDailyRecordsList(budgetId);

  const records = Array.isArray(data?.pages) ? data.pages.flat() : [];
console.log(budgetId);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">Chi Tiết Ngân Sách</h1>

      {budget && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800">{budget.name}</h2>
          <p className="text-gray-600 font-bold">
            Thời gian:{" "}
            <b>{format(parseISO(budget.start_date), 'yyyy-MM-dd')}</b> -{" "}
            <b>{format(parseISO(budget.end_date), 'yyyy-MM-dd')}</b>
          </p>
          <p className="text-gray-600 font-bold">
            Tổng ngân sách: <b>{formatCurrency(Math.round(budget.total_amount))}</b>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LIST Daily Records */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow h-[700px] overflow-y-scroll space-y-4">
          {records.map(rec => (
            <div key={rec._id} className="border-b pb-4">
              <h2 className="text-xl font-semibold">
                Ngày: {format(parseISO(rec.date), 'yyyy-MM-dd')}
              </h2>

              <p>Quota: <b>{formatCurrency(Math.round(rec.quota))} </b></p>

              <p>
                Chi tiêu thực tế: <b>{formatCurrency(Math.round(rec.spent - (rec.added_money || 0)))} </b>
              </p>

              <p
                className={`font-bold ${rec.remaining >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {rec.remaining >= 0 ? "Dư: " : "Vượt hạn mức: "} 
                <b>{formatCurrency(Math.abs(Math.round(rec.remaining)))} </b>
              </p>

              <h4 className="mt-3 font-medium">Giao dịch:</h4>
              <ul className="list-disc ml-5">
                {(rec.transactions || []).map((t, idx) => (
                  <li key={idx}>
                    <b>{formatCurrency(Math.round(t.amount))}</b> - {t.description || "-"}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="w-full bg-indigo-600 text-white py-2 rounded mt-4"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
            </button>
          )}
        </div>

        {/* Add transaction */}
        <div className="lg:col-span-1">
          <AddTransactionForm budgetId={budgetId} />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetails;
