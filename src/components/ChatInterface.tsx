
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, Bot, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatMessage, { MessageType } from './ChatMessage';
import ProductSelector, { ProductCategory } from './ProductSelector';
import { 
  getInitialMessage, 
  generateId, 
  getProductGreeting, 
  getResponseForQuery 
} from '@/utils/chatbotUtils';

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([getInitialMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductCategory | undefined>();
  const [showProductSelector, setShowProductSelector] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Scroll to bottom on new messages
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: generateId(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot "typing" delay
    setTimeout(() => {
      const botResponse = getResponseForQuery(inputValue, selectedProduct);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  const handleProductSelect = (product: ProductCategory) => {
    setSelectedProduct(product);
    setShowProductSelector(false);
    
    // Add bot response for the selected product
    const productGreeting = getProductGreeting(product);
    setMessages(prev => [...prev, productGreeting]);
    
    // Focus input after product selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleProductSelector = () => {
    setShowProductSelector(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-full bg-background/50 shadow-lg rounded-2xl border overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Product Support</h2>
            <p className="text-xs text-muted-foreground">
              {selectedProduct ? `Currently helping with: ${selectedProduct}` : 'How can I help you today?'}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={toggleProductSelector}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat messages area */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2 pb-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              index={index}
              isLastMessage={index === messages.length - 1}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-start gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-primary/40 rounded-full animate-pulse" />
                  <div className="h-2 w-2 bg-primary/40 rounded-full animate-pulse animate-delay-100" />
                  <div className="h-2 w-2 bg-primary/40 rounded-full animate-pulse animate-delay-200" />
                </div>
              </div>
            </div>
          )}
          
          {showProductSelector && (
            <div className="px-4 mt-4">
              <ProductSelector onSelectProduct={handleProductSelect} />
            </div>
          )}
          
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className={cn(
        "p-4 border-t transition-all duration-300 backdrop-blur-sm",
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
            ref={inputRef}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 py-6 bg-background/60 border-muted"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isTyping || !inputValue.trim()}
            className={cn(
              "h-10 w-10 rounded-full transition-transform duration-200",
              inputValue.trim() && "bg-primary hover:bg-primary/90",
              !inputValue.trim() && "bg-muted text-muted-foreground"
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
