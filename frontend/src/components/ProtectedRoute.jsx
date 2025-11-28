import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu lại vị trí hiện tại để có thể redirect lại sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar /> 
      <main className="container mx-auto p-4 pt-8 flex-grow">
        <Outlet /> 
      </main>
      <Footer /> 
    </div>
  );
};
export default ProtectedRoute;