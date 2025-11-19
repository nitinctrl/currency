-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  hsn_code TEXT,
  price DECIMAL(10, 2) NOT NULL,
  purchase_price DECIMAL(10, 2),
  tax_rate DECIMAL(5, 2) DEFAULT 18.00,
  stock_quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);
