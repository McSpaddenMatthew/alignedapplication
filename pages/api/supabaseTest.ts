import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req, res) {
  const { data, error } = await supabase.from('Test').select('*');
 // ✅ Remove any `.limit()` temporarily

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ success: false, error });
  }

  return res.status(200).json({ success: true, data });
}
