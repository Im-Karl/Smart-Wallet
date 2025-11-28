import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load cho các trang lớn
const LazyDashboard = lazy(() => import('./pages/Dashboard'));
const LazyBudgetDetails = lazy(() => import('./pages/BudgetDetails'));
const LazyReports = lazy(() => import('./pages/Reports'));
const NotFound = () => <h1 className="text-3xl text-red-600 text-center mt-20">404 - Không tìm thấy trang</h1>;

function App() {
  return (
    <Suspense fallback={<div className="text-center p-20 text-indigo-600 text-xl font-semibold">Đang tải ứng dụng...</div>}>
      <Routes>
        {/* Tuyến Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tuyến được bảo vệ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LazyDashboard />} />
          <Route path="/budgets/:id" element={<LazyBudgetDetails />} />
          <Route path="/reports" element={<LazyReports />} />
        </Route>

        {/* Tuyến 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
export default App;