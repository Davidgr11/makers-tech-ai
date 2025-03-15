
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Laptop, 
  Smartphone, 
  Tablet,  
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProductCategory = 
  | 'Laptops' 
  | 'Smartphones' 
  | 'Tablets';

interface ProductSelectorProps {
  onSelectProduct: (product: ProductCategory) => void;
}

interface ProductOption {
  value: ProductCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const ProductSelector = ({ onSelectProduct }: ProductSelectorProps) => {
  const [hoveredItem, setHoveredItem] = useState<ProductCategory | null>(null);
  
  const productOptions: ProductOption[] = [
    { 
      value: 'Laptops', 
      label: 'Laptops', 
      icon: <Laptop className="h-5 w-5" />,
      description: 'From ultralight to gaming powerhouses'
    },
    { 
      value: 'Smartphones', 
      label: 'Smartphones', 
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Latest models with cutting-edge features'
    },
    { 
      value: 'Tablets', 
      label: 'Tablets', 
      icon: <Tablet className="h-5 w-5" />,
      description: 'Versatile devices for work and play'
    }
  ];
  
  return (
    <div className="w-full py-4 animate-fade-in">
      <h3 className="text-sm font-medium text-center mb-4">
        Browse Makers Tech Products
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {productOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={cn(
              "relative flex items-start justify-start py-4 px-4 gap-3 border hover-scale transition-all h-auto",
              hoveredItem === option.value && "border-primary/50 bg-primary/5"
            )}
            onClick={() => onSelectProduct(option.value)}
            onMouseEnter={() => setHoveredItem(option.value)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="text-primary mt-0.5">{option.icon}</div>
            <div className="text-left">
              <span className="font-medium block">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
            
            <ChevronRight 
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-opacity duration-200",
                hoveredItem === option.value ? "opacity-100" : "opacity-0"
              )} 
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductSelector;
