
import { useStore } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, User, Package } from "lucide-react";

const Dashboard = () => {
  const { clients, products, sales } = useStore();
  
  // Calculate total revenue
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
  
  // Get sales data for chart
  const salesData = sales.slice(-5).map(sale => {
    const product = products.find(p => p.id === sale.productId);
    return {
      id: sale.id,
      name: product?.name || 'Unknown',
      value: sale.totalValue
    };
  });

  return (
    <div className="container py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <User className="h-4 w-4 text-sales-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-sales-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-sales-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sales.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-sales-primary">
              R$ {totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
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
