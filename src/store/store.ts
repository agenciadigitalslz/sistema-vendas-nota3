
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, Product, Sale } from '@/types';

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
        
        const totalValue = quantity * product.value;
        const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
        const dateTime = new Date().toLocaleString();
        
        const newSale = {
          id: newId,
          clientId,
          productId,
          quantity,
          totalValue,
          dateTime
        };
        
        // Update the stock
        updateProductStock(productId, -quantity);
        
        set((state) => ({
          sales: [...state.sales, newSale]
        }));
        
        return newSale;
      },
      
      deleteSale: (id: number) => {
        const { sales, updateProductStock } = get();
        const sale = sales.find(s => s.id === id);
        
        if (sale) {
          // Restore the product quantity
          updateProductStock(sale.productId, sale.quantity);
          
          set((state) => ({
            sales: state.sales.filter(s => s.id !== id)
          }));
        }
      }
    }),
    {
      name: 'sales-system-storage'
    }
  )
);
