import { useStore } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ShoppingCart, User, Package, RefreshCw, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useVendasStore } from '@/store/vendasStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Avatar, AvatarFallback, RadioGroup, RadioGroupItem, Label } from '@/components/ui';

// Função auxiliar para gerar dados do gráfico baseado no período
const obterDadosGraficoReceita = (vendas, periodo) => {
  const agora = new Date();
  const resultado = [];
  
  // Configurar intervalo baseado no período.
  let intervalo, pontos, formatoData;
  switch(periodo) {
    case "hoje":
      intervalo = 3600000; // 1 hora em ms
      pontos = 12;
      formatoData = (data) => `${data.getHours()}:00`;
      break;
    case "semana":
      intervalo = 86400000; // 1 dia em ms
      pontos = 7;
      formatoData = (data) => data.toLocaleDateString('pt-BR', { weekday: 'short' });
      break;
    case "mes":
      intervalo = 86400000 * 3; // 3 dias em ms
      pontos = 10;
      formatoData = (data) => `${data.getDate()}/${data.getMonth() + 1}`;
      break;
    case "ano":
      intervalo = 86400000 * 30; // ~1 mês em ms
      pontos = 12;
      formatoData = (data) => data.toLocaleDateString('pt-BR', { month: 'short' });
      break;
    default:
      intervalo = 86400000 * 30; // ~1 mês em ms
      pontos = 6;
      formatoData = (data) => `${data.getMonth() + 1}/${data.getFullYear()}`;
  }
  
  // Gerar pontos no gráfico
  for (let i = pontos - 1; i >= 0; i--) {
    const dataInicio = new Date(agora - (intervalo * (i + 1)));
    const dataFim = new Date(agora - (intervalo * i));
    
    // Filtrar vendas do período
    const vendasPeriodo = vendas.filter(venda => {
      if (venda.status === "cancelada") return false;
      const dataVenda = new Date(venda.data_hora);
      return dataVenda >= dataInicio && dataVenda < dataFim;
    });
    
    // Calcular valor total
    const valorTotal = vendasPeriodo.reduce((total, venda) => total + (venda.valor_total || 0), 0);
    
    resultado.push({
      data: formatoData(dataInicio),
      valor: valorTotal
    });
  }
  
  return resultado;
};

