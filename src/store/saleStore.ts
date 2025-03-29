import { supabase } from '../lib/supabaseClient'
import { Sale, DetailedSale } from '@/types'
import { updateProductStock } from './productStore'

// Buscar todas as vendas (simples)
export const fetchSales = async () => {
  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

// Buscar vendas com detalhes (cliente + produto)
export const fetchDetailedSales = async () => {
  const { data: sales, error: salesError } = await supabase
    .from('vendas')
    .select('*')
    .order('id', { ascending: false })

  if (salesError) throw salesError

  const { data: clients, error: clientsError } = await supabase
    .from('clientes')
    .select('*')

  if (clientsError) throw clientsError

  const { data: products, error: productsError } = await supabase
    .from('produtos')
    .select('*')

  if (productsError) throw productsError

  const detailedSales: DetailedSale[] = sales.map(sale => {
    const client = clients.find(c => c.id === sale.clientId)
    const product = products.find(p => p.id === sale.productId)

    return {
      ...sale,
      clientName: client?.name || "Cliente não encontrado",
      productName: product?.name || "Produto não encontrado",
      productValue: product?.value || 0
    }
  })

  return detailedSales
}

// Criar nova venda
export const createSale = async (clientId: number, productId: number, quantity: number) => {
  const { data: product, error: productError } = await supabase
    .from('produtos')
    .select('quantity, value')
    .eq('id', productId)
    .single()

  if (productError) throw productError
  if (product.quantity < quantity) throw new Error("Estoque insuficiente")

  const totalValue = quantity * product.value
  
  // Garantir formato de data claro e em string ISO
  const now = new Date();
  const dateTime = now.toISOString();

  const { data, error } = await supabase
    .from('vendas')
    .insert([{
      clientId,
      productId,
      quantity,
      totalValue,
      dateTime,
      status: 'ativa'
    }])
    .select()

  if (error) throw error

  await updateProductStock(productId, -quantity)
  return data[0]
}

// Cancelar venda
export const cancelSale = async (id: number) => {
  const { data: sale, error: fetchError } = await supabase
    .from('vendas')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError
  if (sale.status === 'cancelada') throw new Error("Venda já está cancelada")

  const { error } = await supabase
    .from('vendas')
    .update({ status: 'cancelada' })
    .eq('id', id)

  if (error) throw error

  await updateProductStock(sale.productId, sale.quantity)
  return true
}

// Deletar venda permanentemente
export const deleteSale = async (id: number) => {
  const { error } = await supabase
    .from('vendas')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
