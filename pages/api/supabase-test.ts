import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../supabase/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from('your_table_name').select('*').limit(1)

  if (error) {
    console.error('❌ Supabase error:', error)
    return res.status(500).json({ success: false, error: error.message })
  }

  res.status(200).json({ success: true, data })
}
