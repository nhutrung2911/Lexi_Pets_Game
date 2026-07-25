/**
 * js/data/supabaseClient.js
 * Responsibility: Initialize Supabase client for global access.
 */

// BẠN CẦN THAY THẾ CÁC GIÁ TRỊ NÀY BẰNG THÔNG TIN PROJECT SUPABASE CỦA BẠN
const SUPABASE_URL = 'https://wvdevflcstbkbrzvcvst.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5TOfFHiAYqZwV26wEWUEyA_VrJoAcM6';

if (!window.supabase) {
    console.error("Supabase JS SDK chưa được tải!");
}

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
