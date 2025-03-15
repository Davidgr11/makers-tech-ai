
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTypingProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

const AnimatedTyping = ({
  text,
  className,
  speed = 30,
  delay = 0,
  onComplete
}: AnimatedTypingProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (delay > 0) {
      timer = setTimeout(() => {
        startTyping();
      }, delay);
    } else {
      startTyping();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delay]);
  
  const startTyping = () => {
    setIsTyping(true);
    setDisplayText('');
    
    let index = 0;
    const typeNextChar = () => {
      if (index < text.length) {
        setDisplayText(current => current + text.charAt(index));
        index++;
        timeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };
    
    timeoutRef.current = setTimeout(typeNextChar, speed);
  };
  
  return (
    <span className={cn(className, isTyping ? 'after:inline-block after:h-4 after:w-[2px] after:bg-current after:ml-[1px] after:align-middle after:animate-blink' : '')}>
      {displayText}
    </span>
  );
};

export default AnimatedTyping;
