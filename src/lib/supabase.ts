import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ltbxwpcdgrsbhimrwqlg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Ynh3cGNkZ3JzYmhpbXJ3cWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjM0MDgsImV4cCI6MjA2NzUzOTQwOH0.vbsG717r1q6feBLdjyJQsqRbK98nwq_39Zg7oN8UnV4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "implicit",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});