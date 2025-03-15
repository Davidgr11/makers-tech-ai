
export type ProductType = 'Laptop' | 'Smartphone' | 'Tablet';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  stock: number;
  description: string;
  specs: {
    [key: string]: string | number | boolean;
  };
  image?: string;
}

// Mock database for demonstration purposes
export const products: Product[] = [
  {
    id: "laptop-1",
    name: "ProBook X5",
    type: "Laptop",
    price: 1299.99,
    stock: 23,
    description: "High-performance laptop for professionals with a sleek design",
    specs: {
      processor: "Intel Core i7-12700H",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      display: "15.6-inch 4K",
      battery: "10 hours",
      weight: "1.8kg",
    }
  },
  {
    id: "laptop-2",
    name: "UltraSlim 7",
    type: "Laptop",
    price: 899.99,
    stock: 15,
    description: "Ultra-thin and lightweight laptop for on-the-go productivity",
    specs: {
      processor: "AMD Ryzen 7 5800U",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      display: "14-inch Full HD",
      battery: "12 hours",
      weight: "1.3kg",
    }
  },
  {
    id: "laptop-3",
    name: "GameMaster Pro",
    type: "Laptop",
    price: 1799.99,
    stock: 7,
    description: "Ultimate gaming laptop with RGB lighting and powerful cooling",
    specs: {
      processor: "Intel Core i9-12900HK",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      display: "17.3-inch 165Hz",
      gpu: "NVIDIA RTX 4080 Mobile",
      battery: "6 hours",
      weight: "2.5kg",
    }
  },
  {
    id: "laptop-4",
    name: "BusinessBook Air",
    type: "Laptop",
    price: 1099.99,
    stock: 0,
    description: "Slim business laptop with enterprise-grade security features",
    specs: {
      processor: "Intel Core i5-1240P",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      display: "13.3-inch QHD",
      battery: "14 hours",
      weight: "1.2kg",
    }
  },
  {
    id: "laptop-5",
    name: "CreativePro Studio",
    type: "Laptop",
    price: 2199.99,
    stock: 3,
    description: "Designed for creative professionals with color-accurate display",
    specs: {
      processor: "AMD Ryzen 9 7950X",
      ram: "64GB DDR5",
      storage: "2TB SSD",
      display: "16-inch 4K OLED",
      gpu: "AMD Radeon Pro",
      battery: "8 hours",
      weight: "2.1kg",
    }
  },
  {
    id: "smartphone-1",
    name: "Pixel Ultra",
    type: "Smartphone",
    price: 899.99,
    stock: 42,
    description: "Premium smartphone with the best camera on the market",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      display: "6.7-inch AMOLED",
      battery: "5000mAh",
      camera: "108MP main + 48MP ultrawide",
    }
  },
  {
    id: "smartphone-2",
    name: "iConnect Pro",
    type: "Smartphone",
    price: 1099.99,
    stock: 18,
    description: "Flagship smartphone with the latest features and premium design",
    specs: {
      processor: "A16 Bionic",
      ram: "8GB",
      storage: "512GB",
      display: "6.5-inch Super Retina XDR",
      battery: "4500mAh",
      camera: "48MP triple camera system",
    }
  },
  {
    id: "smartphone-3",
    name: "Galaxy Edge",
    type: "Smartphone",
    price: 799.99,
    stock: 0,
    description: "Feature-packed smartphone with curved edge display",
    specs: {
      processor: "Exynos 2200",
      ram: "16GB",
      storage: "256GB",
      display: "6.8-inch Dynamic AMOLED",
      battery: "5500mAh",
      camera: "108MP quad camera",
    }
  },
  {
    id: "smartphone-4",
    name: "Essential Lite",
    type: "Smartphone",
    price: 399.99,
    stock: 56,
    description: "Affordable smartphone with all essential features",
    specs: {
      processor: "MediaTek Dimensity 900",
      ram: "6GB",
      storage: "128GB",
      display: "6.4-inch LCD",
      battery: "4800mAh",
      camera: "64MP main + 8MP wide",
    }
  },
  {
    id: "smartphone-5",
    name: "Note Master",
    type: "Smartphone",
    price: 849.99,
    stock: 11,
    description: "Large smartphone with stylus support for productivity",
    specs: {
      processor: "Snapdragon 8+ Gen 1",
      ram: "12GB",
      storage: "512GB",
      display: "6.9-inch LTPO AMOLED",
      battery: "5200mAh",
      camera: "50MP triple camera",
    }
  },
  {
    id: "tablet-1",
    name: "SlateTab Pro",
    type: "Tablet",
    price: 649.99,
    stock: 19,
    description: "Professional-grade tablet with stylus support",
    specs: {
      processor: "M2 chip",
      ram: "8GB",
      storage: "256GB",
      display: "11-inch Liquid Retina",
      battery: "10 hours",
      weight: "466g",
    }
  },
  {
    id: "tablet-2",
    name: "Galaxy Tab Ultra",
    type: "Tablet",
    price: 899.99,
    stock: 7,
    description: "Premium Android tablet with desktop-like productivity",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "16GB",
      storage: "512GB",
      display: "12.4-inch Super AMOLED",
      battery: "12 hours",
      weight: "575g",
    }
  },
  {
    id: "tablet-3",
    name: "Surface Go",
    type: "Tablet",
    price: 499.99,
    stock: 0,
    description: "Versatile 2-in-1 tablet that transforms into a laptop",
    specs: {
      processor: "Intel Core i3-1115G4",
      ram: "8GB",
      storage: "128GB",
      display: "10.5-inch PixelSense",
      battery: "11 hours",
      weight: "544g",
    }
  },
  {
    id: "tablet-4",
    name: "Kindle Fire HD",
    type: "Tablet",
    price: 199.99,
    stock: 31,
    description: "Affordable entertainment tablet for reading and streaming",
    specs: {
      processor: "MediaTek MT8183",
      ram: "4GB",
      storage: "64GB",
      display: "10.1-inch Full HD",
      battery: "12 hours",
      weight: "465g",
    }
  },
  {
    id: "tablet-5",
    name: "iPad Air",
    type: "Tablet",
    price: 599.99,
    stock: 13,
    description: "Thin and powerful tablet for creative work and entertainment",
    specs: {
      processor: "A16 Bionic",
      ram: "8GB",
      storage: "256GB",
      display: "10.9-inch Liquid Retina",
      battery: "10 hours",
      weight: "461g",
    }
  }
];

