
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeft, 
  Star, 
  Truck, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  company: string;
  image_url: string;
  rating: number;
  price_usd: number;
  price_mxn: number;
  short_description: string;
  long_description: string;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id, navigate, toast, isAuthenticated]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo size="md" />
          
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? (
          <LoadingState />
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="max-h-[400px] object-contain" 
              />
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">{product.company}</div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4" 
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{product.rating} stars</span>
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-purple-700">
                  {formatPrice(product.price_usd)}
                </div>
                <div className="text-sm text-gray-500">
                  MXN: {formatPrice(product.price_mxn)}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Overview</h3>
                <p className="text-gray-700">{product.short_description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3 text-center">
                    <Truck className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs">Free Shipping</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3 text-center">
                    <ShieldCheck className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs">1 Year Warranty</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3 text-center">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <p className="text-xs">30-Day Returns</p>
                  </CardContent>
                </Card>
              </div>
              
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Add to Cart
              </Button>
            </div>
            
            {/* Product Description */}
            <div className="md:col-span-2 bg-white rounded-lg p-6 mt-8">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.long_description}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/')}
            >
              Go Back Home
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Makers Tech. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const LoadingState = () => (
  <div className="grid md:grid-cols-2 gap-8 animate-pulse">
    <Skeleton className="h-[400px] w-full rounded-lg" />
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-10 w-1/3" />
      <div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

export default ProductPage;
