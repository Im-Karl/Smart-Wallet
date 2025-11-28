import {useForm } from 'react-hook-form';
import { useLogin } from '../hooks/useAuthMutations'; 
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit, formState: { errors}} = useForm();
    const loginMutation = useLogin();
    const {isAuthenticated} = useAuth();

    if(isAuthenticated) return <Navigate to="/" replace/>

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };


    return(
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-8 rounded-lg w-full max-w-sm'>
                <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Đăng Nhập</h2>
        {/* Field Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email không được để trống' })}
            className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        {/* Field Password */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register('password', { required: 'Mật khẩu không được để trống' })}
            className="w-full p-3 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
        >
          {loginMutation.isPending ? 'Đang Xử Lý...' : 'Đăng Nhập'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản? <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">Đăng ký ngay</a>
        </p>
            </form>
        </div>
    );
};

export default Login;