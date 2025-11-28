import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateBudget } from '../hooks/useBudget';

const CreateBudgetForm = () => {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      total_amount: 1000000,
    }
  });

  const createBudgetMutation = useCreateBudget();

  // State riêng để hiển thị formatted value
  const [formattedAmount, setFormattedAmount] = useState(
    watch('total_amount').toLocaleString('vi-VN')
  );

  const onSubmit = (data) => {
    // Chuyển formatted string về number trước khi gửi
    const amount = parseFloat(data.total_amount.toString().replace(/\./g, ''));
    const dataToSend = { ...data, total_amount: amount };

    createBudgetMutation.mutate(dataToSend, {
      onSuccess: () => {
        reset();
        setFormattedAmount('0');
        console.log("Tạo ngân sách thành công!");
      },
      onError: (error) => {
        console.error("Lỗi tạo ngân sách:", error.response?.data?.message || error.message);
      }
    });
  };

  const handleAmountChange = (e) => {
    // Loại bỏ tất cả ký tự không phải số
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormattedAmount(Number(rawValue).toLocaleString('vi-VN'));
    setValue('total_amount', rawValue); // cập nhật vào react-hook-form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Tên Ngân Sách */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên Ngân Sách</label>
        <input 
          type="text" 
          placeholder="Ngân sách tháng 12" 
          {...register('name', { required: 'Tên không được để trống' })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" 
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Tổng Số Tiền */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tổng Số Tiền (VND)</label>
        <input
          type="text"
          value={formattedAmount}
          onChange={handleAmountChange}
          placeholder="1.000.000"
          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.total_amount && <p className="text-red-500 text-sm mt-1">{errors.total_amount.message}</p>}
      </div>

      {/* Ngày Bắt Đầu */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Ngày Bắt Đầu</label>
        <input 
          type="date"
          {...register('start_date', { required: 'Ngày bắt đầu không được để trống' })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" 
        />
        {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
      </div>

      {/* Ngày Kết Thúc */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Ngày Kết Thúc</label>
        <input 
          type="date"
          {...register('end_date', { required: 'Ngày kết thúc không được để trống' })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500" 
        />
        {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
      </div>

      <button 
        type="submit" 
        className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:bg-green-400"
        disabled={createBudgetMutation.isPending}
      >
        {createBudgetMutation.isPending ? 'Đang Tạo...' : 'Tạo Ngân Sách Mới'}
      </button>

      {createBudgetMutation.isError && (
        <p className="text-red-500 text-center text-sm mt-1">
          Lỗi: {createBudgetMutation.error.response?.data?.message || "Không thể tạo ngân sách."}
        </p>
      )}
    </form>
  );
};

export default CreateBudgetForm;
