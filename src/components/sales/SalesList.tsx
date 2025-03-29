import { DetailedSale } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

interface SalesListProps {
  sales: DetailedSale[];
  onShowInvoice: (sale: DetailedSale) => void;
  onConfirmDelete: (id: number) => void;
  onConfirmDeletePermanent: (id: number) => void;
  isLoading: boolean;
}

export function SalesList({ 
  sales, 
  onShowInvoice, 
  onConfirmDelete, 
  onConfirmDeletePermanent,
  isLoading 
}: SalesListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (sales.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        Nenhuma venda registrada
      </div>
    );
  }

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-slate-700">
                <TableHead className="dark:text-gray-300">ID</TableHead>
                <TableHead className="dark:text-gray-300">Data/Hora</TableHead>
                <TableHead className="dark:text-gray-300">Cliente</TableHead>
                <TableHead className="dark:text-gray-300">Produto</TableHead>
                <TableHead className="dark:text-gray-300">Qtd</TableHead>
                <TableHead className="dark:text-gray-300">Valor</TableHead>
                <TableHead className="dark:text-gray-300">Status</TableHead>
                <TableHead className="dark:text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow 
                  key={sale.id} 
                  className={`${sale.status === 'cancelada' ? "opacity-75" : ""} dark:border-slate-700`}
                >
                  <TableCell className="dark:text-white">{sale.id}</TableCell>
                  <TableCell className="dark:text-white">{formatDateTime(sale.dateTime)}</TableCell>
                  <TableCell className="dark:text-white">{sale.clientName}</TableCell>
                  <TableCell className="dark:text-white">{sale.productName}</TableCell>
                  <TableCell className="dark:text-white">{sale.quantity}</TableCell>
                  <TableCell className="dark:text-white">R$ {sale.totalValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      className={sale.status === 'ativa' 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {sale.status === 'ativa' ? 'Ativa' : 'Cancelada'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="inline-flex items-center justify-center h-10 w-10 gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => onShowInvoice(sale)}
                      >
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </Button>
                      {sale.status === 'ativa' && (
                        <Button
                          className="inline-flex items-center justify-center h-10 w-10 gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                          onClick={() => onConfirmDelete(sale.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {sale.status === 'cancelada' && (
                        <Button
                          className="inline-flex items-center justify-center h-10 w-10 gap-2 whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                          onClick={() => onConfirmDeletePermanent(sale.id)}
                        >
                          <Trash className="h-4 w-4 text-red-800" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
