-- ============================================================
-- withSahib — Super Admin Setup
-- Run these queries in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Step 1: List all registered users (auth.users)
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at;

-- Step 2: List current admin_roles entries
SELECT ar.user_id, au.email, ar.role, ar.created_at
FROM public.admin_roles ar
JOIN auth.users au ON au.id = ar.user_id
ORDER BY ar.created_at;

-- Step 3: Grant super_admin role to a user
-- Replace 'USER_EMAIL_HERE' with the actual email, or use ID directly.
--
-- Option A — by email:
--   INSERT INTO public.admin_roles (user_id, role)
--   SELECT id, 'super_admin' FROM auth.users WHERE email = 'USER_EMAIL_HERE'
--   ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
--
-- Option B — by UUID:
--   INSERT INTO public.admin_roles (user_id, role)
--   VALUES ('UUID_HERE', 'super_admin')
--   ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Step 4: Verify
SELECT ar.user_id, au.email, ar.role
FROM public.admin_roles ar
JOIN auth.users au ON au.id = ar.user_id
WHERE ar.role = 'super_admin';

-- ============================================================
-- NOTE: /brand page in the site checks admin_roles.role = 'super_admin'.
-- Any user in admin_roles with role='super_admin' will have access.
-- Users with role='viewer_admin' are redirected to /dashboard.
-- ============================================================
