"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, SlidersHorizontal, AreaChart, BrainCircuit, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function NavLink({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
        isActive ? "bg-muted text-primary font-semibold" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Barra Lateral (Desktop) --- */}
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-3 font-semibold text-lg">
              <Image src="/logo.png" alt="AquaSys Logo" width={32} height={32} />
              <span className="">HydroSmart</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-md font-medium lg:px-4">
              <NavLink href="/" icon={Home}>Dashboard</NavLink>
              <NavLink href="/controls" icon={SlidersHorizontal}>Controles</NavLink>
              <NavLink href="/charts" icon={AreaChart}>Gráficos</NavLink>
              <NavLink href="/automation" icon={BrainCircuit}>Automação</NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* --- Conteúdo Principal e Navegação Móvel --- */}
      <div className="flex flex-col">
        {/* Cabeçalho para o modo Móvel */}
        <header className="md:hidden flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.png" alt="AquaSys Logo" width={24} height={24} />
            <span className="">HydroSmart</span>
          </Link>
          <div className="ml-auto">
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </header>
        
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
        </main>

        {/* --- Barra de Abas (Móvel) --- */}
        <footer className="md:hidden sticky bottom-0 border-t bg-background">
          <nav className="grid grid-cols-4 gap-1 p-1">
            <Link href="/" className="flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground hover:text-primary"><Home className="h-5 w-5" /><span className="text-xs">Dashboard</span></Link>
            <Link href="/controls" className="flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground hover:text-primary"><SlidersHorizontal className="h-5 w-5" /><span className="text-xs">Controles</span></Link>
            <Link href="/charts" className="flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground hover:text-primary"><AreaChart className="h-5 w-5" /><span className="text-xs">Gráficos</span></Link>
            <Link href="/automation" className="flex flex-col items-center gap-1 rounded-lg p-2 text-muted-foreground hover:text-primary"><BrainCircuit className="h-5 w-5" /><span className="text-xs">Automação</span></Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}