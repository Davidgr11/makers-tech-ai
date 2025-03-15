import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  SendHorizontal, 
  Bot, 
  Plus, 
  Zap, 
  ListChecks, 
  DollarSign, 
  HelpCircle,
  Star,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatMessage, { MessageType } from './ChatMessage';
import { generateId } from '@/utils/chatbotUtils';
import { Label } from './ui/label';
import { supabase } from '@/integrations/supabase/client';

const QUICK_ACTIONS = [
  { icon: <ListChecks className="h-4 w-4" />, label: 'Available products', query: 'available products' },
  { icon: <Zap className="h-4 w-4" />, label: 'Get recommendations', query: 'recommendations' },
  { icon: <DollarSign className="h-4 w-4" />, label: 'Price ranges', query: 'what are your price ranges?' },
  { icon: <HelpCircle className="h-4 w-4" />, label: 'Help', query: 'what can you help me with?' },
];

interface Product {
  id: string;
  name: string;
  company: string;
  image_url: string;
  rating: number;
  price_usd: number;
  short_description: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: generateId(),
      sender: 'bot',
      text: 'Hi there! I\'m MakerBot, your Makers Tech assistant. How can I help you today?',
      timestamp: new Date(),
      animate: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
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
  
  const handleSendMessage = (text = inputValue.trim()) => {
    if (!text) return;
    
    const userMessage: MessageType = {
      id: generateId(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowQuickActions(false);
    setShowRecommendationForm(false);
    
    processUserMessage(text);
  };
  
  const processUserMessage = (text: string) => {
    const normalizedText = text.toLowerCase();
    
    if (normalizedText.includes('available') && normalizedText.includes('product')) {
      setTimeout(() => {
        sendProductList();
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    if (normalizedText.includes('recommend')) {
      setTimeout(() => {
        showRecommendationsForm();
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    if (normalizedText.includes('price') && (normalizedText.includes('range') || normalizedText.includes('cost'))) {
      setTimeout(() => {
        sendPriceRanges();
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    setTimeout(() => {
      const botResponse: MessageType = {
        id: generateId(),
        sender: 'bot',
        text: `I can help you with product information and recommendations. Try asking me about available products, getting recommendations, or price ranges.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };
  
  const sendProductList = () => {
    if (products.length === 0) {
      const noProductsMessage: MessageType = {
        id: generateId(),
        sender: 'bot',
        text: 'I\'m sorry, I couldn\'t find any products at the moment. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, noProductsMessage]);
      return;
    }
    
    const productListMessage: MessageType = {
      id: generateId(),
      sender: 'bot',
      text: 'Here are some products we currently offer:',
      timestamp: new Date(),
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        company: p.company,
        image: p.image_url,
        price: p.price_usd,
        rating: p.rating,
        description: p.short_description
      }))
    };
    
    setMessages(prev => [...prev, productListMessage]);
  };
  
  const showRecommendationsForm = () => {
    const formMessage: MessageType = {
      id: generateId(),
      sender: 'bot',
      text: 'I can help you find the perfect product for your needs. Please use the form below to tell me what you\'re looking for:',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, formMessage]);
    setShowRecommendationForm(true);
  };
  
  const handleRecommendationSubmit = () => {
    if (!selectedCategory) {
      const errorMessage: MessageType = {
        id: generateId(),
        sender: 'bot',
        text: 'Please select a category to get recommendations.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    setShowRecommendationForm(false);
    setIsTyping(true);
    
    setTimeout(() => {
      const categoryId = categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase())?.id;
      
      if (!categoryId) {
        const errorMessage: MessageType = {
          id: generateId(),
          sender: 'bot',
          text: 'I couldn\'t find any products in that category. Please try a different one.',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        return;
      }
      
      const filteredProducts = products.filter(p => 
        p.category_id === categoryId && 
        p.price_usd >= priceRange[0] && 
        p.price_usd <= priceRange[1]
      );
      
      if (filteredProducts.length === 0) {
        const noProductsMessage: MessageType = {
          id: generateId(),
          sender: 'bot',
          text: `I couldn't find any ${selectedCategory} in your price range. Would you like to adjust your criteria?`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, noProductsMessage]);
        setIsTyping(false);
        return;
      }
      
      const sortedProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
      
      const topRecommendations = sortedProducts.slice(0, 3);
      const goodRecommendations = sortedProducts.slice(3, 5);
      const otherOptions = sortedProducts.slice(5);
      
      const recommendationMessage: MessageType = {
        id: generateId(),
        sender: 'bot',
        text: `Based on your preferences, here are my recommendations for ${selectedCategory} between $${priceRange[0]} and $${priceRange[1]}:`,
        timestamp: new Date(),
        recommendations: {
          top: topRecommendations.map(p => ({
            id: p.id,
            name: p.name,
            company: p.company,
            image: p.image_url,
            price: p.price_usd,
            rating: p.rating,
            description: p.short_description
          })),
          good: goodRecommendations.map(p => ({
            id: p.id,
            name: p.name,
            company: p.company,
            image: p.image_url,
            price: p.price_usd,
            rating: p.rating,
            description: p.short_description
          })),
          other: otherOptions.map(p => ({
            id: p.id,
            name: p.name,
            company: p.company,
            image: p.image_url,
            price: p.price_usd,
            rating: p.rating,
            description: p.short_description
          }))
        }
      };
      
      setMessages(prev => [...prev, recommendationMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const sendPriceRanges = () => {
    const priceRangesByCategory: Record<string, { min: number, max: number, category: string }> = {};
    
    products.forEach(product => {
      const category = categories.find(c => c.id === product.category_id)?.name || 'Unknown';
      
      if (!priceRangesByCategory[category]) {
        priceRangesByCategory[category] = { 
          min: product.price_usd, 
          max: product.price_usd,
          category
        };
      } else {
        priceRangesByCategory[category].min = Math.min(priceRangesByCategory[category].min, product.price_usd);
        priceRangesByCategory[category].max = Math.max(priceRangesByCategory[category].max, product.price_usd);
      }
    });
    
    const formattedRanges = Object.values(priceRangesByCategory)
      .map(range => `${range.category}: $${range.min.toFixed(2)} - $${range.max.toFixed(2)}`)
      .join('\n');
    
    const priceRangeMessage: MessageType = {
      id: generateId(),
      sender: 'bot',
      text: `Here are our current price ranges by category:\n\n${formattedRanges}\n\nWould you like recommendations in a specific price range?`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, priceRangeMessage]);
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleQuickAction = (query: string) => {
    handleSendMessage(query);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const renderMessage = (message: MessageType) => {
    if (message.products) {
      return (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 gap-3">
            {message.products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border rounded-lg p-3 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-20 h-20 object-cover rounded" 
                />
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.company}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="font-semibold text-purple-600">
                      {formatPrice(product.price)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (message.recommendations) {
      return (
        <div className="space-y-6 mt-3">
          {message.recommendations.top.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-2">★★★ Highly Recommended</h4>
              <div className="grid grid-cols-1 gap-3">
                {message.recommendations.top.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white border border-green-200 rounded-lg p-3 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded" 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.company}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="font-semibold text-green-600">
                          {formatPrice(product.price)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 border-green-200 text-green-700 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.id);
                          }}
                        >
                          <Info className="h-3 w-3 mr-1" />
                          More Info
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {message.recommendations.good.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">★★ Good Options</h4>
              <div className="grid grid-cols-1 gap-3">
                {message.recommendations.good.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white border border-blue-100 rounded-lg p-3 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded" 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.company}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="font-semibold text-blue-600">
                          {formatPrice(product.price)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 border-blue-100 text-blue-700 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.id);
                          }}
                        >
                          <Info className="h-3 w-3 mr-1" />
                          More Info
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {message.recommendations.other.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">★ Other Options</h4>
              <div className="grid grid-cols-1 gap-3">
                {message.recommendations.other.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white border rounded-lg p-3 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-20 h-20 object-cover rounded" 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.company}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="font-semibold text-gray-600">
                          {formatPrice(product.price)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.id);
                          }}
                        >
                          <Info className="h-3 w-3 mr-1" />
                          More Info
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ScrollArea className="flex-1 p-4 h-[90%]" id="chat-scroll-area">
        <div className="space-y-6 pb-4">
          {messages.map((message, index) => (
            <div key={message.id}>
              <ChatMessage 
                message={message} 
                index={index}
                isLastMessage={index === messages.length - 1}
              />
              {renderMessage(message)}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3 px-4 py-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" />
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse animate-delay-100" />
                  <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse animate-delay-200" />
                </div>
              </div>
            </div>
          )}
          
          {showRecommendationForm && (
            <div className="px-4 mt-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium mb-4">Find your perfect product:</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="price-range">Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
                    <Slider 
                      id="price-range"
                      defaultValue={[0, 2500]} 
                      max={3000} 
                      step={50}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="py-4"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Product Category</Label>
                    <RadioGroup 
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      className="grid gap-2"
                    >
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={category.name} id={category.id} />
                          <Label htmlFor={category.id} className="cursor-pointer">{category.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleRecommendationSubmit}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Get Recommendations
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {showQuickActions && (
            <div className="px-4 mt-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h3 className="text-sm font-medium mb-2">I can help you with:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((action, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-auto py-2 text-xs border-purple-200 hover:bg-purple-50 text-purple-700"
                      onClick={() => handleQuickAction(action.query)}
                    >
                      {action.icon}
                      <span className="ml-1.5">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      <div className={cn(
        "p-4 border-t transition-all duration-300 bg-white",
        isTyping && "opacity-60"
      )}>
        <form 
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            id="chat-input"
            ref={inputRef}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 py-5 bg-white border-gray-200"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isTyping || !inputValue.trim()}
            className={cn(
              "h-10 w-10 rounded-full transition-transform duration-200",
              inputValue.trim() && "bg-purple-600 hover:bg-purple-700",
              !inputValue.trim() && "bg-gray-200 text-gray-400"
            )}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