const Dashboard = () => {
  const { detailedSales, clients, products, isLoading, refreshData } = useStore();
  const { vendas, loading, produtos, clientes } = useVendasStore();
  const [periodoSelecionado, setPeriodoSelecionado] = useState("hoje");
  const [comparacaoAnterior, setComparacaoAnterior] = useState(0);
  const [filtro, setFiltro] = useState("todas");
  
  // Filtrar apenas vendas ativas para cálculo de receita
  const activeSales = detailedSales.filter(sale => sale.status === 'ativa');
  
  // Calcular receita total das vendas ativas
  const totalRevenue = activeSales.reduce((sum, sale) => sum + sale.totalValue, 0);
  
  // Obter dados das últimas 5 vendas para o gráfico
  const salesData = detailedSales.slice(0, 5).map(sale => {
    return {
      id: sale.id,
      name: sale.productName,
      value: sale.totalValue,
      status: sale.status
    };
  });

  const handleRefresh = () => {
    refreshData();
  };

  // Calcular receita total filtrada por período
  const calcularReceita = useCallback(() => {
    if (!vendas.length) return 0;
    
    const agora = new Date();
    const filtradas = vendas.filter(venda => {
      if (venda.status === "cancelada") return false;
      
      const dataVenda = new Date(venda.data_hora);
      switch(periodoSelecionado) {
        case "hoje":
          return dataVenda.toDateString() === agora.toDateString();
        case "semana":
          const umaSemanaAtras = new Date(agora);
          umaSemanaAtras.setDate(agora.getDate() - 7);
          return dataVenda >= umaSemanaAtras;
        case "mes":
          return dataVenda.getMonth() === agora.getMonth() 
            && dataVenda.getFullYear() === agora.getFullYear();
        case "ano":
          return dataVenda.getFullYear() === agora.getFullYear();
        default:
          return true;
      }
    });
    
    return filtradas.reduce((total, venda) => total + (venda.valor_total || 0), 0);
  }, [vendas, periodoSelecionado]);
  
  // Calcular comparação com período anterior
  useEffect(() => {
    const calcularComparacao = () => {
      const agora = new Date();
      const periodoAnterior = vendas.filter(venda => {
        if (venda.status === "cancelada") return false;
        
        const dataVenda = new Date(venda.data_hora);
        switch(periodoSelecionado) {
          case "hoje":
            const ontem = new Date(agora);
            ontem.setDate(agora.getDate() - 1);
            return dataVenda.toDateString() === ontem.toDateString();
          case "semana":
            const duasSemanasAtras = new Date(agora);
            duasSemanasAtras.setDate(agora.getDate() - 14);
            const umaSemanaAtras = new Date(agora);
            umaSemanaAtras.setDate(agora.getDate() - 7);
            return dataVenda >= duasSemanasAtras && dataVenda < umaSemanaAtras;
          case "mes":
            const mesAnterior = new Date(agora);
            mesAnterior.setMonth(agora.getMonth() - 1);
            return dataVenda.getMonth() === mesAnterior.getMonth() 
              && dataVenda.getFullYear() === mesAnterior.getFullYear();
          case "ano":
            return dataVenda.getFullYear() === agora.getFullYear() - 1;
          default:
            return false;
        }
      });
      
      const valorAnterior = periodoAnterior.reduce((total, venda) => total + (venda.valor_total || 0), 0);
      const valorAtual = calcularReceita();
      
      if (valorAnterior === 0) return 100; // Se não havia vendas no período anterior
      
      return Math.round(((valorAtual - valorAnterior) / valorAnterior) * 100);
    };
    
    setComparacaoAnterior(calcularComparacao());
  }, [vendas, periodoSelecionado, calcularReceita]);
  
  const receitaTotal = calcularReceita();

  // Função para obter cliente e produto por ID
  const buscarNomeCliente = useCallback((clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente ? cliente.nome : "Cliente não encontrado";
  }, [clientes]);
  
  const buscarNomeProduto = useCallback((produtoId) => {
    const produto = produtos.find((p) => p.id === produtoId);
    return produto ? produto.nome : "Produto não encontrado";
  }, [produtos]);
  
  // Filtrar e ordenar vendas
  const vendasFiltradas = useMemo(() => {
    let resultado = [...vendas];
    
    // Aplicar filtro por status
    if (filtro !== "todas") {
      resultado = resultado.filter(venda => venda.status === filtro);
    }
    
    // Ordenar por data (mais recentes primeiro)
    resultado.sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
    
    // Limitar a 5 vendas
    return resultado.slice(0, 5);
  }, [vendas, filtro]);
  
  // Exibir status formatado com ícone
  const StatusVenda = ({ status }) => {
    const statusConfig = {
      "pendente": { icon: <Clock className="h-4 w-4 text-yellow-500" />, texto: "Pendente", cor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      "completa": { icon: <CheckCircle className="h-4 w-4 text-green-500" />, texto: "Concluída", cor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      "cancelada": { icon: <XCircle className="h-4 w-4 text-red-500" />, texto: "Cancelada", cor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }
    };
    
    const config = statusConfig[status] || statusConfig.pendente;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.cor}`}>
        {config.icon}
        <span>{config.texto}</span>
      </div>
    );
  };
  
  // Formatar data de forma amigável
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diffMs = agora - data;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else if (diffMins > 0) {
      return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora mesmo';
    }
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
          <CardContent className="h-80">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    className="fill-blue-500 dark:fill-blue-400"
                  />
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
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">
                    R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    comparacaoAnterior > 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {comparacaoAnterior > 0 ? '+' : ''}{comparacaoAnterior}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Comparado ao período anterior
                </p>
                
                {/* Mini gráfico de tendência */}
                <div className="mt-4 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={obterDadosGraficoReceita(vendas, periodoSelecionado)} 
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <defs>
                        <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#receita)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-1 dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))
            ) : vendasFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
                <p>Nenhuma venda encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendasFiltradas.map((venda) => (
                  <div 
                    key={venda.id} 
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex gap-3 items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {buscarNomeCliente(venda.cliente_id).substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{buscarNomeCliente(venda.cliente_id)}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{buscarNomeProduto(venda.produto_id)}</span>
                          <span>•</span>
                          <span>{venda.quantidade} un.</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-semibold">
                        R$ {venda.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusVenda status={venda.status} />
                        <Tooltip content={new Date(venda.data_hora).toLocaleString('pt-BR')}>
                          <span className="text-xs text-muted-foreground">{formatarData(venda.data_hora)}</span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full text-sm mt-2">
                  Ver todas as vendas
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
