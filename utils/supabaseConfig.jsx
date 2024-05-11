import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wznpzguqtwktpfeoccwk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnB6Z3VxdHdrdHBmZW9jY3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NDA1MzgsImV4cCI6MjAzMTAxNjUzOH0.Y0cA9FIP1afwPaZChrleu95wgsP9mWGrB7rxuTWWIgk";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
