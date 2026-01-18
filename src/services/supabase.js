import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Critical Error: Missing Supabase environment variables. URL present: ' + !!supabaseUrl + ', Key present: ' + !!supabaseAnonKey;
  console.error(errorMsg);
  document.body.innerHTML = '<div style="color: red; padding: 20px;"><h1>' + errorMsg + '</h1><p>Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Docker Build Args.</p></div>';
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
