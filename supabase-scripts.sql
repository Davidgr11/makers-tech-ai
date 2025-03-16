-- Create user_roles enum type
CREATE TYPE public.user_role AS ENUM ('customer', 'admin');

-- Create profiles table to store user role information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to add profile when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories are publicly viewable
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  USING (true);

-- Only admins can modify categories
CREATE POLICY "Only admins can insert categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update categories" 
  ON public.categories 
  FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  name TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  price_usd DECIMAL(10,2) NOT NULL,
  price_mxn DECIMAL(10,2) NOT NULL,
  company TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products are publicly viewable
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Only admins can modify products
CREATE POLICY "Only admins can insert products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can update products" 
  ON public.products 
  FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create sales table to track product sales
CREATE TABLE public.sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales are viewable by admins only
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view sales" 
  ON public.sales 
  FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can insert sales" 
  ON public.sales 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Insert category data
INSERT INTO public.categories (name) VALUES 
  ('Laptops'),
  ('Smartphones'),
  ('Tablets');

-- Insert sample products for Laptops
INSERT INTO public.products (category_id, name, rating, price_usd, price_mxn, company, short_description, long_description, image_url)
VALUES 
  ((SELECT id FROM public.categories WHERE name = 'Laptops'), 
   'MacBook Pro 16"', 
   4.8, 
   2499.99, 
   44999.82, 
   'Apple', 
   'Professional-grade laptop with M2 Pro chip, 16-inch Liquid Retina XDR display, and all-day battery life.',
   'The MacBook Pro 16" redefines professional computing with the revolutionary M2 Pro chip. This powerhouse delivers exceptional performance for demanding tasks like high-resolution photo editing, complex 3D rendering, and professional audio work.',
   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Laptops'), 
   'Dell XPS 15', 
   4.6, 
   1999.99, 
   35999.82, 
   'Dell', 
   'Premium Windows laptop with 15.6" OLED display, Intel Core i9, and NVIDIA RTX graphics.',
   'The Dell XPS 15 is a premium Windows laptop that combines sleek design with powerful performance. Featuring a stunning 15.6-inch 4K OLED InfinityEdge display, it delivers vibrant colors and deep blacks for an immersive visual experience.',
   'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Laptops'), 
   'Lenovo ThinkPad X1 Carbon', 
   4.7, 
   1799.99, 
   32399.82, 
   'Lenovo', 
   'Business laptop with 14" display, military-grade durability, and enhanced security features.',
   'The Lenovo ThinkPad X1 Carbon is the pinnacle of business laptops, combining legendary ThinkPad reliability with cutting-edge innovation. Its ultralight carbon fiber chassis meets military-grade durability standards while maintaining an elegant, professional aesthetic.',
   'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Laptops'), 
   'HP Spectre x360', 
   4.5, 
   1499.99, 
   26999.82, 
   'HP', 
   'Convertible 2-in-1 laptop with 13.5" touchscreen, Intel Evo platform, and gem-cut design.',
   'The HP Spectre x360 redefines versatility with its innovative 2-in-1 design that seamlessly transitions between laptop, tablet, tent, and presentation modes. Its precision-crafted gem-cut aluminum chassis and dual-chamfered edges make it as much a fashion statement as a technological powerhouse.',
   'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Laptops'), 
   'ASUS ROG Zephyrus G15', 
   4.4, 
   1799.99, 
   32399.82, 
   'ASUS', 
   'Gaming laptop with AMD Ryzen 9, NVIDIA RTX 3080, and 165Hz QHD display.',
   'The ASUS ROG Zephyrus G15 is a gaming powerhouse that does not compromise on portability. Weighing just 4.19 pounds and measuring 0.78 inches thin, it packs incredible performance into a surprisingly compact chassis.',
   'https://images.unsplash.com/photo-1603481546579-65d935ba9754?w=800&auto=format&fit=crop');

