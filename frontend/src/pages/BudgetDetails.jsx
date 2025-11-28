import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { startOfDay } from 'date-fns';
import { useDailyRecord } from '../hooks/useDailyRecord';
import AddTransactionForm from '../components/AddTransactionForm';

const BudgetDetails = () => {
  const { id: budgetId } = useParams();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date())); 

  // Lấy data Daily Record cho ngày đã chọn
  const { data: record, isLoading, isError } = useDailyRecord(budgetId, selectedDate);
  
  // Dùng date picker để thay đổi selectedDate

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Chi Tiết Ngân Sách</h1>
      
      {/* Date Picker và Daily Record Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phần Summary/Visualizations */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          {isLoading && <p>Đang tải dữ liệu ngày...</p>}
          {isError && <p className="text-red-500">Không tìm thấy bản ghi cho ngày này.</p>}
          
          {record && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Ngày: {record.date.split('T')[0]}</h2>
              <p>Hạn mức ngày (Quota): <span className="font-bold">{record.quota.toLocaleString('vi-VN')}</span> VND</p>
              <p>Đã chi tiêu (Spent): <span className="font-bold">{record.spent.toLocaleString('vi-VN')}</span> VND</p>
              <p className={record.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                Dư/Vượt Hạn mức: <span className="font-bold">{record.remaining.toLocaleString('vi-VN')}</span> VND
              </p>
              {/* Hiển thị danh sách Giao dịch */}
              <h4 className="text-xl font-medium mt-4 border-t pt-4">Giao Dịch</h4>
              <ul className="list-disc pl-5">
                {record.transactions.map((t, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-bold">{t.amount.toLocaleString('vi-VN')}</span> - {t.description} ({t.category})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Form Thêm Giao Dịch */}
        <div className="lg:col-span-1">
          <AddTransactionForm budgetId={budgetId} /> 
        </div>
      </div>
    </div>
  );
};
export default BudgetDetails;