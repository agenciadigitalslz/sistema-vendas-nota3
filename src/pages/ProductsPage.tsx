import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Trash, RefreshCw, Loader2 } from "lucide-react";
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
  const { products, detailedSales, addProduct, deleteProduct, isLoading, refreshData } = useStore();
  const { toast } = useToast();
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [newProductValue, setNewProductValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddProduct = async () => {
    // Validar inputs
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

    setIsAddingProduct(true);
    
    try {
      await addProduct(newProductName, quantity, value);
      
      // Resetar formulário
      setNewProductName("");
      setNewProductQuantity("");
      setNewProductValue("");
      
      toast({
        title: "Produto adicionado",
        description: `${newProductName} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar produto.",
      });
    } finally {
      setIsAddingProduct(false);
    }
  };

  const confirmDelete = (id: number) => {
    // Verificar se produto tem vendas ativas
    const productHasActiveSales = detailedSales.some(
      sale => sale.productId === id && sale.status === 'ativa'
    );
    
    if (productHasActiveSales) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Este produto possui vendas ativas e não pode ser excluído.",
      });
      return;
    }
    
    setSelectedProductId(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProductId) {
      setIsDeleting(true);
      
      try {
        await deleteProduct(selectedProductId);
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao excluir produto.",
        });
      } finally {
        setIsDeleting(false);
        setDialogOpen(false);
      }
    }
  };

  return (
    <div className="container py-6 animate-fade-in dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
        <Button 
          onClick={() => refreshData()} 
          className="flex gap-2 items-center bg-background border border-input hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Produto</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input
              id="productName"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nome do produto"
              className="dark:bg-slate-700 dark:border-slate-600"
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
              className="dark:bg-slate-700 dark:border-slate-600"
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
              className="dark:bg-slate-700 dark:border-slate-600"
            />
          </div>
        </div>
        <Button onClick={handleAddProduct} className="mt-4" disabled={isAddingProduct}>
          {isAddingProduct ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adicionando...
            </>
          ) : (
            'Adicionar Produto'
          )}
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Produtos Cadastrados</h2>
        <div className="text-sm text-muted-foreground">
          {products.length} {products.length === 1 ? 'produto' : 'produtos'}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Nenhum produto cadastrado
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
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
                  <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded">
                    <span className="text-gray-500 dark:text-gray-300">Estoque:</span>
                    <div className="font-semibold">{product.quantity} un</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-2 rounded">
                    <span className="text-gray-500 dark:text-gray-300">Preço:</span>
                    <div className="font-semibold">R$ {product.value.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
