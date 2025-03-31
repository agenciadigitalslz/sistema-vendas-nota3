import { useStore } from "@/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, Bar, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ShoppingCart, User, Package, RefreshCw, Clock, CheckCircle, XCircle, ArrowRight, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Obter dados da store
  const { 
    detailedSales: vendas, 
    clients: clientes, 
    products: produtos, 
    isLoading: loading, 
    refreshData 
  } = useStore();
  
  // Filtrar vendas por período - CORRIGIDO - usando campo dateTime de forma mais precisa
  const vendasHoje = useMemo(() => {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);
    
    return vendas.filter(venda => {
      // Pular vendas canceladas
      if (venda.status === "cancelada") return false;
      
      // Usar primariamente o campo dateTime da nossa interface Sale
      const dataVenda = new Date(venda.dateTime);
      
      // Verificar se é do dia atual
      return dataVenda >= inicioHoje && dataVenda <= fimHoje;
    });
  }, [vendas]);

  // Filtrar vendas do mês atual - CORRIGIDO
  const vendasMes = useMemo(() => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return vendas.filter(venda => {
      if (venda.status === "cancelada") return false;
      
      const dataVenda = new Date(venda.dateTime);
      
      return dataVenda >= inicioMes && dataVenda <= fimMes;
    });
  }, [vendas]);

  // Vendas ativas (não canceladas)
  const vendasAtivas = useMemo(() => 
    vendas.filter(venda => venda.status !== "cancelada"),
  [vendas]);
  
  // Calcular receitas - CORRIGIDO
  const receitaHoje = useMemo(() => 
    vendasHoje.reduce((total, venda) => 
      total + venda.totalValue, 0),
  [vendasHoje]);
  
  // Calcular receita do mês
  const receitaMes = useMemo(() => 
    vendasMes.reduce((total, venda) => 
      total + venda.totalValue, 0),
  [vendasMes]);
  
  const receitaTotal = useMemo(() => 
    vendasAtivas.reduce((total, venda) => 
      total + venda.totalValue, 0),
  [vendasAtivas]);

  // Função para obter nome do mês atual
  const nomeMesAtual = useMemo(() => {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR', { month: 'long' });
  }, []);

  // Função para obter cliente por ID - CORRIGIDO
  const buscarNomeCliente = useCallback((clienteId) => {
    if (!clienteId) return "Cliente não identificado";
    
    const cliente = clientes.find((c) => 
      c.id === clienteId || 
      c.id?.toString() === clienteId?.toString()
    );
    
    return cliente ? cliente.name : "Cliente não encontrado";
  }, [clientes]);
  
  // Função para obter produto por ID - CORRIGIDO
  const buscarNomeProduto = useCallback((produtoId) => {
    if (!produtoId) return "Produto não identificado";
    
    const produto = produtos.find((p) => 
      p.id === produtoId || 
      p.id?.toString() === produtoId?.toString()
    );
    
    return produto ? produto.name : "Produto não encontrado";
  }, [produtos]);

  // Dados para o gráfico e lista de últimas 5 vendas - CORRIGIDO
  const dadosUltimasVendas = useMemo(() => {
    if (!vendas || !vendas.length) return [];
    
    // Ordenar por data (mais recentes primeiro)
    const ordenadas = [...vendas].sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      
      return dateB - dateA;
    });
    
    // Pegar as 5 primeiras - com mais informações
    return ordenadas.slice(0, 5).map(venda => {
      return {
        id: venda.id,
        cliente_id: venda.clientId,
        produto_id: venda.productId,
        name: buscarNomeProduto(venda.productId),
        cliente: buscarNomeCliente(venda.clientId),
        value: venda.totalValue,
        quantidade: venda.quantity,
        data_hora: venda.dateTime,
        status: venda.status || "ativa"
      };
    });
  }, [vendas, buscarNomeCliente, buscarNomeProduto]);

  // Formatar data relativa - CORRIGIDO
  const formatarDataRelativa = (dataString) => {
    if (!dataString) return 'Data desconhecida';
    
    try {
      const data = new Date(dataString);
      const agora = new Date();
      
      // Verificar se a data é válida
      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }
      
      const diffMs = agora.getTime() - data.getTime();
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDias === 0) {
        return 'Hoje';
      } else if (diffDias === 1) {
        return 'Ontem';
      } else if (diffDias < 7) {
        return `${diffDias} dias atrás`;
      } else {
        return data.toLocaleDateString('pt-BR');
      }
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Formatar status de venda
  const obterStatusVenda = (status) => {
    switch(status) {
      case "ativa":
        return { 
          icon: <CheckCircle className="h-4 w-4 text-green-500" />, 
          texto: "Concluída", 
          cor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
        };
      case "cancelada":
        return { 
          icon: <XCircle className="h-4 w-4 text-red-500" />, 
          texto: "Cancelada", 
          cor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" 
        };
      default:
        return { 
          icon: <CheckCircle className="h-4 w-4 text-green-500" />, 
          texto: "Concluída", 
          cor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
        };
    }
  };

  // Atualizar dados
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
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total de Clientes</h3>
                <p className="text-4xl font-bold mt-1">{clientes.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900">
                <User className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total de Produtos</h3>
                <p className="text-4xl font-bold mt-1">{produtos.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full dark:bg-indigo-900">
                <Package className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total de Vendas</h3>
                <p className="text-4xl font-bold mt-1">{vendas.length}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full dark:bg-emerald-900">
                <ShoppingCart className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Coluna da esquerda: Cards de Receita */}
        <div className="space-y-4">
          {/* Card de Receita Hoje */}
          <Card className="shadow-md dark:bg-slate-800 dark:text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Receita Hoje</CardTitle>
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      R$ {receitaHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {vendasHoje.length} {vendasHoje.length === 1 ? 'venda' : 'vendas'} hoje - 
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* NOVO Card de Receita Mensal */}
          <Card className="shadow-md dark:bg-slate-800 dark:text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Receita de {nomeMesAtual}</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      R$ {receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {vendasMes.length} {vendasMes.length === 1 ? 'venda' : 'vendas'} em {nomeMesAtual}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card de Receita Total */}
          <Card className="shadow-md dark:bg-slate-800 dark:text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Receita Total</CardTitle>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total acumulado de vendas ativas
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna da direita: Gráfico de Últimas Vendas */}
        <Card className="dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : dadosUltimasVendas.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosUltimasVendas}>
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
                  <RechartsTooltip 
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
                    labelFormatter={(name) => `Produto: ${name}`}
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
      
      {/* Seção de Lista de Últimas Vendas - CORRIGIDA */}
      <div className="mt-4">
        <Card className="shadow-md dark:bg-slate-800 dark:text-white">
          <CardHeader>
            <CardTitle>Detalhes das Últimas Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))
            ) : dadosUltimasVendas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mb-2 opacity-30" />
                <p>Nenhuma venda encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cabeçalho da tabela */}
                <div className="grid grid-cols-4 gap-4 font-medium text-sm px-4 py-2 border-b">
                  <div>Cliente</div>
                  <div>Produto</div>
                  <div>Data</div>
                  <div className="text-right">Valor</div>
                </div>
                
                {/* Linhas de vendas - CORRIGIDAS */}
                {dadosUltimasVendas.map((venda) => {
                  const statusInfo = obterStatusVenda(venda.status);
                  
                  return (
                    <div 
                      key={venda.id} 
                      className="grid grid-cols-4 gap-4 items-center px-4 py-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {venda.cliente && venda.cliente.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {venda.cliente}
                        </span>
                      </div>
                      
                      <div className="text-sm truncate">
                        {venda.name}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({venda.quantidade} un.)
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {formatarDataRelativa(venda.data_hora)}
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">
                          R$ {venda.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="flex justify-end mt-1">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusInfo.cor}`}>
                            {statusInfo.icon}
                            <span>{statusInfo.texto}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <Button 
                  variant="ghost" 
                  className="w-full text-sm mt-2"
                  onClick={() => navigate('/sales')}
                >
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
