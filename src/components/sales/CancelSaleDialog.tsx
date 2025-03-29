
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
import { Loader2 } from "lucide-react";

interface CancelSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

export function CancelSaleDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  isCancelling 
}: CancelSaleDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
          <AlertDialogDescription className="dark:text-gray-300">
            Tem certeza que deseja cancelar esta venda? O estoque será restaurado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600" disabled={isCancelling}>
            Não
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              'Sim, cancelar venda'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
