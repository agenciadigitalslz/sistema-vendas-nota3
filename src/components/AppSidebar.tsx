
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, User, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export function AppSidebar() {
  const location = useLocation();
  
  // Menu items
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Clientes",
      url: "/clients",
      icon: User,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Produtos",
      url: "/products",
      icon: Package,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
    },
    {
      title: "Vendas",
      url: "/sales",
      icon: ShoppingCart,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">
            SV
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sistema de Vendas
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-md transition-all",
                        location.pathname === item.url ? 
                          `${item.color} font-medium ${item.bgColor}` : 
                          "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-md flex items-center justify-center",
                        location.pathname === item.url ? item.color : "text-muted-foreground"
                      )}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            &copy; 2024 Sistema de Vendas
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
