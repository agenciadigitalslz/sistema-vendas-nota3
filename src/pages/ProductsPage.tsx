
import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Trash } from "lucide-react";
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

const ProductsPage = () => {
  const { products, sales, addProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [newProductValue, setNewProductValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleAddProduct = () => {
    // Validate inputs
    if (!newProductName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
      });
      return;
    }

    const quantity = Number(newProductQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A quantidade deve ser um número positivo.",
      });
      return;
    }

    const value = Number(newProductValue);
    if (isNaN(value) || value <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O valor deve ser um número positivo.",
      });
      return;
    }

    addProduct(newProductName, quantity, value);
    
    // Reset form
    setNewProductName("");
    setNewProductQuantity("");
    setNewProductValue("");
    
    toast({
      title: "Produto adicionado",
      description: `${newProductName} foi adicionado com sucesso.`,
    });
  };

  const confirmDelete = (id: number) => {
    // Check if product has sales
    const productHasSales = sales.some(sale => sale.productId === id);
    
    if (productHasSales) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Este produto possui vendas associadas e não pode ser excluído.",
      });
      return;
    }
    
    setSelectedProductId(id);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedProductId) {
      deleteProduct(selectedProductId);
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
    }
    setDialogOpen(false);
  };

  return (
    <div className="container py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Produtos</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Produto</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input
              id="productName"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nome do produto"
            />
          </div>
          <div>
            <Label htmlFor="productQuantity">Quantidade</Label>
            <Input
              id="productQuantity"
              type="number"
              min="1"
              value={newProductQuantity}
              onChange={(e) => setNewProductQuantity(e.target.value)}
              placeholder="Quantidade em estoque"
            />
          </div>
          <div>
            <Label htmlFor="productValue">Valor (R$)</Label>
            <Input
              id="productValue"
              type="number"
              min="0.01"
              step="0.01"
              value={newProductValue}
              onChange={(e) => setNewProductValue(e.target.value)}
              placeholder="Valor unitário"
            />
          </div>
        </div>
        <Button onClick={handleAddProduct} className="mt-4">Adicionar Produto</Button>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Produtos Cadastrados</h2>
      {products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nenhum produto cadastrado
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-sales-light flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-sales-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(product.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-500">Estoque:</span>
                    <div className="font-semibold">{product.quantity} un</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-500">Preço:</span>
                    <div className="font-semibold">R$ {product.value.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
