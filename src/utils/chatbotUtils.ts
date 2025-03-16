// chatbotUtils.ts

import { supabase } from '@/integrations/supabase/client';
import { MessageType } from '@/components/ChatMessage';

// === Types ===
export interface Product {
  id: string;
  name: string;
  type: string;         // e.g. 'Laptop', 'Smartphone', 'Tablet'
  price_usd: number;
  stock: number;
  description?: string; // e.g. short description
  specs?: Record<string, string>;
}

export type ProductCategory = 'Laptops' | 'Smartphones' | 'Tablets';

export interface UserPreference {
  budget: 'low' | 'medium' | 'high';
  primaryUse: 'productivity' | 'creative' | 'gaming' | 'browsing';
  size: 'compact' | 'standard' | 'large';
  performanceNeeds: 'basic' | 'moderate' | 'high';
}

// === Internal Data Caches ===
let cachedProducts: Product[] = [];

// === Utility to Load/Refresh Products from Supabase ===
async function loadProductsIfNeeded() {
  if (cachedProducts.length > 0) {
    // Already fetched; skip
    return;
  }
  const { data, error } = await supabase
    .from('products')
    .select('*'); // Adjust fields as needed

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    throw error;
  }
  cachedProducts = data || [];
}

// === ID Generation ===
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// === Initial Greeting Message ===
export const getInitialMessage = (): MessageType => {
  return {
    id: generateId(),
    sender: 'bot',
    text: "Welcome to Makers Tech support! I can help you find products, check availability, and get specifications. What are you looking for today?",
    timestamp: new Date(),
    animate: true
  };
};

// === Category-Specific Greeting ===
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

// === Helper: Format Product Info ===
const formatProductInfo = (product: Product): string => {
  const price = product.price_usd.toFixed(2);
  const inStockMsg = product.stock > 0 ? `${product.stock} in stock` : 'Out of stock';
  return `${product.name} (${product.type}) - $${price} - ${inStockMsg}\n${product.description ?? ''}`;
};

