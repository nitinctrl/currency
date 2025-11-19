-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  quotation_number TEXT NOT NULL,
  quotation_date DATE NOT NULL,
  valid_until DATE,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quotation items table
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 18.00,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotations
CREATE POLICY "Users can view their own quotations"
  ON public.quotations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotations"
  ON public.quotations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotations"
  ON public.quotations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quotation items
CREATE POLICY "Users can view their own quotation items"
  ON public.quotation_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own quotation items"
  ON public.quotation_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own quotation items"
  ON public.quotation_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own quotation items"
  ON public.quotation_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.user_id = auth.uid()
    )
  );
