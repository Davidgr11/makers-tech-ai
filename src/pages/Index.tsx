
import { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay to allow for smooth animation on first load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/50 p-4 sm:p-6 md:p-8">
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
    </div>
  );
};

export default Index;
