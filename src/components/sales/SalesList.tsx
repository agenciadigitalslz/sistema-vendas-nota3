
import { DetailedSale } from "@/types";
import { useStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SalesListProps {
  sales: DetailedSale[];
  onShowInvoice: (sale: DetailedSale) => void;
  onConfirmDelete: (id: number) => void;
}

export function SalesList({ sales, onShowInvoice, onConfirmDelete }: SalesListProps) {
  if (sales.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhuma venda registrada
      </div>
    );
  }

  return (
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
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className={sale.status === 'cancelada' ? "opacity-75" : ""}>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{sale.dateTime}</TableCell>
                <TableCell>{sale.clientName}</TableCell>
                <TableCell>{sale.productName}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>R$ {sale.totalValue.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={sale.status === 'ativa' ? "default" : "destructive"}
                  >
                    {sale.status === 'ativa' ? 'Ativa' : 'Cancelada'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShowInvoice(sale)}
                    >
                      <FileText className="h-4 w-4 text-sales-primary" />
                    </Button>
                    {sale.status === 'ativa' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onConfirmDelete(sale.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
