import { createClient, RealtimeChannel } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hqehexdrofifodonauez.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZWhleGRyb2ZpZm9kb25hdWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMDE3NzEsImV4cCI6MjA1Mzc3Nzc3MX0.YwJvBYOZuNZTNsEPBZQwocHSy_rB-ufRE11a-_c9YWs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Join a room/topic. Can be anything except for 'realtime'.
export const myChannel = supabase.channel("test-channel");
export const getChannel = (): RealtimeChannel => {
  return supabase.channel("test-channel");
};