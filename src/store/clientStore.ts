
import { supabase } from '../lib/supabaseClient'
import { Client } from '@/types'

// Função para buscar todos os clientes
export const fetchClients = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

// Função para adicionar um cliente
export const addClient = async (name: string) => {
  if (!name || name.trim() === '') {
    throw new Error("O nome do cliente é obrigatório.")
  }

  const { data, error } = await supabase
    .from('clientes')
    .insert([{ name }])
    .select()

  if (error) {
    console.error('Erro ao adicionar cliente:', error)
    throw new Error(error.message || 'Erro inesperado ao adicionar cliente.')
  }

  return data[0]
}


// Função para excluir um cliente
export const deleteClient = async (id: number) => {
  // Verificar se o cliente possui vendas ativas
  const { data: sales } = await supabase
    .from('vendas')
    .select('id')
    .eq('clientId', id)
    .eq('status', 'ativa')
    .limit(1)

  if (sales && sales.length > 0) {
    throw new Error("Não é possível excluir um cliente com vendas ativas")
  }

  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
