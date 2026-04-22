import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate('/login');
  }, [session, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold font-sans">A carregar...</p>
      </div>
    </div>
  );

  return session ? <>{children}</> : null;
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <AuthGuard><DashboardPage /></AuthGuard> },
  { path: '/profile', element: <AuthGuard><ProfilePage /></AuthGuard> },
]);

export function App() {
  return <RouterProvider router={router} />;
}
