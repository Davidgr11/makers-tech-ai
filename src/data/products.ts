
export type ProductType = 'Laptop' | 'Smartphone' | 'Tablet';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: {
    USD: number;
    MXN: number;
  };
  stock: number;
  description: string;
  specs: {
    [key: string]: string | number | boolean;
  };
  image: string;
}

// Mock database for demonstration purposes
export const products: Product[] = [
  {
    id: "laptop-1",
    name: "ProBook X5",
    type: "Laptop",
    price: {
      USD: 1299.99,
      MXN: 23399.99
    },
    stock: 23,
    description: "High-performance laptop for professionals with a sleek design and long battery life",
    specs: {
      processor: "Intel Core i7-12700H",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      display: "15.6-inch 4K",
      battery: "10 hours",
      weight: "1.8kg",
    },
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600"
  },
  {
    id: "laptop-2",
    name: "UltraSlim 7",
    type: "Laptop",
    price: {
      USD: 899.99,
      MXN: 16199.99
    },
    stock: 15,
    description: "Ultra-thin and lightweight laptop for on-the-go productivity and everyday tasks",
    specs: {
      processor: "AMD Ryzen 7 5800U",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      display: "14-inch Full HD",
      battery: "12 hours",
      weight: "1.3kg",
    },
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600"
  },
  {
    id: "laptop-3",
    name: "GameMaster Pro",
    type: "Laptop",
    price: {
      USD: 1799.99,
      MXN: 32399.99
    },
    stock: 7,
    description: "Ultimate gaming laptop with RGB lighting and powerful cooling for intense gaming sessions",
    specs: {
      processor: "Intel Core i9-12900HK",
      ram: "32GB DDR5",
      storage: "1TB NVMe SSD",
      display: "17.3-inch 165Hz",
      gpu: "NVIDIA RTX 4080 Mobile",
      battery: "6 hours",
      weight: "2.5kg",
    },
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600"
  },
  {
    id: "laptop-4",
    name: "BusinessBook Air",
    type: "Laptop",
    price: {
      USD: 1099.99,
      MXN: 19799.99
    },
    stock: 0,
    description: "Slim business laptop with enterprise-grade security features for professional use",
    specs: {
      processor: "Intel Core i5-1240P",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      display: "13.3-inch QHD",
      battery: "14 hours",
      weight: "1.2kg",
    },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600"
  },
  {
    id: "laptop-5",
    name: "CreativePro Studio",
    type: "Laptop",
    price: {
      USD: 2199.99,
      MXN: 39599.99
    },
    stock: 3,
    description: "Designed for creative professionals with color-accurate display and powerful graphics",
    specs: {
      processor: "AMD Ryzen 9 7950X",
      ram: "64GB DDR5",
      storage: "2TB SSD",
      display: "16-inch 4K OLED",
      gpu: "AMD Radeon Pro",
      battery: "8 hours",
      weight: "2.1kg",
    },
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600"
  },
  {
    id: "smartphone-1",
    name: "Pixel Ultra",
    type: "Smartphone",
    price: {
      USD: 899.99,
      MXN: 16199.99
    },
    stock: 42,
    description: "Premium smartphone with the best camera on the market and all-day battery life",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      display: "6.7-inch AMOLED",
      battery: "5000mAh",
      camera: "108MP main + 48MP ultrawide",
    },
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600"
  },
  {
    id: "smartphone-2",
    name: "iConnect Pro",
    type: "Smartphone",
    price: {
      USD: 1099.99,
      MXN: 19799.99
    },
    stock: 18,
    description: "Flagship smartphone with the latest features and premium design for power users",
    specs: {
      processor: "A16 Bionic",
      ram: "8GB",
      storage: "512GB",
      display: "6.5-inch Super Retina XDR",
      battery: "4500mAh",
      camera: "48MP triple camera system",
    },
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600"
  },
  {
    id: "smartphone-3",
    name: "Galaxy Edge",
    type: "Smartphone",
    price: {
      USD: 799.99,
      MXN: 14399.99
    },
    stock: 0,
    description: "Feature-packed smartphone with curved edge display and amazing camera system",
    specs: {
      processor: "Exynos 2200",
      ram: "16GB",
      storage: "256GB",
      display: "6.8-inch Dynamic AMOLED",
      battery: "5500mAh",
      camera: "108MP quad camera",
    },
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=600"
  },
  {
    id: "smartphone-4",
    name: "Essential Lite",
    type: "Smartphone",
    price: {
      USD: 399.99,
      MXN: 7199.99
    },
    stock: 56,
    description: "Affordable smartphone with all essential features and impressive battery life",
    specs: {
      processor: "MediaTek Dimensity 900",
      ram: "6GB",
      storage: "128GB",
      display: "6.4-inch LCD",
      battery: "4800mAh",
      camera: "64MP main + 8MP wide",
    },
    image: "https://images.unsplash.com/photo-1606293459339-81a051db2d81?auto=format&fit=crop&w=600"
  },
  {
    id: "smartphone-5",
    name: "Note Master",
    type: "Smartphone",
    price: {
      USD: 849.99,
      MXN: 15299.99
    },
    stock: 11,
    description: "Large smartphone with stylus support for productivity and multitasking",
    specs: {
      processor: "Snapdragon 8+ Gen 1",
      ram: "12GB",
      storage: "512GB",
      display: "6.9-inch LTPO AMOLED",
      battery: "5200mAh",
      camera: "50MP triple camera",
    },
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=600"
  },
  {
    id: "tablet-1",
    name: "SlateTab Pro",
    type: "Tablet",
    price: {
      USD: 649.99,
      MXN: 11699.99
    },
    stock: 19,
    description: "Professional-grade tablet with stylus support perfect for creative work",
    specs: {
      processor: "M2 chip",
      ram: "8GB",
      storage: "256GB",
      display: "11-inch Liquid Retina",
      battery: "10 hours",
      weight: "466g",
    },
    image: "https://images.unsplash.com/photo-1585790050230-5ab129974334?auto=format&fit=crop&w=600"
  },
  {
    id: "tablet-2",
    name: "Galaxy Tab Ultra",
    type: "Tablet",
    price: {
      USD: 899.99,
      MXN: 16199.99
    },
    stock: 7,
    description: "Premium Android tablet with desktop-like productivity features and vibrant display",
    specs: {
      processor: "Snapdragon 8 Gen 2",
      ram: "16GB",
      storage: "512GB",
      display: "12.4-inch Super AMOLED",
      battery: "12 hours",
      weight: "575g",
    },
    image: "https://images.unsplash.com/photo-1586795167744-16ddb4368d8c?auto=format&fit=crop&w=600"
  },
  {
    id: "tablet-3",
    name: "Surface Go",
    type: "Tablet",
    price: {
      USD: 499.99,
      MXN: 8999.99
    },
    stock: 0,
    description: "Versatile 2-in-1 tablet that transforms into a laptop with keyboard attachment",
    specs: {
      processor: "Intel Core i3-1115G4",
      ram: "8GB",
      storage: "128GB",
      display: "10.5-inch PixelSense",
      battery: "11 hours",
      weight: "544g",
    },
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?auto=format&fit=crop&w=600"
  },
  {
    id: "tablet-4",
    name: "Kindle Fire HD",
    type: "Tablet",
    price: {
      USD: 199.99,
      MXN: 3599.99
    },
    stock: 31,
    description: "Affordable entertainment tablet for reading and streaming your favorite content",
    specs: {
      processor: "MediaTek MT8183",
      ram: "4GB",
      storage: "64GB",
      display: "10.1-inch Full HD",
      battery: "12 hours",
      weight: "465g",
    },
    image: "https://images.unsplash.com/photo-1544631006-71133fe10647?auto=format&fit=crop&w=600"
  },
  {
    id: "tablet-5",
    name: "iPad Air",
    type: "Tablet",
    price: {
      USD: 599.99,
      MXN: 10799.99
    },
    stock: 13,
    description: "Thin and powerful tablet for creative work and entertainment with stunning display",
    specs: {
      processor: "A16 Bionic",
      ram: "8GB",
      storage: "256GB",
      display: "10.9-inch Liquid Retina",
      battery: "10 hours",
      weight: "461g",
    },
    image: "https://images.unsplash.com/photo-1557825835-483717203388?auto=format&fit=crop&w=600"
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
  return products.filter(product => product.price.USD >= min && product.price.USD <= max);
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
    p => p.price.USD >= budgetRanges[preferences.budget].min && 
         p.price.USD <= budgetRanges[preferences.budget].max &&
         p.stock > 0
  );
  
  // Score each product
  budgetFiltered.forEach(product => {
    let score = 0;
    
    // Performance score
    if (preferences.performanceNeeds === 'high') {
      if (product.type === 'Laptop' && 
          (String(product.specs.processor).includes('i9') || 
           String(product.specs.processor).includes('Ryzen 9'))) {
        score += 3;
      } else if (product.type === 'Smartphone' && 
                (String(product.specs.processor).includes('8 Gen 2') || 
                 String(product.specs.processor).includes('A16'))) {
        score += 3;
      }
    }
    
    // Use case score
    if (preferences.primaryUse === 'gaming' && 
        (product.name.toLowerCase().includes('game') || 
         (product.specs.gpu && String(product.specs.gpu).includes('RTX')))) {
      score += 3;
    } else if (preferences.primaryUse === 'creative' && 
              (product.name.toLowerCase().includes('creative') || 
               product.name.toLowerCase().includes('pro'))) {
      score += 3;
    }
    
    // Size preference
    if (preferences.size === 'compact' && 
        ((product.type === 'Laptop' && Number(String(product.specs.display).split('-')[0]) < 15) ||
         (product.type === 'Tablet' && Number(String(product.specs.display).split('-')[0]) < 11) ||
         (product.type === 'Smartphone' && Number(String(product.specs.display).split('-')[0]) < 6.5))) {
      score += 2;
    } else if (preferences.size === 'large' && 
              ((product.type === 'Laptop' && Number(String(product.specs.display).split('-')[0]) > 15) ||
               (product.type === 'Tablet' && Number(String(product.specs.display).split('-')[0]) > 11) ||
               (product.type === 'Smartphone' && Number(String(product.specs.display).split('-')[0]) > 6.5))) {
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
