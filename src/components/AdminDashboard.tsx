
import { useState } from 'react';
import { Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { products, Product, ProductType } from '@/data/products';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory'>('overview');

  // Calculate inventory metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const outOfStockCount = products.filter(product => product.stock === 0).length;
  const lowStockCount = products.filter(product => product.stock > 0 && product.stock < 10).length;
  
  // Group products by type
  const productsByType: Record<ProductType, Product[]> = {
    'Laptop': products.filter(p => p.type === 'Laptop'),
    'Smartphone': products.filter(p => p.type === 'Smartphone'),
    'Tablet': products.filter(p => p.type === 'Tablet'),
  };
  
  // Data for category chart
  const categoryData = [
    { name: 'Laptops', count: productsByType['Laptop'].length },
    { name: 'Smartphones', count: productsByType['Smartphone'].length },
    { name: 'Tablets', count: productsByType['Tablet'].length },
  ];
  
  // Data for stock chart
  const stockData = [
    { name: 'Laptops', stock: productsByType['Laptop'].reduce((sum, p) => sum + p.stock, 0) },
    { name: 'Smartphones', stock: productsByType['Smartphone'].reduce((sum, p) => sum + p.stock, 0) },
    { name: 'Tablets', stock: productsByType['Tablet'].reduce((sum, p) => sum + p.stock, 0) },
  ];
  
  // Data for price range
  const priceRanges = {
    'Under $500': products.filter(p => p.price.USD < 500).length,
    '$500-$1000': products.filter(p => p.price.USD >= 500 && p.price.USD < 1000).length,
    'Over $1000': products.filter(p => p.price.USD >= 1000).length,
  };
  
  const priceData = [
    { name: 'Under $500', count: priceRanges['Under $500'] },
    { name: '$500-$1000', count: priceRanges['$500-$1000'] },
    { name: 'Over $1000', count: priceRanges['Over $1000'] },
  ];
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={logout}>Log out</Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'inventory')}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
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
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current inventory levels for all products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Type</th>
                      <th className="p-3 text-left">Price</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-3">{product.name}</td>
                        <td className="p-3">{product.type}</td>
                        <td className="p-3">${product.price.USD.toFixed(2)}</td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.stock === 0
                                ? 'bg-red-100 text-red-800'
                                : product.stock < 10
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.stock === 0
                              ? 'Out of Stock'
                              : product.stock < 10
                              ? 'Low Stock'
                              : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
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
