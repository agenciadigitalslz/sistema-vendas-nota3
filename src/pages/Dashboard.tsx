import { useStore } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, User, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { detailedSales, clients, products, isLoading, refreshData } = useStore();
  
  // Filtrar apenas vendas ativas para cálculo de receita
  const activeSales = detailedSales.filter(sale => sale.status === 'ativa');
  
  // Calcular receita total das vendas ativas
  const totalRevenue = activeSales.reduce((sum, sale) => sum + sale.totalValue, 0);
  
  // Obter dados das últimas 5 vendas para visualização
  const lastSales = detailedSales.slice(0, 5);

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <div className="container py-6 animate-fade-in dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={handleRefresh} 
          className="flex gap-2 items-center bg-background border border-input hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detailedSales.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Receita Total (Vendas Ativas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              R$ {totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-1 dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {lastSales.length > 0 ? (
              <div className="space-y-2">
                {lastSales.map(sale => (
                  <div 
                    key={sale.id}
                    className={`p-2 rounded border ${sale.status === 'ativa' ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950' : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate max-w-[150px]">{sale.productName}</span>
                      <span className="font-bold">R$ {sale.totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Venda #{sale.id}</span>
                      <span className={sale.status === 'ativa' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {sale.status === 'ativa' ? 'Ativa' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Nenhuma venda registrada
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
