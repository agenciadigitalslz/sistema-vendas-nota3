import { supabase } from '../lib/supabaseClient'
import { Client } from '@/types'
import { User, Trash, RefreshCw, Loader2, Pencil } from "lucide-react";


const testarInsertCliente = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .insert([{ name: 'Cliente Teste' }])
    .select()

  console.log('Resultado do insert:', { data, error })
  if (error) {
    alert(`Erro Supabase: ${error.message}\n\nDetalhes: ${error.details || 'n/a'}`)
  } else {
    alert('Cliente inserido com sucesso!')
  }
}


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

// Atualizar cliente existente
export const updateClient = async (id: number, name: string) => {
  const { error } = await supabase
    .from('clientes')
    .update({ name })
    .eq('id', id)

  if (error) throw error
  return true
}
