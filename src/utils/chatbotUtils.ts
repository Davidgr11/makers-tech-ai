
import { MessageType } from '@/components/ChatMessage';
import { ProductCategory } from '@/components/ProductSelector';

// Generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Initial greeting message
export const getInitialMessage = (): MessageType => {
  return {
    id: generateId(),
    sender: 'bot',
    text: "Hello! I'm your product support assistant. How can I help you today?",
    timestamp: new Date(),
    animate: true
  };
};

// Get product-specific greeting
export const getProductGreeting = (product: ProductCategory): MessageType => {
  const greetings: Record<ProductCategory, string> = {
    'Laptops': "I can help with your laptop questions. What specific issue are you experiencing?",
    'Smartphones': "I'm here to assist with your smartphone. What would you like to know?",
    'Audio': "I can help with your audio device. Is it about connectivity, sound quality, or something else?",
    'Wearables': "How can I assist with your wearable device today?",
    'Cameras': "I'd be happy to help with your camera. What seems to be the issue?",
    'TVs': "I can assist with your TV-related questions. What would you like to know?"
  };

  return {
    id: generateId(),
    sender: 'bot',
    text: greetings[product],
    timestamp: new Date(),
    productCategory: product,
    animate: true
  };
};

// Get response based on user input and selected product
export const getResponseForQuery = (
  query: string, 
  product?: ProductCategory
): MessageType => {
  const normalizedQuery = query.toLowerCase();
  
  // Generic responses (when no product is selected)
  if (!product) {
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi')) {
      return createBotMessage("Hello! How can I assist you today? You can select a product category to get more specific help.");
    }
    
    if (normalizedQuery.includes('help')) {
      return createBotMessage("I'm here to help with product support. Please select a product category to get started.");
    }
    
    return createBotMessage("I'd be happy to help with that. To provide more specific assistance, could you select which product you're inquiring about?");
  }
  
  // Product-specific responses
  const commonResponses: Record<string, string> = {
    'not working': `I'm sorry to hear your ${product.toLowerCase()} isn't working properly. Could you describe what happens when you try to use it?`,
    'broken': `I understand your ${product.toLowerCase()} might be damaged. Can you describe the physical condition and any visible damage?`,
    'how to': `I'd be happy to guide you through using your ${product.toLowerCase()}. What specific feature are you trying to use?`,
    'setup': `Setting up your new ${product.toLowerCase()} is easy! First, make sure all components are unpacked. Have you already tried connecting it?`,
    'warranty': `For warranty information on your ${product.toLowerCase()}, please provide your purchase date and product model. Our standard warranty is 1 year from purchase.`,
    'price': `Pricing information for our ${product.toLowerCase()} varies by model. Could you specify which model you're interested in?`,
  };
  
  // Check for common phrases first
  for (const [keyword, response] of Object.entries(commonResponses)) {
    if (normalizedQuery.includes(keyword)) {
      return createBotMessage(response);
    }
  }
  
  // Product-specific responses
  switch (product) {
    case 'Laptops':
      if (normalizedQuery.includes('battery')) {
        return createBotMessage("Battery issues can be common. Is your laptop not holding a charge, not charging at all, or shutting down unexpectedly?");
      }
      if (normalizedQuery.includes('slow')) {
        return createBotMessage("If your laptop is running slowly, it could be due to low storage space, too many background processes, or it might need a restart. Have you tried restarting it recently?");
      }
      break;
      
    case 'Smartphones':
      if (normalizedQuery.includes('battery')) {
        return createBotMessage("Smartphone battery issues are common. Are you experiencing rapid battery drain, or is the phone not charging properly?");
      }
      if (normalizedQuery.includes('screen')) {
        return createBotMessage("I understand you're having an issue with your smartphone screen. Is it cracked, not responding to touch, or displaying incorrectly?");
      }
      break;
      
    case 'Audio':
      if (normalizedQuery.includes('connect') || normalizedQuery.includes('pair')) {
        return createBotMessage("To connect your audio device via Bluetooth, make sure Bluetooth is enabled on both devices. Then put your audio device in pairing mode and select it from your source device's Bluetooth menu.");
      }
      if (normalizedQuery.includes('sound') || normalizedQuery.includes('quality')) {
        return createBotMessage("Sound quality issues can be frustrating. Are you experiencing static, low volume, or intermittent sound?");
      }
      break;
      
    // Add cases for other product categories...
  }
  
  // Default response if no specific keywords matched
  return createBotMessage(`I understand you're asking about your ${product.toLowerCase()}. Could you provide more details about your specific question or issue?`);
};

// Helper function to create a bot message
const createBotMessage = (text: string): MessageType => {
  return {
    id: generateId(),
    sender: 'bot',
    text,
    timestamp: new Date(),
    animate: true
  };
};
