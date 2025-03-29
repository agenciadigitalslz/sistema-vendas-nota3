
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  
  // Menu items
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Package,
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: User,
    },
    {
      title: "Produtos",
      url: "/products",
      icon: Package,
    },
    {
      title: "Vendas",
      url: "/sales",
      icon: ShoppingCart,
    }
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 text-xl font-bold text-sales-primary">
          Sistema de Vendas
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={cn(
                        "flex items-center gap-3",
                        location.pathname === item.url && "text-sales-primary font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
