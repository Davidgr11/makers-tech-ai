import { MessageType } from '@/components/ChatMessage';
import { ProductCategory } from '@/components/ProductSelector';
import { getAvailableProducts, getProductById, products, Product, UserPreference, getProductRecommendations } from '@/data/products';

// Generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Initial greeting message
export const getInitialMessage = (): MessageType => {
  return {
    id: generateId(),
    sender: 'bot',
    text: "Welcome to Makers Tech support! I can help you find products, check availability, and get specifications. What are you looking for today?",
    timestamp: new Date(),
    animate: true
  };
};

// Get product-specific greeting
export const getProductGreeting = (product: ProductCategory): MessageType => {
  const ProductGreetings: Record<ProductCategory, string> = {
    'Laptops': "What kind of laptop are you looking for? We have models for productivity, gaming, and creative work.",
    'Smartphones': "Looking for a new smartphone? Let me know your requirements and I can recommend options.",
    'Tablets': "Our tablets range from budget to premium. What will you primarily use it for?"
  };

  return {
    id: generateId(),
    sender: 'bot',
    text: ProductGreetings[product],
    timestamp: new Date(),
    productCategory: product,
    animate: true
  };
};

// Format product info for display
const formatProductInfo = (product: Product): string => {
  return `${product.name} (${product.type}) - $${product.price.toFixed(2)} - ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
${product.description}`;
};

// Format product details with specs
const formatProductDetails = (product: Product): string => {
  let specs = Object.entries(product.specs)
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
    .join('\n');
  
  return `${product.name} (${product.type})
Price: $${product.price.toFixed(2)}
Availability: ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
Description: ${product.description}

Specifications:
${specs}`;
};

// Get list of available products
const getAvailableProductsList = (): string => {
  const available = getAvailableProducts();
  if (available.length === 0) {
    return "Sorry, we currently don't have any products in stock.";
  }
  
  return `Available products (${available.length}):
${available.map((p, i) => `${i+1}. ${p.name} (${p.type}) - $${p.price.toFixed(2)} - ${p.stock} in stock`).join('\n')}`;
};

// Check if query contains a product name
const findProductInQuery = (query: string): Product | null => {
  // Remove common words and clean up query
  const cleanQuery = query.toLowerCase()
    .replace(/price of|specs of|tell me about|info on|details on|about the|the|is|are|have|has/gi, '')
    .trim();
  
  // Find best matching product
  for (const product of products) {
    if (cleanQuery.includes(product.name.toLowerCase())) {
      return product;
    }
    
    // Check for partial matches (at least 4 characters)
    const productNameLower = product.name.toLowerCase();
    for (let i = 0; i < productNameLower.length - 3; i++) {
      const chunk = productNameLower.substring(i, i + 4);
      if (cleanQuery.includes(chunk)) {
        return product;
      }
    }
  }
  
  return null;
};

// Get product by type from query
const getProductsByTypeFromQuery = (query: string): Product[] | null => {
  const typesMap: Record<string, string> = {
    'laptop': 'Laptop',
    'computer': 'Laptop',
    'notebooks': 'Laptop',
    'phone': 'Smartphone',
    'smartphone': 'Smartphone',
    'mobile': 'Smartphone',
    'cellphone': 'Smartphone',
    'tablet': 'Tablet',
    'ipad': 'Tablet',
    'slate': 'Tablet',
  };
  
  const queryLower = query.toLowerCase();
  let foundType: string | null = null;
  
  for (const [keyword, type] of Object.entries(typesMap)) {
    if (queryLower.includes(keyword)) {
      foundType = type;
      break;
    }
  }
  
  if (foundType) {
    return products.filter(p => p.type === foundType);
  }
  
  return null;
};

// User preferences for recommendation
let currentUserPreference: UserPreference | null = null;
let inRecommendationFlow = false;
let recommendationStep: 'budget' | 'primaryUse' | 'size' | 'performanceNeeds' | 'complete' = 'budget';

// Start recommendation process
const startRecommendationFlow = (): string => {
  inRecommendationFlow = true;
  recommendationStep = 'budget';
  currentUserPreference = {
    budget: 'medium',
    primaryUse: 'productivity',
    size: 'standard',
    performanceNeeds: 'moderate'
  };
  
  return "I'd be happy to recommend products that match your needs! First, what's your budget range?\n\n1. Low (under $500)\n2. Medium ($500-$1000)\n3. High (over $1000)";
};

