
import { supabase } from '../lib/supabaseClient'
import { Sale, DetailedSale } from '@/types'
import { updateProductStock } from './productStore'

// Função para buscar todas as vendas
export const fetchSales = async () => {
  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

// Função para buscar detalhes de vendas (incluindo informações de cliente e produto)
export const fetchDetailedSales = async () => {
  const { data: sales, error: salesError } = await supabase
    .from('vendas')
    .select('*')
    .order('id', { ascending: false })

  if (salesError) throw salesError

  // Buscar clientes e produtos para enriquecer os dados
  const { data: clients, error: clientsError } = await supabase
    .from('clientes')
    .select('*')

  if (clientsError) throw clientsError

  const { data: products, error: productsError } = await supabase
    .from('produtos')
    .select('*')

  if (productsError) throw productsError

  // Criar vendas detalhadas combinando os dados
  const detailedSales: DetailedSale[] = sales.map(sale => {
    const client = clients.find(c => c.id === sale.clientId);
    const product = products.find(p => p.id === sale.productId);
    
    return {
      ...sale,
      clientName: client?.name || "Cliente não encontrado",
      productName: product?.name || "Produto não encontrado",
      productValue: product?.value || 0
    };
  });

  return detailedSales;
}

// Função para criar uma nova venda
export const createSale = async (clientId: number, productId: number, quantity: number) => {
  // Verificar se há estoque suficiente
  const { data: product, error: productError } = await supabase
    .from('produtos')
    .select('quantity, value')
    .eq('id', productId)
    .single()

  if (productError) throw productError

  if (product.quantity < quantity) {
    throw new Error("Estoque insuficiente")
  }

  const totalValue = quantity * product.value

  // Criar a venda
  const { data, error } = await supabase
    .from('vendas')
    .insert([{
      clientId,
      productId,
      quantity,
      totalValue,
      status: 'ativa'
    }])
    .select()

  if (error) throw error

  // Atualizar o estoque
  await updateProductStock(productId, -quantity)

  return data[0]
}

// Função para cancelar uma venda
export const cancelSale = async (id: number) => {
  // Buscar dados da venda
  const { data: sale, error: fetchError } = await supabase
    .from('vendas')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  if (sale.status === 'cancelada') {
    throw new Error("Venda já está cancelada")
  }

  // Cancelar a venda
  const { error } = await supabase
    .from('vendas')
    .update({ status: 'cancelada' })
    .eq('id', id)

  if (error) throw error

  // Restaurar o estoque
  await updateProductStock(sale.productId, sale.quantity)

  return true
}
