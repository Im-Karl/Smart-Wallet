import React from 'react';
import { useForm } from 'react-hook-form';
import { useRegister } from '../hooks/useAuthMutations'; 
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Register = () => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm();
  
  const registerMutation = useRegister();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/" replace />; 

  const onSubmit = (data) => {
    const { email, password } = data; 
    registerMutation.mutate({ email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Đăng Ký Tài Khoản</h2>
        
        <div className="mb-4">
          <input
            type="email"
            placeholder="Địa chỉ Email"
            {...register('email', { 
              required: 'Email không được để trống',
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Định dạng email không hợp lệ"
              }
            })}
            className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div className="mb-4">
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register('password', { 
              required: 'Mật khẩu không được để trống',
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
              }
            })}
            className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Xác nhận Mật khẩu"
            {...register('passwordConfirm', {
              required: 'Vui lòng xác nhận mật khẩu',
              validate: (value) => value === watch('password') || "Mật khẩu xác nhận không khớp"
            })}
            className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm.message}</p>}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
        >
          {registerMutation.isPending ? 'Đang Đăng Ký...' : 'Đăng Ký'}
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Đăng nhập</Link>
        </p>

        {registerMutation.isError && (
            <p className="text-red-500 text-center mt-3 text-sm">
                Lỗi: {registerMutation.error.response?.data?.message || registerMutation.error.message}
            </p>
        )}
      </form>
    </div>
  );
};

export default Register;