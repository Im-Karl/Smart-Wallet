import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo/Tên Ứng Dụng */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-150">
          💰 Budget Smart
        </Link>

        {/* Các Liên Kết Điều Hướng Chính */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center">
            <LayoutDashboard className="w-5 h-5 mr-1" />
            Dashboard
          </Link>
          <Link to="/reports" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center">
            <BarChart3 className="w-5 h-5 mr-1" />
            Báo Cáo
          </Link>
        </div>

        {/* Thông tin User và Đăng Xuất */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 hidden sm:block">
            Xin chào, <span className="font-bold">{user?.email}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150"
            title="Đăng Xuất"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Đăng Xuất
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;