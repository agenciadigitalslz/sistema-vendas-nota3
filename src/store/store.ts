
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, Product, Sale, SaleStatus } from '@/types';

interface StoreState {
  clients: Client[];
  products: Product[];
  sales: Sale[];
  // Client actions
  addClient: (name: string) => void;
  deleteClient: (id: number) => void;
  // Product actions
  addProduct: (name: string, quantity: number, value: number) => void;
  deleteProduct: (id: number) => void;
  updateProductStock: (id: number, quantityChange: number) => void;
  // Sale actions
  createSale: (clientId: number, productId: number, quantity: number) => Sale;
  cancelSale: (id: number) => void;
  deleteSale: (id: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      clients: [],
      products: [],
      sales: [],

      // Client actions
      addClient: (name: string) => {
        const { clients } = get();
        const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
        
        set((state) => ({
          clients: [...state.clients, { id: newId, name }]
        }));
      },
      
      deleteClient: (id: number) => {
        const { sales } = get();
        // Check if client has any active sales (matching SQL ON DELETE RESTRICT)
        const hasActiveSales = sales.some(sale => sale.clientId === id && sale.status === 'ativa');
        
        if (hasActiveSales) {
          throw new Error("Cannot delete client with active sales");
        }
        
        set((state) => ({
          clients: state.clients.filter(client => client.id !== id)
        }));
      },

      // Product actions
      addProduct: (name: string, quantity: number, value: number) => {
        const { products } = get();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        set((state) => ({
          products: [...state.products, { id: newId, name, quantity, value }]
        }));
      },
      
      deleteProduct: (id: number) => {
        const { sales } = get();
        // Check if product has any active sales (matching SQL ON DELETE RESTRICT)
        const hasActiveSales = sales.some(sale => sale.productId === id && sale.status === 'ativa');
        
        if (hasActiveSales) {
          throw new Error("Cannot delete product with active sales");
        }
        
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        }));
      },
      
      updateProductStock: (id: number, quantityChange: number) => {
        set((state) => ({
          products: state.products.map(product => 
            product.id === id 
              ? { ...product, quantity: product.quantity + quantityChange } 
              : product
          )
        }));
      },

      // Sale actions
      createSale: (clientId: number, productId: number, quantity: number) => {
        const { sales, products, updateProductStock } = get();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
          throw new Error("Product not found");
        }
        
        if (product.quantity < quantity) {
          throw new Error("Insufficient stock");
        }
        
        const totalValue = quantity * product.value;
        const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
        const dateTime = new Date().toLocaleString();
        
        const newSale = {
          id: newId,
          clientId,
          productId,
          quantity,
          totalValue,
          dateTime,
          status: 'ativa' as SaleStatus
        };
        
        // Update the stock
        updateProductStock(productId, -quantity);
        
        set((state) => ({
          sales: [...state.sales, newSale]
        }));
        
        return newSale;
      },
      
      cancelSale: (id: number) => {
        const { sales, updateProductStock } = get();
        const sale = sales.find(s => s.id === id);
        
        if (!sale) {
          throw new Error("Sale not found");
        }
        
        if (sale.status === 'cancelada') {
          throw new Error("Sale already cancelled");
        }
        
        // Restore the product quantity
        updateProductStock(sale.productId, sale.quantity);
        
        set((state) => ({
          sales: state.sales.map(s => 
            s.id === id 
              ? { ...s, status: 'cancelada' as SaleStatus } 
              : s
          )
        }));
      },
      
      deleteSale: (id: number) => {
        const { sales, updateProductStock } = get();
        const sale = sales.find(s => s.id === id);
        
        if (sale && sale.status === 'ativa') {
          // Restore the product quantity
          updateProductStock(sale.productId, sale.quantity);
        }
        
        set((state) => ({
          sales: state.sales.filter(s => s.id !== id)
        }));
      }
    }),
    {
      name: 'sales-system-storage'
    }
  )
);