// Process recommendation step
const processRecommendationStep = (query: string): string => {
  if (!currentUserPreference) {
    return startRecommendationFlow();
  }
  
  const queryLower = query.toLowerCase();
  
  switch (recommendationStep) {
    case 'budget':
      if (queryLower.includes('low') || queryLower.includes('under 500') || queryLower.includes('1')) {
        currentUserPreference.budget = 'low';
      } else if (queryLower.includes('high') || queryLower.includes('over 1000') || queryLower.includes('3')) {
        currentUserPreference.budget = 'high';
      } else {
        currentUserPreference.budget = 'medium';
      }
      
      recommendationStep = 'primaryUse';
      return "Great! What will you primarily use this device for?\n\n1. Productivity (work, email, documents)\n2. Creative work (photo/video editing, design)\n3. Gaming\n4. Basic browsing and media consumption";
      
    case 'primaryUse':
      if (queryLower.includes('creative') || queryLower.includes('editing') || queryLower.includes('design') || queryLower.includes('2')) {
        currentUserPreference.primaryUse = 'creative';
      } else if (queryLower.includes('gaming') || queryLower.includes('game') || queryLower.includes('3')) {
        currentUserPreference.primaryUse = 'gaming';
      } else if (queryLower.includes('browsing') || queryLower.includes('media') || queryLower.includes('basic') || queryLower.includes('4')) {
        currentUserPreference.primaryUse = 'browsing';
      } else {
        currentUserPreference.primaryUse = 'productivity';
      }
      
      recommendationStep = 'size';
      return "What size device do you prefer?\n\n1. Compact (smaller screens, more portable)\n2. Standard (medium-sized screens)\n3. Large (larger screens, less portable)";
      
    case 'size':
      if (queryLower.includes('compact') || queryLower.includes('small') || queryLower.includes('portable') || queryLower.includes('1')) {
        currentUserPreference.size = 'compact';
      } else if (queryLower.includes('large') || queryLower.includes('big') || queryLower.includes('3')) {
        currentUserPreference.size = 'large';
      } else {
        currentUserPreference.size = 'standard';
      }
      
      recommendationStep = 'performanceNeeds';
      return "Last question: What level of performance do you need?\n\n1. Basic (web browsing, email, documents)\n2. Moderate (some multitasking, light editing)\n3. High (demanding applications, gaming, video editing)";
      
    case 'performanceNeeds':
      if (queryLower.includes('basic') || queryLower.includes('1')) {
        currentUserPreference.performanceNeeds = 'basic';
      } else if (queryLower.includes('high') || queryLower.includes('demanding') || queryLower.includes('3')) {
        currentUserPreference.performanceNeeds = 'high';
      } else {
        currentUserPreference.performanceNeeds = 'moderate';
      }
      
      recommendationStep = 'complete';
      
      // Generate recommendations
      const recommendations = getProductRecommendations(currentUserPreference);
      
      if (recommendations.length === 0) {
        inRecommendationFlow = false;
        return "Based on your preferences, I don't have any products that match exactly. Would you like to try again with different preferences?";
      }
      
      // Group by recommendation level
      const highRecommended = recommendations.filter(r => r.level === 'high');
      const mediumRecommended = recommendations.filter(r => r.level === 'medium');
      const lowRecommended = recommendations.filter(r => r.level === 'low');
      
      let response = "Based on your preferences, here are my recommendations:\n\n";
      
      if (highRecommended.length > 0) {
        response += "HIGHLY RECOMMENDED:\n";
        highRecommended.forEach((r, i) => {
          response += `${i+1}. ${r.product.name} - $${r.product.price.toFixed(2)} - ${r.product.description}\n`;
        });
        response += "\n";
      }
      
      if (mediumRecommended.length > 0) {
        response += "ALSO RECOMMENDED:\n";
        mediumRecommended.forEach((r, i) => {
          response += `${i+1}. ${r.product.name} - $${r.product.price.toFixed(2)}\n`;
        });
        response += "\n";
      }
      
      if (lowRecommended.length > 0) {
        response += "OTHER OPTIONS:\n";
        lowRecommended.forEach((r, i) => {
          response += `${i+1}. ${r.product.name} - $${r.product.price.toFixed(2)}\n`;
        });
      }
      
      response += "\nWould you like more details about any of these products?";
      
      inRecommendationFlow = false;
      return response;
      
    default:
      inRecommendationFlow = false;
      return "I'm not sure what you're asking. Would you like to see available products or get recommendations?";
  }
};

