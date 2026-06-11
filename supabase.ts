import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://kmmefhhhgstbvqzsakcw.supabase.co";

const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbWVmaGhoZ3N0YnZxenNha2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzYyOTIsImV4cCI6MjA5NTAxMjI5Mn0.TSgU2K0FtcgAHaYT1EOoCTANw0WqQZ8Hy0YJ6RKu7OM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);