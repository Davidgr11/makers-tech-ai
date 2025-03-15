
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/ChatInterface';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // Add a small delay to allow for smooth animation on first load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/50 p-4 sm:p-6 md:p-8">
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
            w-full max-w-lg h-[70vh] md:h-[75vh] rounded-2xl shadow-2xl 
            overflow-hidden glass-panel border-white/20 
            opacity-0 translate-y-4 transition-all duration-700 ease-out
            ${isLoaded ? 'opacity-100 translate-y-0' : ''}
          `}
        >
          <ChatInterface />
        </div>
      )}
    </div>
  );
};

export default Index;
