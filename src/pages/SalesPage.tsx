import { useState } from "react";
import { useStore } from "@/store/store";
import { DetailedSale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { NewSaleForm } from "@/components/sales/NewSaleForm";
import { SalesList } from "@/components/sales/SalesList";
import { InvoiceDialog } from "@/components/sales/InvoiceDialog";
import { CancelSaleDialog } from "@/components/sales/CancelSaleDialog";
import { DeleteSaleDialog } from "@/components/sales/DeleteSaleDialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart } from "lucide-react";

const SalesPage = () => {
  const { detailedSales, cancelSale, deleteSale, isLoading, refreshData } = useStore();
  const { toast } = useToast();
  
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [currentSale, setCurrentSale] = useState<DetailedSale | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaleCreated = (sale: DetailedSale) => {
    setCurrentSale(sale);
    setInvoiceOpen(true);
  };

  const confirmCancel = (id: number) => {
    setSelectedSaleId(id);
    setCancelDialogOpen(true);
  };

  const confirmDeletePermanent = (id: number) => {
    setSelectedSaleId(id);
    setDeleteDialogOpen(true);
  };

  const handleCancel = async () => {
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
        setCancelDialogOpen(false);
      }
    }
  };

  const handleDeletePermanent = async () => {
    if (selectedSaleId) {
      setIsDeleting(true);
      
      try {
        await deleteSale(selectedSaleId);
        
        toast({
          title: "Venda excluída",
          description: "A venda foi excluída permanentemente com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao excluir venda.",
        });
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
      }
    }
  };

  const showInvoice = (sale: DetailedSale) => {
    setCurrentSale(sale);
    setInvoiceOpen(true);
  };

  const totalRevenue = detailedSales
    .filter(sale => sale.status === 'ativa')
    .reduce((sum, sale) => sum + sale.totalValue, 0);

  return (
    <div className="container py-6 animate-fade-in dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Vendas</h1>
        <Button 
          onClick={() => refreshData()} 
          className="flex gap-2 items-center bg-background border border-input hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6 border-t-4 border-green-500 hover:shadow-lg transition-all">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5 text-green-500" />
          Nova Venda
        </h2>
        <NewSaleForm onSaleCreated={handleSaleCreated} />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5 text-green-500" />
          Histórico de Vendas
        </h2>
        <div className="text-lg font-semibold bg-green-100 dark:bg-green-900/30 px-4 py-1 rounded-full text-green-600 dark:text-green-400">
          Total Ativo: R$ {totalRevenue.toFixed(2)}
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border-t-4 border-green-500">
        <SalesList 
          sales={detailedSales} 
          onShowInvoice={showInvoice} 
          onConfirmDelete={confirmCancel} 
          onConfirmDeletePermanent={confirmDeletePermanent}
          isLoading={isLoading}
        />
      </div>
      
      <CancelSaleDialog 
        open={cancelDialogOpen} 
        onOpenChange={setCancelDialogOpen} 
        onConfirm={handleCancel}
        isCancelling={isCancelling}
      />
      
      <DeleteSaleDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onConfirm={handleDeletePermanent}
        isDeleting={isDeleting}
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
