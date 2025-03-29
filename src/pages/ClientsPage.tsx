
import { useState } from "react";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Trash } from "lucide-react";
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

const ClientsPage = () => {
  const { clients, sales, addClient, deleteClient } = useStore();
  const { toast } = useToast();
  const [newClientName, setNewClientName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const handleAddClient = () => {
    if (!newClientName.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome do cliente não pode estar vazio.",
      });
      return;
    }

    addClient(newClientName);
    setNewClientName("");
    toast({
      title: "Cliente adicionado",
      description: `${newClientName} foi adicionado com sucesso.`,
    });
  };

  const confirmDelete = (id: number) => {
    // Check if client has sales
    const clientHasSales = sales.some(sale => sale.clientId === id);
    
    if (clientHasSales) {
      toast({
        variant: "destructive",
        title: "Não é possível excluir",
        description: "Este cliente possui vendas associadas e não pode ser excluído.",
      });
      return;
    }
    
    setSelectedClientId(id);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedClientId) {
      deleteClient(selectedClientId);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
    }
    setDialogOpen(false);
  };

  return (
    <div className="container py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Clientes</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Cliente</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Nome do cliente"
            />
          </div>
          <Button onClick={handleAddClient}>Adicionar</Button>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Clientes Cadastrados</h2>
      {clients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nenhum cliente cadastrado
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="h-10 w-10 rounded-full bg-sales-light flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-sales-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => confirmDelete(client.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
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
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
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

export default ClientsPage;
