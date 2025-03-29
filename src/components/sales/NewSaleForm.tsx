
import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DetailedSale } from "@/types";
import { Loader2 } from "lucide-react";

interface NewSaleFormProps {
  onSaleCreated: (sale: DetailedSale) => void;
}

export function NewSaleForm({ onSaleCreated }: NewSaleFormProps) {
  const { clients, products, createSale, isLoading } = useStore();
  const { toast } = useToast();
  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isCreatingSale, setIsCreatingSale] = useState(false);

  const handleCreateSale = async () => {
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

    const product = products.find(p => p.id === Number(productId));
    if (!product || product.quantity < qty) {
      toast({
        variant: "destructive",
        title: "Estoque insuficiente",
        description: `Estoque disponível: ${product?.quantity || 0} unidades.`,
      });
      return;
    }

    setIsCreatingSale(true);
    
    try {
      const sale = await createSale(Number(clientId), Number(productId), qty);
      
      onSaleCreated(sale);
      
      setClientId("");
      setProductId("");
      setQuantity("");
      
      toast({
        title: "Venda realizada",
        description: `Venda #${sale.id} registrada com sucesso.`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível realizar a venda.",
      });
    } finally {
      setIsCreatingSale(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4">Registrar Nova Venda</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="clientSelect">Cliente</Label>
          <Select value={clientId} onValueChange={setClientId} disabled={isLoading || isCreatingSale}>
            <SelectTrigger id="clientSelect" className="dark:bg-slate-700 dark:border-slate-600">
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id.toString()} className="dark:text-white">
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="productSelect">Produto</Label>
          <Select value={productId} onValueChange={setProductId} disabled={isLoading || isCreatingSale}>
            <SelectTrigger id="productSelect" className="dark:bg-slate-700 dark:border-slate-600">
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
              {products
                .filter(product => product.quantity > 0)
                .map(product => (
                  <SelectItem key={product.id} value={product.id.toString()} className="dark:text-white">
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
            className="dark:bg-slate-700 dark:border-slate-600"
            disabled={isLoading || isCreatingSale}
          />
        </div>
      </div>
      <Button 
        onClick={handleCreateSale} 
        className="mt-4"
        disabled={isLoading || isCreatingSale}
      >
        {isCreatingSale ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          'Registrar Venda'
        )}
      </Button>
    </div>
  );
}
