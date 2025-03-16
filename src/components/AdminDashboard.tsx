import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  name: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  price_usd: number;
  // This property will be populated by the Supabase "join" on categories.
  // If you named your relationship differently, adjust accordingly.
  categories?: Category; 
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory'>('overview');
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from Supabase on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          // Pull in category name via a relationship
          // Make sure your foreign key relationship is set up in Supabase
          .select(`
            id,
            name,
            stock,
            price_usd,
            categories ( name )
          `);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // === Inventory Metrics ===
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const outOfStockCount = products.filter(product => product.stock === 0).length;
  const lowStockCount = products.filter(product => product.stock > 0 && product.stock < 10).length;

  // === Group Products by Category Name ===
  // (If a product has no related category row, we'll label it "Uncategorized".)
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(product => {
    const categoryName = product.categories?.name || 'Uncategorized';
    if (!productsByCategory[categoryName]) {
      productsByCategory[categoryName] = [];
    }
    productsByCategory[categoryName].push(product);
  });

  // === Prepare Chart Data ===
  // 1) Category Distribution
  const categoryData = Object.entries(productsByCategory).map(([catName, catProducts]) => ({
    name: catName,
    count: catProducts.length,
  }));

  // 2) Stock by Category
  const stockData = Object.entries(productsByCategory).map(([catName, catProducts]) => ({
    name: catName,
    stock: catProducts.reduce((sum, p) => sum + p.stock, 0),
  }));

  // 3) Price Range Distribution
  const priceRanges = {
    'Under $500': 0,
    '$500-$1000': 0,
    'Over $1000': 0,
  };
  products.forEach(product => {
    if (product.price_usd < 500) {
      priceRanges['Under $500']++;
    } else if (product.price_usd < 1000) {
      priceRanges['$500-$1000']++;
    } else {
      priceRanges['Over $1000']++;
    }
  });
  const priceData = [
    { name: 'Under $500', count: priceRanges['Under $500'] },
    { name: '$500-$1000', count: priceRanges['$500-$1000'] },
    { name: 'Over $1000', count: priceRanges['Over $1000'] },
  ];

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'inventory')}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        {/* === OVERVIEW TAB === */}
        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStock}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{lowStockCount}</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Products by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Distribution of products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Stock by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Stock by Category</CardTitle>
                <CardDescription>Current stock levels by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="stock" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Price Range Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Price Range Distribution</CardTitle>
                <CardDescription>Number of products by price range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* === INVENTORY TAB === */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current inventory levels for all products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-left">Price (USD)</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const statusClass =
                        product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 10
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800';

                      return (
                        <tr key={product.id} className="border-b">
                          <td className="p-3">{product.name}</td>
                          <td className="p-3">{product.categories?.name || 'Uncategorized'}</td>
                          <td className="p-3">${product.price_usd.toFixed(2)}</td>
                          <td className="p-3">{product.stock}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
                              {product.stock === 0
                                ? 'Out of Stock'
                                : product.stock < 10
                                ? 'Low Stock'
                                : 'In Stock'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
