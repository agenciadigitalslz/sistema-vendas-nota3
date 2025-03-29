// src/store/clientStore.ts
import { supabase } from '../lib/supabaseClient'

const fetchClients = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}
