const SUPABASE_URL = 'https://zvnlluwfhzdiqufqjqoj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bmxsdXdmaHpkaXF1ZnFqcW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3OTI0MzYsImV4cCI6MjA5OTM2ODQzNn0.aacGI0m5wmiOph1zTVoXblo9Pz-94n6-zS5gHU8AHHo';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getMiTenant() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data, error } = await sb
    .from('usuarios_tenant')
    .select('tenant_id, rol, nombre, tenants(slug, name)')
    .eq('user_id', user.id)
    .limit(1)
    .single();
  if (error || !data) return null;
  return {
    user_id: user.id,
    email: user.email,
    tenant_id: data.tenant_id,
    slug: data.tenants.slug,
    name: data.tenants.name,
    rol: data.rol,
    nombre: data.nombre
  };
}

async function requireAuth() {
  const tenant = await getMiTenant();
  if (!tenant) { window.location.href = 'login.html'; return null; }
  return tenant;
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = 'login.html';
}
