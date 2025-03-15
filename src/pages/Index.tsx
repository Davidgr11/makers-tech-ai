
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import LoginForm from '@/components/LoginForm';
import CustomerDashboard from '@/components/CustomerDashboard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Add a small delay to allow for smooth animation on first load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        {!isAuthenticated ? (
          <div
            className={`
              w-full max-w-md opacity-0 translate-y-4 transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : ''}
            `}
          >
            <LoginForm />
          </div>
        ) : isAdmin ? (
          <div
            className={`
              w-full opacity-0 translate-y-4 transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : ''}
            `}
          >
            <AdminDashboard />
          </div>
        ) : (
          <div 
            className={`
              w-full h-screen
              opacity-0 translate-y-4 transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : ''}
            `}
          >
            <CustomerDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
