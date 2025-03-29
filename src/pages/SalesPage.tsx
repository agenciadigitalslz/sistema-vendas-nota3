
import { useState } from "react";
import { useStore } from "@/store/store";
import { DetailedSale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { NewSaleForm } from "@/components/sales/NewSaleForm";
import { SalesList } from "@/components/sales/SalesList";
import { InvoiceDialog } from "@/components/sales/InvoiceDialog";
import { CancelSaleDialog } from "@/components/sales/CancelSaleDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const SalesPage = () => {
  const { detailedSales, cancelSale, isLoading, refreshData } = useStore();
  const { toast } = useToast();
  
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [currentSale, setCurrentSale] = useState<DetailedSale | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleSaleCreated = (sale: DetailedSale) => {
    setCurrentSale(sale);
    setInvoiceOpen(true);
  };

  const confirmDelete = (id: number) => {
    setSelectedSaleId(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedSaleId) {
      setIsCancelling(true);
      
      try {
        await cancelSale(selectedSaleId);
        
        toast({
          title: "Venda cancelada",
          description: "A venda foi cancelada com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao cancelar venda.",
        });
      } finally {
        setIsCancelling(false);
        setDialogOpen(false);
      }
    }
  };

  const showInvoice = (sale: DetailedSale) => {
    setCurrentSale(sale);
    setInvoiceOpen(true);
  };

  // Calcular receita ativa total
  const totalRevenue = detailedSales
    .filter(sale => sale.status === 'ativa')
    .reduce((sum, sale) => sum + sale.totalValue, 0);

  return (
    <div className="container py-6 animate-fade-in dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Vendas</h1>
        <Button 
          onClick={() => refreshData()} 
          variant="outline" 
          size="sm"
          className="flex gap-2 items-center"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <NewSaleForm onSaleCreated={handleSaleCreated} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Histórico de Vendas</h2>
        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          Total Ativo: R$ {totalRevenue.toFixed(2)}
        </div>
      </div>
      
      <SalesList 
        sales={detailedSales} 
        onShowInvoice={showInvoice} 
        onConfirmDelete={confirmDelete} 
        isLoading={isLoading}
      />
      
      <CancelSaleDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onConfirm={handleDelete}
        isCancelling={isCancelling}
      />
      
      <InvoiceDialog 
        open={invoiceOpen} 
        onOpenChange={setInvoiceOpen} 
        sale={currentSale} 
      />
    </div>
  );
};

export default SalesPage;