// Get response based on user input and selected product
export const getResponseForQuery = (
  query: string, 
  product?: ProductCategory
): MessageType => {
  const normalizedQuery = query.toLowerCase();
  
  // Handle recommendation flow
  if (inRecommendationFlow) {
    return createBotMessage(processRecommendationStep(query));
  }
  
  // Check for shortcut commands
  if (normalizedQuery.includes('see available') || normalizedQuery.includes('show available') || 
      normalizedQuery.includes('what do you have') || normalizedQuery.includes('what is available')) {
    return createBotMessage(getAvailableProductsList());
  }
  
  if (normalizedQuery.includes('recommend') || normalizedQuery.includes('suggestion') || 
      normalizedQuery.includes('best for me') || normalizedQuery.includes('what should i')) {
    return createBotMessage(startRecommendationFlow());
  }
  
  // Check for price inquiries
  if (normalizedQuery.includes('price') || normalizedQuery.includes('cost') || normalizedQuery.includes('how much')) {
    const foundProduct = findProductInQuery(query);
    if (foundProduct) {
      return createBotMessage(`The ${foundProduct.name} costs $${foundProduct.price.toFixed(2)}. ${foundProduct.stock > 0 ? `We currently have ${foundProduct.stock} in stock.` : "Unfortunately, it's currently out of stock."}`);
    }
  }
  
  // Check for stock/availability inquiries
  if (normalizedQuery.includes('stock') || normalizedQuery.includes('available') || normalizedQuery.includes('in store') || 
      normalizedQuery.includes('can i buy') || normalizedQuery.includes('do you have')) {
    const foundProduct = findProductInQuery(query);
    if (foundProduct) {
      return createBotMessage(foundProduct.stock > 0 
        ? `Yes, the ${foundProduct.name} is in stock! We currently have ${foundProduct.stock} units available for $${foundProduct.price.toFixed(2)} each.` 
        : `I'm sorry, the ${foundProduct.name} is currently out of stock. Would you like me to suggest similar alternatives?`);
    }
    
    const typeProducts = getProductsByTypeFromQuery(query);
    if (typeProducts) {
      const availableOfType = typeProducts.filter(p => p.stock > 0);
      if (availableOfType.length > 0) {
        return createBotMessage(`We have ${availableOfType.length} ${typeProducts[0].type.toLowerCase()}${availableOfType.length > 1 ? 's' : ''} available:\n\n${availableOfType.map((p, i) => `${i+1}. ${p.name} - $${p.price.toFixed(2)} - ${p.stock} in stock`).join('\n')}`);
      } else {
        return createBotMessage(`I'm sorry, we don't have any ${typeProducts[0].type.toLowerCase()}s in stock at the moment. Would you like to see other product categories?`);
      }
    }
  }
  
  // Check for spec/details inquiries
  if (normalizedQuery.includes('spec') || normalizedQuery.includes('detail') || normalizedQuery.includes('feature') || 
      normalizedQuery.includes('tell me about') || normalizedQuery.includes('more about')) {
    const foundProduct = findProductInQuery(query);
    if (foundProduct) {
      return createBotMessage(formatProductDetails(foundProduct));
    }
  }
  
  // Check for comparison requests
  if (normalizedQuery.includes('compare') || normalizedQuery.includes('difference between') || normalizedQuery.includes('versus') || normalizedQuery.includes('vs')) {
    // Implementation for product comparison logic would go here
    return createBotMessage("I can help you compare products. Could you specify which products you'd like to compare?");
  }
  
  // Generic responses (when no specific intent is detected)
  if (!product) {
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi')) {
      return createBotMessage("Hello! I'm the Makers Tech assistant. I can help you find products, check availability, and get specifications. What are you looking for today?");
    }
    
    if (normalizedQuery.includes('help')) {
      return createBotMessage("I can help you with:\n- Checking product availability (try 'What laptops do you have?')\n- Getting product details (try 'Tell me about the ProBook X5')\n- Comparing products\n- Price information (try 'How much is the UltraSlim 7?')\n- Product recommendations based on your needs (try 'What would you recommend?')\n\nWhat would you like to know?");
    }
    
    return createBotMessage("I'd be happy to help with that. You can ask me about our products, check availability, get price information, or request recommendations. What specific information are you looking for?");
  }
  
  // Product-specific responses based on selected category
  switch (product) {
    case 'Laptops':
      if (normalizedQuery.includes('gaming')) {
        return createBotMessage("For gaming, our GameMaster Pro with an i9 processor and RTX graphics would be perfect. It's currently priced at $1,799.99. Would you like more details?");
      }
      if (normalizedQuery.includes('work') || normalizedQuery.includes('business')) {
        return createBotMessage("For business use, I'd recommend the BusinessBook Air or ProBook X5. They offer great battery life and performance for productivity tasks. Would you like more details about either of these?");
      }
      break;
      
    case 'Smartphones':
      if (normalizedQuery.includes('camera') || normalizedQuery.includes('photo')) {
        return createBotMessage("If you're looking for the best camera performance, the Pixel Ultra has our top-rated camera system with a 108MP main sensor. It's priced at $899.99. Would you like more details?");
      }
      if (normalizedQuery.includes('battery') || normalizedQuery.includes('long lasting')) {
        return createBotMessage("For battery life, the Galaxy Edge with its 5500mAh battery offers the longest runtime in our lineup. Unfortunately, it's currently out of stock. The Note Master with a 5200mAh battery is available and offers excellent battery life as well.");
      }
      break;
      
    // Add cases for other product categories...
  }
  
  // Default response if no specific intent matched
  return createBotMessage(`I understand you're interested in our ${product.toLowerCase()}. What specific features or price range are you looking for?`);
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
