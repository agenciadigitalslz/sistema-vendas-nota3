import { Package, User, ShoppingCart, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const location = useLocation();
  
  // Menu items com ícones Lucide
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: <User size={20} />,
    },
    {
      title: "Produtos",
      url: "/products",
      icon: <Package size={20} />,
    },
    {
      title: "Vendas",
      url: "/sales",
      icon: <ShoppingCart size={20} />,
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-black text-white border-t border-gray-800 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            to={item.url}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-900 group transition-colors duration-200",
              location.pathname === item.url ? "text-white font-medium bg-gray-900" : "text-gray-300"
            )}
          >
            <div className="mb-1">
              {item.icon}
            </div>
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
