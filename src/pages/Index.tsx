
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/ChatInterface';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Add a small delay to allow for smooth animation on first load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with logo */}
      <header className="w-full py-4 px-6 shadow-sm border-b flex justify-between items-center bg-white">
        <Logo size="lg" />
        {isAuthenticated && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
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
              overflow-hidden border border-gray-100
              opacity-0 translate-y-4 transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : ''}
            `}
          >
            <ChatInterface />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
