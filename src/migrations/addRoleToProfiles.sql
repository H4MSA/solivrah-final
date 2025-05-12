
-- Add a role column to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Grant admin role to the currently authenticated user
UPDATE public.profiles SET role = 'admin' WHERE id = auth.uid();

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for the admin page access
-- ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admins can do anything" ON public.ai_settings 
--   USING (is_admin(auth.uid()))
--   WITH CHECK (is_admin(auth.uid()));
