import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
// This should only be used in Server Components, Server Actions, and API routes
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  // Use service role key for server-side operations (bypasses RLS)
  // This gives full access to the database from the server
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Type helper for database types (you'll define this based on your schema)
export type Database = {
  // Define your database types here
  // Example:
  // public: {
  //   Tables: {
  //     properties: {
  //       Row: { ... }
  //       Insert: { ... }
  //       Update: { ... }
  //     }
  //   }
  // }
};

