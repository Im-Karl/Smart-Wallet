import React from 'react';
import { Link } from 'react-router-dom';
import { differenceInDays, isAfter } from 'date-fns';
import { Clock, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const BudgetCard = ({ budget }) => {
  const {
    _id,
    name,
    start_date,
    end_date,
    total_amount,
    daily_quota,
    total_spent,
    net_remaining_current,
    days_passed, // Số ngày đã qua (từ aggregate)
  } = budget;

  // Xử lý ngày tháng
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const isFinished = isAfter(new Date(), endDate);
  
  // Tính toán tiến độ
  const progressPercent = (days_passed / totalDays) * 100;
  const netRemainingPercent = (net_remaining_current / total_amount) * 100;
  
  // Định dạng màu sắc dựa trên trạng thái còn lại
  const remainingColor = net_remaining_current >= 0 
    ? (netRemainingPercent >= 100 ? 'text-green-600' : 'text-green-500') 
    : 'text-red-500';

  const progressBgColor = isFinished ? 'bg-gray-400' : 'bg-indigo-500';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
        <Link 
          to={`/budgets/${_id}`}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition duration-150"
        >
          Chi Tiết &rarr;
        </Link>
      </div>

      {/* Trạng thái Tổng quan */}
      <div className="grid grid-cols-2 gap-4 mb-4 border-b pb-4">
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 text-indigo-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Tổng Ngân Sách</p>
            <p className="font-semibold text-lg text-indigo-700">{formatCurrency(total_amount)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
          <div>
            <p className="text-sm text-gray-500">Còn Lại (Hiện tại)</p>
            <p className={`font-bold text-xl ${remainingColor}`}>
              {formatCurrency(net_remaining_current)}
            </p>
          </div>
        </div>
      </div>

      {/* Tiến độ thời gian */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span className="font-bold">{days_passed} / {totalDays}</span>
          <span className="font-medium text-indigo-600">{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${progressBgColor}`} 
            style={{ width: `${Math.min(progressPercent, 100)}%` }} // Giới hạn 100%
          ></div>
        </div>
      </div>
      
      {/* Chi tiết thêm */}
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          <span>Chi tiêu thực tế: <span className="font-bold">{formatCurrency(total_spent)}</span></span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-gray-500 mr-1" />
          <span>Hạn mức ngày: <span className="font-bold">{formatCurrency(daily_quota)}</span></span>
        </div>
      </div>
      
      {/* Trạng thái kết thúc */}
      {isFinished && (
        <p className="mt-3 text-sm font-semibold text-center text-gray-500 bg-gray-100 p-2 rounded">
          Đã kết thúc
        </p>
      )}
    </div>
  );
};

export default BudgetCard;