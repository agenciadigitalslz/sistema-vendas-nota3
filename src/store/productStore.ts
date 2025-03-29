import { supabase } from '../lib/supabaseClient'
import { Product } from '@/types'

// Função para buscar todos os produtos
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

// Função para adicionar um produto
export const addProduct = async (name: string, quantity: number, value: number) => {
  const { data, error } = await supabase
    .from('produtos')
    .insert([{ name, quantity, value }])
    .select()

  if (error) throw error
  return data[0]
}

// Função para excluir um produto
export const deleteProduct = async (id: number) => {
  // Verificar se o produto possui vendas ativas
  const { data: sales } = await supabase
    .from('vendas')
    .select('id')
    .eq('productId', id)
    .eq('status', 'ativa')
    .limit(1)

  if (sales && sales.length > 0) {
    throw new Error("Não é possível excluir um produto com vendas ativas")
  }

  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// Função para atualizar o estoque de um produto
export const updateProductStock = async (id: number, quantityChange: number) => {
  // Primeiro precisamos buscar a quantidade atual
  const { data: product, error: fetchError } = await supabase
    .from('produtos')
    .select('quantity')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError
  
  const newQuantity = product.quantity + quantityChange
  
  // Verificar se a nova quantidade não será negativa
  if (newQuantity < 0) {
    throw new Error("Estoque insuficiente")
  }

  const { error } = await supabase
    .from('produtos')
    .update({ quantity: newQuantity })
    .eq('id', id)

  if (error) throw error
  return true
}

// Atualizar produto existente
export const updateProduct = async (id: number, name: string, quantity: number, value: number) => {
  const { error } = await supabase
    .from('produtos')
    .update({ name, quantity, value })
    .eq('id', id)

  if (error) throw error
  return true
}
