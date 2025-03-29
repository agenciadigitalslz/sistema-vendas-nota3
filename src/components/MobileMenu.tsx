
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu() {
  const location = useLocation();
  
  // Menu items (mesmos itens do AppSidebar)
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: "Package",
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: "User",
    },
    {
      title: "Produtos",
      url: "/products",
      icon: "Package",
    },
    {
      title: "Vendas",
      url: "/sales",
      icon: "ShoppingCart",
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group",
              location.pathname === item.url && "text-primary font-medium"
            )}
          >
            <span className="text-sm">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
