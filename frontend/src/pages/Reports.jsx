// src/pages/Reports.jsx (Cập nhật để dùng data thật)

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useCategoryStats, useMonthlyFlow } from '../hooks/useStats'; // Import hooks mới
import { Loader2, ChartSpline } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A1054C', '#8884d8', '#D35400'];

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const Reports = () => {
    const { data: categoryStats, isLoading: isLoadingCats, isError: isErrorCats } = useCategoryStats();
    const { data: monthlyFlow, isLoading: isLoadingFlow, isError: isErrorFlow } = useMonthlyFlow();

    if (isLoadingCats || isLoadingFlow) {
        return <div className="text-center p-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /> Đang tải dữ liệu báo cáo...</div>;
    }

    // Định dạng dữ liệu cho Pie Chart
    const pieData = categoryStats?.map(item => ({
        name: item._id || 'Không phân loại',
        value: item.totalSpent
    })) || [];
    
    // Định dạng dữ liệu cho Bar Chart
    const barData = monthlyFlow || [];

    return (
        <div className="container mx-auto p-4">
            <ChartSpline /><h1 className="text-3xl font-bold mb-8 text-indigo-700"> Báo Cáo & Phân Tích Tổng Hợp</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Phân tích chi tiêu theo Danh mục (Biểu đồ tròn) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Chi Tiêu Theo Danh Mục</h2>
                    {isErrorCats && <p className='text-red-500'>Lỗi khi tải dữ liệu danh mục.</p>}
                    
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    labelLine={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 h-64 flex items-center justify-center">Chưa có đủ dữ liệu chi tiêu để phân tích.</p>
                    )}
                </div>
                
                {/* 2. Báo cáo Dòng tiền hàng tháng (Biểu đồ cột) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Dòng Tiền Thu Chi Theo Tháng</h2>
                    {isErrorFlow && <p className='text-red-500'>Lỗi khi tải dữ liệu dòng tiền.</p>}

                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="dateLabel" />
                                <YAxis tickFormatter={formatCurrency} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="spent" name="Chi Tiêu" fill="#EF4444" />
                                <Bar dataKey="added" name="Thu Nhập/Thêm" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 h-64 flex items-center justify-center">Chưa có dữ liệu giao dịch để tạo báo cáo dòng tiền.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Reports;