// Helper functions to work with product data
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByType = (type: ProductType): Product[] => {
  return products.filter(product => product.type === type);
};

export const getAvailableProducts = (): Product[] => {
  return products.filter(product => product.stock > 0);
};

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return products.filter(product => product.price >= min && product.price <= max);
};

// For recommendation system
export type UserPreference = {
  budget: 'low' | 'medium' | 'high';
  primaryUse: 'productivity' | 'gaming' | 'browsing' | 'creative';
  size: 'compact' | 'standard' | 'large';
  performanceNeeds: 'basic' | 'moderate' | 'high';
};

export type RecommendationLevel = 'high' | 'medium' | 'low';

export const getProductRecommendations = (preferences: UserPreference): { product: Product; level: RecommendationLevel }[] => {
  const recommendations: { product: Product; level: RecommendationLevel }[] = [];
  
  // Budget ranges
  const budgetRanges = {
    low: { min: 0, max: 500 },
    medium: { min: 500, max: 1000 },
    high: { min: 1000, max: Infinity }
  };
  
  // Filter by budget as first pass
  const budgetFiltered = products.filter(
    p => p.price >= budgetRanges[preferences.budget].min && 
         p.price <= budgetRanges[preferences.budget].max &&
         p.stock > 0
  );
  
  // Score each product
  budgetFiltered.forEach(product => {
    let score = 0;
    
    // Performance score
    if (preferences.performanceNeeds === 'high') {
      if (product.type === 'Laptop' && 
          (product.specs.processor.includes('i9') || product.specs.processor.includes('Ryzen 9'))) {
        score += 3;
      } else if (product.type === 'Smartphone' && 
                (product.specs.processor.includes('8 Gen 2') || product.specs.processor.includes('A16'))) {
        score += 3;
      }
    }
    
    // Use case score
    if (preferences.primaryUse === 'gaming' && 
        (product.name.toLowerCase().includes('game') || (product.specs.gpu && String(product.specs.gpu).includes('RTX')))) {
      score += 3;
    } else if (preferences.primaryUse === 'creative' && 
              (product.name.toLowerCase().includes('creative') || product.name.toLowerCase().includes('pro'))) {
      score += 3;
    }
    
    // Size preference
    if (preferences.size === 'compact' && 
        ((product.type === 'Laptop' && Number(product.specs.display.split('-')[0]) < 15) ||
         (product.type === 'Tablet' && Number(product.specs.display.split('-')[0]) < 11) ||
         (product.type === 'Smartphone' && Number(product.specs.display.split('-')[0]) < 6.5))) {
      score += 2;
    } else if (preferences.size === 'large' && 
              ((product.type === 'Laptop' && Number(product.specs.display.split('-')[0]) > 15) ||
               (product.type === 'Tablet' && Number(product.specs.display.split('-')[0]) > 11) ||
               (product.type === 'Smartphone' && Number(product.specs.display.split('-')[0]) > 6.5))) {
      score += 2;
    }
    
    // Determine recommendation level
    let level: RecommendationLevel;
    if (score >= 5) {
      level = 'high';
    } else if (score >= 3) {
      level = 'medium';
    } else {
      level = 'low';
    }
    
    recommendations.push({ product, level });
  });
  
  // Sort by recommendation level (high to low)
  return recommendations.sort((a, b) => {
    const levelOrder = { high: 3, medium: 2, low: 1 };
    return levelOrder[b.level] - levelOrder[a.level];
  });
};
