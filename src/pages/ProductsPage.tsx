
import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Package, Trash, RefreshCw, Loader2, Pencil } from "lucide-react";
import { Product } from "@/types";
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
  const { products, detailedSales, addProduct, deleteProduct, isLoading, refreshData, updateProduct } = useStore();
  const { toast } = useToast();
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [newProductValue, setNewProductValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditQuantity(product.quantity.toString());
    setEditValue(product.value.toFixed(2));
    setEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    // Validar inputs
    if (!editName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do produto não pode estar vazio.",
      });
      return;
    }

    const quantity = Number(editQuantity);
    if (isNaN(quantity) || quantity < 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A quantidade deve ser um número não negativo.",
      });
      return;
    }

    const value = Number(editValue);
    if (isNaN(value) || value <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O valor deve ser um número positivo.",
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      await updateProduct(editingProduct.id, editName, quantity, value);
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar produto.",
      });
    } finally {
      setIsUpdating(false);
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
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6 border-t-4 border-indigo-500 hover:shadow-lg transition-all">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Package className="mr-2 h-5 w-5 text-indigo-500" />
          Adicionar Novo Produto
        </h2>
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
        <Button onClick={handleAddProduct} className="mt-4 bg-indigo-500 hover:bg-indigo-600" disabled={isAddingProduct}>
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
        <h2 className="text-xl font-semibold flex items-center">
          <Package className="mr-2 h-5 w-5 text-indigo-500" />
          Produtos Cadastrados
        </h2>
        <div className="text-sm text-muted-foreground bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full font-medium">
          {products.length} {products.length === 1 ? 'produto' : 'produtos'}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Nenhum produto cadastrado
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="dark:bg-slate-800 dark:border-slate-700 border-t-4 border-indigo-500 hover:shadow-lg transition-all">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center h-10 w-10 gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30"
                      onClick={() => startEdit(product)}
                    >
                      <Pencil className="h-4 w-4 text-indigo-600" />
                    </Button>
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center h-10 w-10 gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                      onClick={() => confirmDelete(product.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                    <span className="text-gray-500 dark:text-gray-300">Estoque:</span>
                    <div className="font-semibold">{product.quantity} un</div>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
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
      
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar Produto</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              Altere os dados do produto e clique em salvar para atualizar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Nome do Produto</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="editQuantity">Quantidade em Estoque</Label>
              <Input
                id="editQuantity"
                type="number"
                min="0"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                className="dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="editValue">Valor (R$)</Label>
              <Input
                id="editValue"
                type="number"
                min="0.01"
                step="0.01"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600" disabled={isUpdating}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateProduct}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
