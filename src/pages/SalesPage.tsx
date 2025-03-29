
import { useState } from "react";
import { useStore } from "@/store/store";
import { DetailedSale } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { NewSaleForm } from "@/components/sales/NewSaleForm";
import { SalesList } from "@/components/sales/SalesList";
import { InvoiceDialog } from "@/components/sales/InvoiceDialog";
import { CancelSaleDialog } from "@/components/sales/CancelSaleDialog";

const SalesPage = () => {
  const { clients, products, sales, cancelSale } = useStore();
  const { toast } = useToast();
  
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [currentSale, setCurrentSale] = useState<DetailedSale | null>(null);

  const handleSaleCreated = (sale: DetailedSale) => {
    setCurrentSale(sale);
    setInvoiceOpen(true);
  };

  const confirmDelete = (id: number) => {
    setSelectedSaleId(id);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedSaleId) {
      try {
        cancelSale(selectedSaleId);
        
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
      }
    }
    setDialogOpen(false);
  };

  const showInvoice = (sale: DetailedSale) => {
    setCurrentSale(sale);
    setInvoiceOpen(true);
  };

  const detailedSales = sales.map(sale => {
    const client = clients.find(c => c.id === sale.clientId);
    const product = products.find(p => p.id === sale.productId);
    
    return {
      ...sale,
      clientName: client?.name || "Cliente não encontrado",
      productName: product?.name || "Produto não encontrado",
      productValue: product?.value || 0
    };
  }).sort((a, b) => b.id - a.id);

  const totalRevenue = detailedSales
    .filter(sale => sale.status === 'ativa')
    .reduce((sum, sale) => sum + sale.totalValue, 0);

  return (
    <div className="container py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Vendas</h1>
      
      <NewSaleForm onSaleCreated={handleSaleCreated} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Histórico de Vendas</h2>
        <div className="text-lg font-semibold text-sales-primary">
          Total Ativo: R$ {totalRevenue.toFixed(2)}
        </div>
      </div>
      
      <SalesList 
        sales={detailedSales} 
        onShowInvoice={showInvoice} 
        onConfirmDelete={confirmDelete} 
      />
      
      <CancelSaleDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onConfirm={handleDelete} 
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
