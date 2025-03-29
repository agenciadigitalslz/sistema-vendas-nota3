import { create } from 'zustand';
import { Client, Product, Sale, DetailedSale } from '@/types';
import { fetchClients, addClient as apiAddClient, deleteClient as apiDeleteClient, updateClient as apiUpdateClient } from './clientStore';
import { fetchProducts, addProduct as apiAddProduct, deleteProduct as apiDeleteProduct, updateProduct as apiUpdateProduct } from './productStore';
import { fetchSales, fetchDetailedSales, createSale as apiCreateSale, cancelSale as apiCancelSale, deleteSale as apiDeleteSale } from './saleStore';


interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface DataState {
  clients: Client[];
  products: Product[];
  detailedSales: DetailedSale[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  
  // Inicialização e carregamento
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Client actions
  addClient: (name: string) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  updateClient: (id: number, name: string) => Promise<void>;
  
  // Product actions
  addProduct: (name: string, quantity: number, value: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateProduct: (id: number, name: string, quantity: number, value: number) => Promise<void>;
  
  // Sale actions
  createSale: (clientId: number, productId: number, quantity: number) => Promise<DetailedSale>;
  cancelSale: (id: number) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
}

// Store para o tema
export const useThemeStore = create<ThemeState>()((set) => ({
  isDarkMode: localStorage.getItem('dark-mode') === 'true',
  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem('dark-mode', String(newMode));
      
      // Aplicar a classe no document para o Tailwind
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { isDarkMode: newMode };
    });
  },
}));

// Inicializar o tema no carregamento
if (typeof window !== 'undefined') {
  if (localStorage.getItem('dark-mode') === 'true') {
    document.documentElement.classList.add('dark');
  }
}

// Store para os dados
export const useStore = create<DataState>()((set, get) => ({
  clients: [],
  products: [],
  detailedSales: [],
  isLoading: false,
  error: null,
  initialized: false,

  // Inicializar dados do Supabase
  initialize: async () => {
    const { initialized } = get();
    if (initialized) return;
    
    await get().refreshData();
    set({ initialized: true });
  },

  // Atualizar todos os dados
  refreshData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const [clients, products, detailedSales] = await Promise.all([
        fetchClients(),
        fetchProducts(),
        fetchDetailedSales()
      ]);
      
      set({ 
        clients, 
        products, 
        detailedSales,
        isLoading: false 
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar dados', 
        isLoading: false 
      });
    }
  },

  // Client actions
  addClient: async (name: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const newClient = await apiAddClient(name);
      set(state => ({ 
        clients: [...state.clients, newClient],
        isLoading: false
      }));
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao adicionar cliente', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteClient: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiDeleteClient(id);
      set(state => ({ 
        clients: state.clients.filter(client => client.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao excluir cliente', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateClient: async (id: number, name: string) => {
    set({ isLoading: true, error: null });

    try {
      await apiUpdateClient(id, name);

      set(state => ({
        clients: state.clients.map(client =>
          client.id === id ? { ...client, name } : client
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar cliente',
        isLoading: false,
      });
      throw error;
    }
  },

  // Product actions
  addProduct: async (name: string, quantity: number, value: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const newProduct = await apiAddProduct(name, quantity, value);
      set(state => ({ 
        products: [...state.products, newProduct],
        isLoading: false
      }));
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao adicionar produto', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteProduct: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiDeleteProduct(id);
      set(state => ({ 
        products: state.products.filter(product => product.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao excluir produto', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateProduct: async (id: number, name: string, quantity: number, value: number) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiUpdateProduct(id, name, quantity, value);
      
      // Atualizar a lista de produtos
      set(state => ({ 
        products: state.products.map(product => 
          product.id === id 
            ? { ...product, name, quantity, value } 
            : product
        ),
        isLoading: false
      }));
      
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao atualizar produto', 
        isLoading: false 
      });
      throw error;
    }
  },

  // Sale actions
  createSale: async (clientId: number, productId: number, quantity: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const newSale = await apiCreateSale(clientId, productId, quantity);
      
      // Buscar dados atualizados após a venda (produtos e vendas)
      await get().refreshData();
      
      set({ isLoading: false });
      
      // Retornar os detalhes da venda para exibição
      const client = get().clients.find(c => c.id === clientId);
      const product = get().products.find(p => p.id === productId);
      
      const detailedSale: DetailedSale = {
        ...newSale,
        clientName: client?.name || "Cliente não encontrado",
        productName: product?.name || "Produto não encontrado",
        productValue: product?.value || 0
      };
      
      return detailedSale;
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao criar venda', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  cancelSale: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiCancelSale(id);
      
      // Atualizar dados após o cancelamento (produtos e vendas)
      await get().refreshData();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Erro ao cancelar venda:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao cancelar venda', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteSale: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiDeleteSale(id);
      
      // Atualizar dados após a exclusão (produtos e vendas)
      await get().refreshData();
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao excluir venda', 
        isLoading: false 
      });
      throw error;
    }
  }
}));
