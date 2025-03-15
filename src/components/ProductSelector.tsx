
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Watch, 
  Camera, 
  Tv, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProductCategory = 
  | 'Laptops' 
  | 'Smartphones' 
  | 'Audio' 
  | 'Wearables'
  | 'Cameras'
  | 'TVs';

interface ProductSelectorProps {
  onSelectProduct: (product: ProductCategory) => void;
}

interface ProductOption {
  value: ProductCategory;
  label: string;
  icon: React.ReactNode;
}

const ProductSelector = ({ onSelectProduct }: ProductSelectorProps) => {
  const [hoveredItem, setHoveredItem] = useState<ProductCategory | null>(null);
  
  const productOptions: ProductOption[] = [
    { value: 'Laptops', label: 'Laptops', icon: <Laptop className="h-5 w-5" /> },
    { value: 'Smartphones', label: 'Smartphones', icon: <Smartphone className="h-5 w-5" /> },
    { value: 'Audio', label: 'Audio Devices', icon: <Headphones className="h-5 w-5" /> },
    { value: 'Wearables', label: 'Wearables', icon: <Watch className="h-5 w-5" /> },
    { value: 'Cameras', label: 'Cameras', icon: <Camera className="h-5 w-5" /> },
    { value: 'TVs', label: 'TVs', icon: <Tv className="h-5 w-5" /> },
  ];
  
  return (
    <div className="w-full py-4 animate-fade-in">
      <h3 className="text-sm font-medium text-center mb-4">
        What product do you need help with?
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {productOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={cn(
              "relative h-auto flex flex-col items-center justify-center py-4 px-2 gap-2 border hover-scale transition-all",
              hoveredItem === option.value && "border-primary/50 bg-primary/5"
            )}
            onClick={() => onSelectProduct(option.value)}
            onMouseEnter={() => setHoveredItem(option.value)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="text-primary">{option.icon}</div>
            <span className="text-xs font-medium">{option.label}</span>
            
            <ChevronRight 
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-primary transition-opacity duration-200",
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
