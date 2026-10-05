# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project settings: https://app.supabase.com/project/_/settings/api

# Your Supabase project URL (server-side only)
SUPABASE_URL=your_supabase_project_url

# Service Role Key (for server-side operations only - keep this secret!)
# This key bypasses Row Level Security (RLS) and should NEVER be exposed to the client
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use this for `SUPABASE_URL`
   - **service_role key** (under Project API keys) → Use this for `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important Security Notes:**
- The `SUPABASE_SERVICE_ROLE_KEY` has full database access and bypasses Row Level Security
- **NEVER** commit this key to version control
- **NEVER** expose this key to the client-side code
- Only use it in Server Components, Server Actions, and API routes
- The `.env.local` file is already in `.gitignore` and won't be committed

## Usage

The Supabase client is configured for server-side use only. Import it in your Server Components or API routes:

```typescript
import { createServerClient } from '@/lib/supabase/server';

// In a Server Component or API route
const supabase = createServerClient();

// Example: Fetch data
const { data, error } = await supabase
  .from('properties')
  .select('*');
```

