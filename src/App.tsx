
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStore, useThemeStore } from "./store/store";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import NotFound from "./pages/NotFound";
import { ThemeToggle } from "./components/ThemeToggle";

const queryClient = new QueryClient();

// Componente interno para renderização condicional móvel/desktop
const AppLayout = () => {
  const isMobile = useIsMobile();
  const { initialize, isLoading, error } = useStore();
  
  useEffect(() => {
    // Inicializar dados ao carregar a aplicação
    initialize();
  }, [initialize]);

  // Exibir indicador de carregamento durante a inicialização
  if (isLoading && !isMobile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // Exibir mensagem de erro, se houver
  if (error && !isMobile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="bg-destructive/10 p-6 rounded-lg text-center max-w-md">
          <p className="text-destructive font-semibold mb-2">Erro ao carregar o sistema</p>
          <p className="text-muted-foreground">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => initialize()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full dark:bg-slate-900 transition-colors">
        {/* Em dispositivos não-móveis, mostra a barra lateral */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        {/* Botão de alternar tema - REPOSICIONADO para a lateral direita da tela */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
          <ThemeToggle />
        </div>
        
        {/* Conteúdo principal com padding para evitar que o conteúdo fique embaixo do menu móvel */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 dark:bg-slate-900 transition-colors">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Em dispositivos móveis, mostra o menu na parte inferior */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