// === Helper: Format Product Details with Specs ===
const formatProductDetails = (product: Product): string => {
  const specsString = product.specs
    ? Object.entries(product.specs)
      .map(([key, value]) => `${capitalize(key)}: ${value}`)
      .join('\n')
    : 'No detailed specs available.';

  return `${product.name} (${product.type})
Price: $${product.price_usd.toFixed(2)}
Availability: ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
Description: ${product.description ?? 'N/A'}

Specifications:
${specsString}`;
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// === getAvailableProducts ===
async function getAvailableProductsList(): Promise<string> {
  await loadProductsIfNeeded();
  const available = cachedProducts.filter((p) => p.stock > 0);

  if (available.length === 0) {
    return "Sorry, we currently don't have any products in stock.";
  }

  const listStr = available
    .map((p, i) => `${i + 1}. ${p.name} (${p.type}) - $${p.price_usd.toFixed(2)} - ${p.stock} in stock`)
    .join('\n');
  return `Available products (${available.length}):\n${listStr}`;
}

// === findProductInQuery ===
async function findProductInQuery(query: string): Promise<Product | null> {
  await loadProductsIfNeeded();

  // Clean up query
  const cleanQuery = query
    .toLowerCase()
    .replace(/price of|specs of|tell me about|info on|details on|about the|the|is|are|have|has/gi, '')
    .trim();

  // Attempt direct match first
  for (const product of cachedProducts) {
    if (cleanQuery.includes(product.name.toLowerCase())) {
      return product;
    }
  }

  // Attempt partial matches
  for (const product of cachedProducts) {
    const productNameLower = product.name.toLowerCase();
    for (let i = 0; i < productNameLower.length - 3; i++) {
      const chunk = productNameLower.substring(i, i + 4);
      if (cleanQuery.includes(chunk)) {
        return product;
      }
    }
  }
  return null;
}

// === getProductsByTypeFromQuery ===
async function getProductsByTypeFromQuery(query: string): Promise<Product[] | null> {
  await loadProductsIfNeeded();

  const typesMap: Record<string, string> = {
    'laptop': 'Laptop',
    'computer': 'Laptop',
    'notebook': 'Laptop',
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
    return cachedProducts.filter((p) => p.type.toLowerCase() === foundType.toLowerCase());
  }
  return null;
}

// === Recommendation Logic ===
export let inRecommendationFlow = false;
let recommendationStep: 'budget' | 'primaryUse' | 'size' | 'performanceNeeds' | 'complete' = 'budget';
let currentUserPreference: UserPreference | null = null;

// Start recommendation flow
function startRecommendationFlow(): string {
  inRecommendationFlow = true;
  recommendationStep = 'budget';
  currentUserPreference = {
    budget: 'medium',
    primaryUse: 'productivity',
    size: 'standard',
    performanceNeeds: 'moderate',
  };

  return "I'd be happy to recommend products that match your needs! First, what's your budget range?\n\n1. Low (under $500)\n2. Medium ($500-$1000)\n3. High (over $1000)";
}

// Process recommendation step
async function processRecommendationStep(query: string): Promise<string> {
  if (!currentUserPreference) {
    return startRecommendationFlow();
  }
  const queryLower = query.toLowerCase();

  switch (recommendationStep) {
    case 'budget': {
      if (queryLower.includes('low') || queryLower.includes('under 500') || queryLower.includes('1')) {
        currentUserPreference.budget = 'low';
      } else if (queryLower.includes('high') || queryLower.includes('over 1000') || queryLower.includes('3')) {
        currentUserPreference.budget = 'high';
      } else {
        currentUserPreference.budget = 'medium';
      }
      recommendationStep = 'primaryUse';
      return "Great! What will you primarily use this device for?\n\n1. Productivity (work, email, documents)\n2. Creative work (photo/video editing, design)\n3. Gaming\n4. Basic browsing and media consumption";
    }

    case 'primaryUse': {
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
    }

    case 'size': {
      if (queryLower.includes('compact') || queryLower.includes('small') || queryLower.includes('portable') || queryLower.includes('1')) {
        currentUserPreference.size = 'compact';
      } else if (queryLower.includes('large') || queryLower.includes('big') || queryLower.includes('3')) {
        currentUserPreference.size = 'large';
      } else {
        currentUserPreference.size = 'standard';
      }
      recommendationStep = 'performanceNeeds';
      return "Last question: What level of performance do you need?\n\n1. Basic (web browsing, email, documents)\n2. Moderate (some multitasking, light editing)\n3. High (demanding applications, gaming, video editing)";
    }

    case 'performanceNeeds': {
      if (queryLower.includes('basic') || queryLower.includes('1')) {
        currentUserPreference.performanceNeeds = 'basic';
      } else if (queryLower.includes('high') || queryLower.includes('demanding') || queryLower.includes('3')) {
        currentUserPreference.performanceNeeds = 'high';
      } else {
        currentUserPreference.performanceNeeds = 'moderate';
      }

      recommendationStep = 'complete';
      const response = await generateRecommendationsResponse(currentUserPreference);
      inRecommendationFlow = false;
      return response;
    }

    default: {
      inRecommendationFlow = false;
      return "I'm not sure what you're asking. Would you like to see available products or get recommendations?";
    }
  }
}

// Example recommendation approach (very simplistic)
async function generateRecommendationsResponse(preferences: UserPreference): Promise<string> {
  await loadProductsIfNeeded();

  // Filter cachedProducts based on preferences (budget, primaryUse, etc.)
  // For demonstration, we'll do a simple filter by price
  const minPrice = preferences.budget === 'low' ? 0 : preferences.budget === 'medium' ? 500 : 1000;
  const maxPrice = preferences.budget === 'low' ? 500 : preferences.budget === 'medium' ? 1000 : 99999;

  const matched = cachedProducts.filter((p) => {
    return p.price_usd >= minPrice && p.price_usd < maxPrice;
  });

  if (matched.length === 0) {
    return "Based on your preferences, I don't have any products that match exactly. Would you like to try again with different preferences?";
  }

  // Sort by a “rating” or “popularity” if your table has such a column
  // For now, we'll just return them as is
  let response = "Based on your preferences, here are my recommendations:\n\n";
  matched.forEach((m, i) => {
    response += `${i + 1}. ${m.name} - $${m.price_usd.toFixed(2)}\n`;
  });
  response += "\nWould you like more details about any of these products?";
  return response;
}

// === getResponseForQuery ===
export const getResponseForQuery = async (
  query: string,
  productCategory?: ProductCategory
): Promise<MessageType> => {
  const normalizedQuery = query.toLowerCase();

  // === Recommendation Flow ===
  if (inRecommendationFlow) {
    const stepReply = await processRecommendationStep(query);
    return createBotMessage(stepReply);
  }

  // === Quick “Available Products” Shortcut ===
  if (
    normalizedQuery.includes('see available') ||
    normalizedQuery.includes('show available') ||
    normalizedQuery.includes('what do you have') ||
    normalizedQuery.includes('what is available')
  ) {
    const availableList = await getAvailableProductsList();
    return createBotMessage(availableList);
  }

  // === Start Recommendation Flow ===
  if (
    normalizedQuery.includes('recommend') ||
    normalizedQuery.includes('suggestion') ||
    normalizedQuery.includes('best for me') ||
    normalizedQuery.includes('what should i')
  ) {
    return createBotMessage(startRecommendationFlow());
  }

  // === Price Inquiries ===
  if (
    normalizedQuery.includes('price') ||
    normalizedQuery.includes('cost') ||
    normalizedQuery.includes('how much')
  ) {
    const foundProduct = await findProductInQuery(query);
    if (foundProduct) {
      const msg = `The ${foundProduct.name} costs $${foundProduct.price_usd.toFixed(2)}. ${
        foundProduct.stock > 0
          ? `We currently have ${foundProduct.stock} in stock.`
          : "Unfortunately, it's currently out of stock."
      }`;
      return createBotMessage(msg);
    }
  }

  // === Stock / Availability Inquiries ===
  if (
    normalizedQuery.includes('stock') ||
    normalizedQuery.includes('available') ||
    normalizedQuery.includes('in store') ||
    normalizedQuery.includes('can i buy') ||
    normalizedQuery.includes('do you have')
  ) {
    const foundProduct = await findProductInQuery(query);
    if (foundProduct) {
      const msg = foundProduct.stock > 0
        ? `Yes, the ${foundProduct.name} is in stock! We have ${foundProduct.stock} units available for $${foundProduct.price_usd.toFixed(2)} each.`
        : `I'm sorry, the ${foundProduct.name} is currently out of stock. Would you like me to suggest similar alternatives?`;
      return createBotMessage(msg);
    }

    const typeProducts = await getProductsByTypeFromQuery(query);
    if (typeProducts && typeProducts.length > 0) {
      const availableOfType = typeProducts.filter((p) => p.stock > 0);
      if (availableOfType.length > 0) {
        const listStr = availableOfType
          .map((p, i) => `${i + 1}. ${p.name} - $${p.price_usd.toFixed(2)} - ${p.stock} in stock`)
          .join('\n');
        return createBotMessage(
          `We have ${availableOfType.length} ${availableOfType[0].type.toLowerCase()}${
            availableOfType.length > 1 ? 's' : ''
          } available:\n\n${listStr}`
        );
      } else {
        return createBotMessage(
          `I'm sorry, we don't have any ${typeProducts[0].type.toLowerCase()}s in stock at the moment. Would you like to see other product categories?`
        );
      }
    }
  }

  // === Spec / Details Inquiries ===
  if (
    normalizedQuery.includes('spec') ||
    normalizedQuery.includes('detail') ||
    normalizedQuery.includes('feature') ||
    normalizedQuery.includes('tell me about') ||
    normalizedQuery.includes('more about')
  ) {
    const foundProduct = await findProductInQuery(query);
    if (foundProduct) {
      return createBotMessage(formatProductDetails(foundProduct));
    }
  }

  // === Comparison Requests ===
  if (
    normalizedQuery.includes('compare') ||
    normalizedQuery.includes('difference between') ||
    normalizedQuery.includes('versus') ||
    normalizedQuery.includes('vs')
  ) {
    // Future logic: handle product comparisons
    return createBotMessage("I can help you compare products. Could you specify which products you'd like to compare?");
  }

  // === No Category => Possibly a Greeting or Help Inquiry ===
  if (!productCategory) {
    if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi')) {
      return createBotMessage(
        "Hello! I'm the Makers Tech assistant. I can help you find products, check availability, and get specifications. What are you looking for today?"
      );
    }

    if (normalizedQuery.includes('help')) {
      return createBotMessage(
        "I can help you with:\n- Checking product availability (try 'What laptops do you have?')\n- Getting product details (try 'Tell me about the ProBook X5')\n- Comparing products\n- Price information (try 'How much is the UltraSlim 7?')\n- Product recommendations based on your needs (try 'What would you recommend?')\n\nWhat would you like to know?"
      );
    }

    return createBotMessage(
      "I'd be happy to help with that. You can ask me about our products, check availability, get price information, or request recommendations. What specific information are you looking for?"
    );
  }

  // === Product-Specific Category Handling ===
  // Example: user typed "Laptops" or "Smartphones" or "Tablets" and a question
  switch (productCategory) {
    case 'Laptops':
      if (normalizedQuery.includes('gaming')) {
        return createBotMessage(
          "For gaming, our high-performance laptops come with powerful CPUs and GPUs. Would you like a recommendation based on your budget?"
        );
      }
      if (normalizedQuery.includes('work') || normalizedQuery.includes('business')) {
        return createBotMessage(
          "For business use, I'd recommend our lightweight models with long battery life. Would you like more details or a recommendation?"
        );
      }
      break;

    case 'Smartphones':
      if (normalizedQuery.includes('camera') || normalizedQuery.includes('photo')) {
        return createBotMessage(
          "If you're looking for the best camera performance, we have phones with top-rated camera systems. Would you like more details?"
        );
      }
      if (normalizedQuery.includes('battery') || normalizedQuery.includes('long lasting')) {
        return createBotMessage(
          "For battery life, we have smartphones with large battery capacities. Would you like to see what's in stock?"
        );
      }
      break;

    case 'Tablets':
      if (normalizedQuery.includes('reading') || normalizedQuery.includes('media')) {
        return createBotMessage(
          "For reading and media consumption, we have tablets with high-resolution displays and good battery life. Interested in a recommendation?"
        );
      }
      break;
  }

  // === Default Fallback if Category is Provided but No Specific Intent Matched ===
  return createBotMessage(
    `I understand you're interested in our ${productCategory.toLowerCase()}. What specific features or price range are you looking for?`
  );
};

// === Helper to Create a Bot Message ===
function createBotMessage(text: string): MessageType {
  return {
    id: generateId(),
    sender: 'bot',
    text,
    timestamp: new Date(),
    animate: true,
  };
}
