
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
