-- Fix agent system RLS policies
-- Root cause: the original policies used auth.uid() IN (subquery against admin_roles)
-- but admin_roles itself may be RLS-protected, making the subquery return empty → access denied.
-- Fix: use a SECURITY DEFINER function that runs as the DB owner, bypassing RLS on admin_roles.

-- ─── SECURITY DEFINER HELPER ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  );
$$;

-- ─── ENABLE RLS on agent_departments (was missing from 006) ──────────────────

ALTER TABLE agent_departments ENABLE ROW LEVEL SECURITY;

-- ─── DROP old broken policies ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "super_admin_agents" ON agents;
DROP POLICY IF EXISTS "super_admin_agent_tasks" ON agent_tasks;
DROP POLICY IF EXISTS "super_admin_approval_queue" ON approval_queue;
DROP POLICY IF EXISTS "super_admin_agent_commands" ON agent_commands;
DROP POLICY IF EXISTS "super_admin_token_usage" ON token_usage;

-- ─── CREATE new policies using the SECURITY DEFINER function ─────────────────

CREATE POLICY "super_admin_agent_departments" ON agent_departments
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "super_admin_agents" ON agents
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "super_admin_agent_tasks" ON agent_tasks
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "super_admin_approval_queue" ON approval_queue
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "super_admin_agent_commands" ON agent_commands
  FOR ALL USING (public.is_super_admin());

CREATE POLICY "super_admin_token_usage" ON token_usage
  FOR ALL USING (public.is_super_admin());
