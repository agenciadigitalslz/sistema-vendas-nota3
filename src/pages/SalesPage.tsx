
import { useState } from "react";
import { useStore } from "@/store/store";
import { DetailedSale } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalesPage = () => {
  const { clients, products, sales, createSale, deleteSale } = useStore();
  const { toast } = useToast();
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<DetailedSale | null>(null);

  const handleCreateSale = () => {
    // Validate inputs
    if (!clientId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um cliente.",
      });
      return;
    }

    if (!productId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um produto.",
      });
      return;
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A quantidade deve ser um número positivo.",
      });
      return;
    }

    // Check if product has enough stock
    const product = products.find(p => p.id === Number(productId));
    if (!product || product.quantity < qty) {
      toast({
        variant: "destructive",
        title: "Estoque insuficiente",
        description: `Estoque disponível: ${product?.quantity || 0} unidades.`,
      });
      return;
    }

    try {
      const sale = createSale(Number(clientId), Number(productId), qty);
      
      // Create detailed sale for invoice
      const client = clients.find(c => c.id === Number(clientId))!;
      const detailedSale: DetailedSale = {
        ...sale,
        clientName: client.name,
        productName: product.name,
        productValue: product.value
      };
      
      setCurrentSale(detailedSale);
      
      // Reset form
      setClientId("");
      setProductId("");
      setQuantity("");
      
      toast({
        title: "Venda realizada",
        description: `Venda #${sale.id} registrada com sucesso.`,
      });
      
      // Show invoice
      setInvoiceOpen(true);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível realizar a venda.",
      });
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedSaleId(id);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedSaleId) {
      deleteSale(selectedSaleId);
      toast({
        title: "Venda cancelada",
        description: "A venda foi cancelada com sucesso.",
      });
    }
    setDialogOpen(false);
  };

  const showInvoice = (sale: Sale) => {
    const client = clients.find(c => c.id === sale.clientId)!;
    const product = products.find(p => p.id === sale.productId)!;
    
    const detailedSale: DetailedSale = {
      ...sale,
      clientName: client.name,
      productName: product.name,
      productValue: product.value
    };
    
    setCurrentSale(detailedSale);
    setInvoiceOpen(true);
  };

  // Create detailed sales for display
  const detailedSales = sales.map(sale => {
    const client = clients.find(c => c.id === sale.clientId);
    const product = products.find(p => p.id === sale.productId);
    
    return {
      ...sale,
      clientName: client?.name || "Cliente não encontrado",
      productName: product?.name || "Produto não encontrado",
      productValue: product?.value || 0
    };
  }).sort((a, b) => b.id - a.id); // Most recent first

  // Calculate total revenue
  const totalRevenue = detailedSales.reduce((sum, sale) => sum + sale.totalValue, 0);

  return (
    <div className="container py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Vendas</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Registrar Nova Venda</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="clientSelect">Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="clientSelect">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="productSelect">Produto</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger id="productSelect">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter(product => product.quantity > 0)
                  .map(product => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} (Estoque: {product.quantity})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantidade"
            />
          </div>
        </div>
        <Button onClick={handleCreateSale} className="mt-4">Registrar Venda</Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Histórico de Vendas</h2>
        <div className="text-lg font-semibold text-sales-primary">
          Total: R$ {totalRevenue.toFixed(2)}
        </div>
      </div>
      
      {detailedSales.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nenhuma venda registrada
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{sale.dateTime}</TableCell>
                    <TableCell>{sale.clientName}</TableCell>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>R$ {sale.totalValue.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => showInvoice(sale)}
                        >
                          <FileText className="h-4 w-4 text-sales-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(sale.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta venda? O estoque será restaurado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Sim, cancelar venda</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Invoice Dialog */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">NOTA FISCAL</DialogTitle>
          </DialogHeader>
          {currentSale && (
            <div className="border p-4 rounded-lg">
              <div className="text-center mb-4 border-b pb-2">
                <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-sales-primary" />
                <p className="text-sm">Data/Hora: {currentSale.dateTime}</p>
                <p className="font-semibold">Venda #{currentSale.id}</p>
              </div>
              
              <div className="mb-4">
                <p><span className="font-semibold">Cliente:</span> {currentSale.clientName}</p>
              </div>
              
              <div className="border-t border-b py-2 my-4">
                <div className="flex justify-between mb-1">
                  <span>Produto:</span>
                  <span>{currentSale.productName}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Quantidade:</span>
                  <span>{currentSale.quantity}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Valor unitário:</span>
                  <span>R$ {currentSale.productValue.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>R$ {currentSale.totalValue.toFixed(2)}</span>
              </div>
              
              <div className="text-center mt-6 text-sm text-gray-500">
                Obrigado pela sua compra!
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPage;
