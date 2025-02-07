
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmpgigxygxibwqbihvwi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcGdpZ3h5Z3hpYndxYmlodndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjQzNzcsImV4cCI6MjA1NDU0MDM3N30.pXk14kJ5giTJUnzAaJvyvXWUpWeEWUlCn9_rUk_lGK4';

export const supabase = createClient(supabaseUrl, supabaseKey);
