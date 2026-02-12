
import { createClient } from '@supabase/supabase-js';

// আপনার দেওয়া Supabase প্রজেক্ট ডিটেইলস
const supabaseUrl = 'https://wxzneqlupfrczpyvhogm.supabase.co';
const supabaseAnonKey = 'sb_publishable_92Sy9xwBvcVhAxtuGdbGLg_-kXGl4GN';

// Supabase ক্লায়েন্ট তৈরি
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
