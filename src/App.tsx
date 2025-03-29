
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileMenu } from "@/components/MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente interno para renderização condicional móvel/desktop
const AppLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Em dispositivos não-móveis, mostra a barra lateral */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        {/* Conteúdo principal com padding para evitar que o conteúdo fique embaixo do menu móvel */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
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
