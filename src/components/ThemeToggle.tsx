
import { useThemeStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full shadow-md hover:shadow-lg bg-card dark:bg-slate-800"
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
