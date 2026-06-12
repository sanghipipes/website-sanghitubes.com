-- ============================================================
-- SANGHI PIPES & TUBES — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- Helper function: check if current user is an admin_user
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM admin_users WHERE id = auth.uid();
$$;

-- -------------------------------------------------------
-- PRODUCTS policies
-- -------------------------------------------------------

-- Public can read all products
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  TO public
  USING (true);

-- Only admin / editor can insert
CREATE POLICY "products_insert_admin_editor"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (get_admin_role() IN ('admin', 'editor'));

-- Only admin / editor can update
CREATE POLICY "products_update_admin_editor"
  ON products FOR UPDATE
  TO authenticated
  USING  (get_admin_role() IN ('admin', 'editor'))
  WITH CHECK (get_admin_role() IN ('admin', 'editor'));

-- Only admin can delete
CREATE POLICY "products_delete_admin"
  ON products FOR DELETE
  TO authenticated
  USING (get_admin_role() = 'admin');

-- -------------------------------------------------------
-- QUOTE REQUESTS policies
-- -------------------------------------------------------

-- Anyone can submit a quote
CREATE POLICY "quote_requests_insert_public"
  ON quote_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admin / sales can read quotes
CREATE POLICY "quote_requests_select_admin_sales"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (get_admin_role() IN ('admin', 'sales'));

-- Only admin / sales can update status
CREATE POLICY "quote_requests_update_admin_sales"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING  (get_admin_role() IN ('admin', 'sales'))
  WITH CHECK (get_admin_role() IN ('admin', 'sales'));

-- Only admin can delete
CREATE POLICY "quote_requests_delete_admin"
  ON quote_requests FOR DELETE
  TO authenticated
  USING (get_admin_role() = 'admin');

-- -------------------------------------------------------
-- QUOTE ITEMS policies
-- -------------------------------------------------------

-- Anyone can insert quote items (linked to a quote submission)
CREATE POLICY "quote_items_insert_public"
  ON quote_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admin / sales can read
CREATE POLICY "quote_items_select_admin_sales"
  ON quote_items FOR SELECT
  TO authenticated
  USING (get_admin_role() IN ('admin', 'sales'));

-- Only admin can delete
CREATE POLICY "quote_items_delete_admin"
  ON quote_items FOR DELETE
  TO authenticated
  USING (get_admin_role() = 'admin');

-- -------------------------------------------------------
-- CONTACT MESSAGES policies
-- -------------------------------------------------------

-- Anyone can submit a contact message
CREATE POLICY "contact_messages_insert_public"
  ON contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admin can read contact messages
CREATE POLICY "contact_messages_select_admin"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin_user());

-- Only admin can delete
CREATE POLICY "contact_messages_delete_admin"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (get_admin_role() = 'admin');

-- -------------------------------------------------------
-- ADMIN USERS policies
-- -------------------------------------------------------

-- Authenticated users can read their own record
CREATE POLICY "admin_users_select_own"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Only admin can insert new admin users
CREATE POLICY "admin_users_insert_admin"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (get_admin_role() = 'admin');

-- Only admin can update roles
CREATE POLICY "admin_users_update_admin"
  ON admin_users FOR UPDATE
  TO authenticated
  USING  (get_admin_role() = 'admin')
  WITH CHECK (get_admin_role() = 'admin');

-- Only admin can delete admin users
CREATE POLICY "admin_users_delete_admin"
  ON admin_users FOR DELETE
  TO authenticated
  USING (get_admin_role() = 'admin');

-- -------------------------------------------------------
-- STORAGE: product-images bucket
-- Run after creating the bucket in Supabase Dashboard
-- -------------------------------------------------------

-- Anyone can view product images
CREATE POLICY "product_images_select_public"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Only admin / editor can upload product images
CREATE POLICY "product_images_insert_admin_editor"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND get_admin_role() IN ('admin', 'editor')
  );

-- Only admin / editor can delete product images
CREATE POLICY "product_images_delete_admin_editor"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND get_admin_role() IN ('admin', 'editor')
  );
