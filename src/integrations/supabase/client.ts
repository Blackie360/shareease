import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wasiwnnuonolskdjdiuq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2l3bm51b25vbHNrZGpkaXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNjg5MDcsImV4cCI6MjA1MDY0NDkwN30.C_eCrXBBXIFBf0XI_5IWkp4O8NzfUqiK43MpPgJK1qI";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);