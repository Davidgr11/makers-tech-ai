
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedTyping from './AnimatedTyping';
import { Bot, User } from 'lucide-react';

export type ProductRecommendation = {
  id: string;
  name: string;
  company: string;
  image: string;
  price: number;
  rating: number;
  description: string;
};

export type MessageType = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  productCategory?: string;
  animate?: boolean;
  products?: ProductRecommendation[];
  recommendations?: {
    top: ProductRecommendation[];
    good: ProductRecommendation[];
    other: ProductRecommendation[];
  };
};

interface ChatMessageProps {
  message: MessageType;
  index: number;
  isLastMessage: boolean;
}

const ChatMessage = ({ message, index, isLastMessage }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 * index); // Stagger animation based on index
    
    return () => clearTimeout(timer);
  }, [index]);
  
  useEffect(() => {
    if (isVisible && messageRef.current && isLastMessage) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isVisible, isLastMessage]);

  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const isBot = message.sender === 'bot';
  
  return (
    <div 
      ref={messageRef}
      className={cn(
        'flex items-start gap-3 px-4 py-2 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        isBot ? 'justify-start' : 'justify-end'
      )}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Bot className="h-4 w-4 text-green-600" />
        </div>
      )}
      
      <div
        className={cn(
          'relative rounded-2xl px-4 py-3 max-w-[85%] shadow-sm',
          isBot 
            ? 'bg-white border border-gray-100 text-gray-800' 
            : 'bg-purple-600 text-white'
        )}
      >
        {message.animate && isBot ? (
          <AnimatedTyping 
            text={message.text} 
            speed={20}
            delay={200}
            className="block text-sm"
          />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
        )}
        
        <div className={cn(
          "text-[10px] mt-1 opacity-70",
          isBot ? "text-right" : "text-left" 
        )}>
          {formattedTime}
        </div>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="h-4 w-4 text-purple-600" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