-- Insert sample products for Smartphones
INSERT INTO public.products (category_id, name, rating, price_usd, price_mxn, company, short_description, long_description, image_url)
VALUES 
  ((SELECT id FROM public.categories WHERE name = 'Smartphones'), 
   'iPhone 15 Pro', 
   4.7, 
   999.99, 
   17999.82, 
   'Apple', 
   'Premium smartphone with titanium build, A17 Pro chip, 48MP camera, and USB-C connectivity.',
   'The iPhone 15 Pro combines cutting-edge performance with a sleek and durable titanium design, making it the lightest Pro model yet. Powered by the A17 Pro chip, it delivers exceptional speed, power efficiency, and gaming performance with console-quality graphics.',
   'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Smartphones'), 
   'Samsung Galaxy S23 Ultra', 
   4.8, 
   1199.99, 
   21599.82, 
   'Samsung', 
   'Flagship Android phone with S Pen, 200MP camera, Snapdragon 8 Gen 2, and 6.8" Dynamic AMOLED display.',
   'The Samsung Galaxy S23 Ultra represents the pinnacle of smartphone technology, combining innovative features with exceptional performance. Its standout 200MP camera system with improved Nightography capabilities captures stunning detail in any lighting condition.',
   'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Smartphones'), 
   'Google Pixel 8 Pro', 
   4.6, 
   899.99, 
   16199.82, 
   'Google', 
   'AI-powered smartphone with Tensor G3 chip, 50MP camera system, and 6.7" Super Actua display.',
   'The Google Pixel 8 Pro showcases Google AI innovation with the new Tensor G3 chip powering intelligent features across the device. Its advanced camera system includes a 50MP main sensor, 48MP ultrawide, and 48MP telephoto lens with 5x optical zoom.',
   'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Smartphones'), 
   'OnePlus 11', 
   4.5, 
   699.99, 
   12599.82, 
   'OnePlus', 
   'Flagship killer with Snapdragon 8 Gen 2, Hasselblad cameras, and 100W SUPERVOOC charging.',
   'The OnePlus 11 returns to the brand flagship killer roots, offering premium features at a competitive price. Its performance is anchored by the Snapdragon 8 Gen 2 processor and up to 16GB of RAM, delivering exceptional speed for gaming and multitasking.',
   'https://images.unsplash.com/photo-1606224547099-7b4988f99533?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Smartphones'), 
   'Xiaomi 14 Ultra', 
   4.4, 
   1099.99, 
   19799.82, 
   'Xiaomi', 
   'Photography-focused smartphone with Leica quad cameras, Snapdragon 8 Gen 3, and 6.73" AMOLED display.',
   'The Xiaomi 14 Ultra is built for photography enthusiasts with its Leica-engineered quad camera system featuring a 1-inch type sensor, variable aperture main camera, and three 50MP supporting lenses for ultrawide, 3.2x telephoto, and 5x periscope zoom scenarios.',
   'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop');

-- Insert sample products for Tablets
INSERT INTO public.products (category_id, name, rating, price_usd, price_mxn, company, short_description, long_description, image_url)
VALUES 
  ((SELECT id FROM public.categories WHERE name = 'Tablets'), 
   'iPad Pro 12.9"', 
   4.9, 
   1299.99, 
   23399.82, 
   'Apple', 
   'Professional tablet with M2 chip, mini-LED XDR display, and Apple Pencil 2 support.',
   'The iPad Pro 12.9" with M2 chip represents the ultimate tablet experience for professionals. Its Liquid Retina XDR display with mini-LED technology delivers extreme dynamic range with 1000 nits of full-screen brightness and 1600 nits peak for HDR content.',
   'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Tablets'), 
   'Samsung Galaxy Tab S9 Ultra', 
   4.7, 
   1199.99, 
   21599.82, 
   'Samsung', 
   '14.6" Android tablet with Snapdragon 8 Gen 2, S Pen included, and IP68 water resistance.',
   'The Samsung Galaxy Tab S9 Ultra is an Android powerhouse with a massive 14.6-inch Dynamic AMOLED 2X display that makes it perfect for productivity and entertainment. With a 120Hz refresh rate and HDR10+ support, content looks stunning whether you are editing photos, watching movies, or multitasking.',
   'https://images.unsplash.com/photo-1589739900243-4b52cd9dd8df?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Tablets'), 
   'Microsoft Surface Pro 9', 
   4.6, 
   999.99, 
   17999.82, 
   'Microsoft', 
   '2-in-1 Windows tablet with 13" display, Intel Core i7 or Microsoft SQ3, and detachable keyboard.',
   'The Microsoft Surface Pro 9 continues the legacy of defining the 2-in-1 category, offering the versatility of a tablet with the power of a laptop. Available with either Intel Core processors for maximum compatibility or Microsoft SQ3 with 5G connectivity for always-connected productivity.',
   'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Tablets'), 
   'Lenovo Tab P12 Pro', 
   4.4, 
   699.99, 
   12599.82, 
   'Lenovo', 
   'Entertainment and productivity tablet with 12.6" AMOLED display, Snapdragon 870, and Precision Pen 3.',
   'The Lenovo Tab P12 Pro is designed for both entertainment and productivity with its stunning 12.6-inch 2K AMOLED display featuring 120Hz refresh rate, HDR10+ support, and Dolby Vision. This expansive screen makes it perfect for movie watching, gaming, and split-screen multitasking.',
   'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop'),
   
  ((SELECT id FROM public.categories WHERE name = 'Tablets'), 
   'Amazon Fire Max 11', 
   4.2, 
   229.99, 
   4139.82, 
   'Amazon', 
   'Affordable 11" tablet with octa-core processor, aluminum build, and Alexa integration.',
   'The Amazon Fire Max 11 represents a significant step up in Amazon tablet lineup, offering a premium aluminum unibody design that both lightweight and durable. Its 11-inch 2000 x 1200 display delivers sharp, colorful visuals for browsing, reading, and streaming content.',
   'https://images.unsplash.com/photo-1585790050230-5ab129974334?w=800&auto=format&fit=crop');
   
-- Insert sample sales data
INSERT INTO public.sales (product_id, quantity)
SELECT id, floor(random() * 50) + 1
FROM public.products;
