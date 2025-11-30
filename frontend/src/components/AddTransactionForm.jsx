import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddTransaction } from '../hooks/useTransactionMutations'; 

const categories = ['Ăn uống', 'Di chuyển', 'Nhà cửa', 'Giải trí', 'Hóa đơn', 'Thu nhập', 'Khác'];

const AddTransactionForm = ({ budgetId }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
  const addTransactionMutation = useAddTransaction(budgetId);

  // State để hiển thị số tiền đã format
  const [formattedAmount, setFormattedAmount] = useState('');

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // bỏ ký tự không phải số
    setFormattedAmount(rawValue ? Number(rawValue).toLocaleString('vi-VN') : '');
    setValue('amount', rawValue); // cập nhật vào react-hook-form
  };

  const onSubmit = (data) => {
    const amount = parseFloat(data.amount) * (data.type === 'expense' ? -1 : 1);

    addTransactionMutation.mutate(
      { 
        budgetId, 
        amount,
        description: data.description,
        category: data.category
      },
      {
        onSuccess: () => {
          reset();
          setFormattedAmount('');
          // Hiển thị thông báo thành công nếu muốn
        }
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-indigo-600">Thêm Giao Dịch</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Loại Giao Dịch */}
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center">
            <input type="radio" value="expense" defaultChecked {...register('type')} className="form-radio text-red-500" />
            <span className="ml-2 font-medium text-red-600">Chi tiêu (-)</span>
          </label>
          <label className="flex items-center">
            <input type="radio" value="income" {...register('type')} className="form-radio text-green-500" />
            <span className="ml-2 font-medium text-green-600">Thu nhập (+)</span>
          </label>
        </div>

        {/* Số Tiền */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Số Tiền (VND)</label>
          <input 
            id="amount"
            type="text"
            value={formattedAmount}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        {/* Mô Tả */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô Tả</label>
          <input
            id="description"
            type="text"
            placeholder="Mua cà phê, Lương tháng 10..."
            {...register('description', { required: 'Mô tả không được để trống' })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Danh Mục */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Danh Mục</label>
          <select
            id="category"
            {...register('category')}
            className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Nút Gửi */}
        <button
          type="submit"
          disabled={addTransactionMutation.isPending || !budgetId}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
        >
          {addTransactionMutation.isPending ? 'Đang Ghi Nhận...' : 'Ghi Nhận Giao Dịch'}
        </button>

        {/* Thông báo lỗi */}
        {addTransactionMutation.isError && (
            <p className="text-red-500 text-center mt-3 text-sm font-bold">
                 {addTransactionMutation.error.response?.data?.message || 'Không thể thêm giao dịch.'}
            </p>
        )}
      </form>
    </div>
  );
};

export default AddTransactionForm;
