-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 18.00,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON public.invoices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for invoice items
CREATE POLICY "Users can view their own invoice items"
  ON public.invoice_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own invoice items"
  ON public.invoice_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own invoice items"
  ON public.invoice_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own invoice items"
  ON public.invoice_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = auth.uid()
    )
  );
