import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';
import ChatInterface from './ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  company: string;
  image_url: string;
  rating: number;
  price_usd: number;
  short_description: string;
  stock: number;
  category_id: string;
}

const CustomerDashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    if (!isChatOpen) {
      setTimeout(() => {
        const inputElement = document.querySelector('#chat-input');
        if (inputElement instanceof HTMLInputElement) {
          inputElement.focus();
        }
      }, 300);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo size="md" />
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Shop
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Contact
            </a>
          </nav>
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
        {/* Hero Section */}
        <div className="w-full h-[40vh] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1920"
            alt="Technology Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center">
            <div className="container mx-auto px-4 text-white">
              <h1 className="text-5xl font-bold mb-4">
                Discover Cutting-Edge Tech
              </h1>
              <p className="text-xl">
                Shop our curated selection of the best laptops, smartphones, and tablets
              </p>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <CardContent className="p-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-800">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(product.price_usd)}
                  </p>
                  {product.stock === 0 ? (
                    <span className="text-red-500 text-sm">Out of Stock</span>
                  ) : (
                    <span className="text-green-600 text-sm">In Stock</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
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
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      </footer>

      {/* Chat Overlay */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={toggleChat}
        >
          <div
            ref={chatContainerRef}
            className="w-full max-w-lg h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Bot className="text-purple-600 h-5 w-5" />
                <h3 className="font-semibold">MakerBot Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8"
              >
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
