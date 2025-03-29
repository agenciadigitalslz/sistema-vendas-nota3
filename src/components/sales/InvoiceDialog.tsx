
import { DetailedSale } from "@/types";
import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: DetailedSale | null;
}

export function InvoiceDialog({ open, onOpenChange, sale }: InvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">NOTA FISCAL</DialogTitle>
        </DialogHeader>
        {sale && (
          <div className="border p-4 rounded-lg">
            <div className="text-center mb-4 border-b pb-2">
              <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-sales-primary" />
              <p className="text-sm">Data/Hora: {sale.dateTime}</p>
              <p className="font-semibold">Venda #{sale.id}</p>
              {sale.status === 'cancelada' && (
                <p className="mt-1 text-destructive font-semibold">CANCELADA</p>
              )}
            </div>
            
            <div className="mb-4">
              <p><span className="font-semibold">Cliente:</span> {sale.clientName}</p>
            </div>
            
            <div className="border-t border-b py-2 my-4">
              <div className="flex justify-between mb-1">
                <span>Produto:</span>
                <span>{sale.productName}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Quantidade:</span>
                <span>{sale.quantity}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Valor unitário:</span>
                <span>R$ {sale.productValue.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL:</span>
              <span>R$ {sale.totalValue.toFixed(2)}</span>
            </div>
            
            <div className="text-center mt-6 text-sm text-gray-500">
              {sale.status === 'ativa' ? 'Obrigado pela sua compra!' : 'Esta venda foi cancelada.'}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
