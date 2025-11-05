import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dfhozzpagribvopqnirk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaG96enBhZ3JpYnZvcHFuaXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzExODUsImV4cCI6MjA3NzkwNzE4NX0.HELF_lamvOER9HNba8gml2i1wwLy5n_kDV5QNIef8mw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
