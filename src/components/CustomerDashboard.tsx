
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, X, Laptop, Smartphone, Tablet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';
import ChatInterface from './ChatInterface';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CATEGORIES = [
  { id: 'laptops', name: 'Laptops', icon: <Laptop className="h-10 w-10" />, color: 'bg-blue-100 text-blue-700' },
  { id: 'smartphones', name: 'Smartphones', icon: <Smartphone className="h-10 w-10" />, color: 'bg-purple-100 text-purple-700' },
  { id: 'tablets', name: 'Tablets', icon: <Tablet className="h-10 w-10" />, color: 'bg-green-100 text-green-700' }
];

const CustomerDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [alertCategory, setAlertCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    setAlertCategory(category);
    setTimeout(() => setAlertCategory(null), 3000);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    
    // Focus the chat input when opening
    if (!isChatOpen) {
      setTimeout(() => {
        const inputElement = document.querySelector('#chat-input') as HTMLInputElement;
        if (inputElement) inputElement.focus();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo size="md" />
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={toggleChat}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow-lg px-5 transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Bot className="mr-2 h-5 w-5" />
              MakerBot
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Image */}
        <div className="w-full h-[40vh] relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1920" 
            alt="Technology Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="container mx-auto px-4 py-10 text-white">
              <h1 className="text-4xl font-bold mb-2">Welcome to Makers Tech</h1>
              <p className="text-xl opacity-90">Discover the latest in technology</p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Browse Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Card 
                key={category.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col items-center p-8">
                    <div className={`w-20 h-20 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Browse our selection of {category.name.toLowerCase()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Category Alert */}
          {alertCategory && (
            <Alert className="mt-8 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800 flex items-center justify-center text-center p-2">
                Use the <span className="font-bold mx-1">MakerBot</span> to find {alertCategory} and get personalized recommendations!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Makers Tech. All rights reserved.
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4 md:mt-0"
            onClick={() => {
              localStorage.removeItem('makers_tech_user');
              navigate('/');
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>
      </footer>

      {/* Chat Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={toggleChat}>
          <div 
            ref={chatContainerRef}
            className="w-full max-w-lg h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="text-purple-600 h-5 w-5" />
                <h3 className="font-semibold">MakerBot Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChatInterface />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
