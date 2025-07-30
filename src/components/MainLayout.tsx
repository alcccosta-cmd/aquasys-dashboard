"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, SlidersHorizontal, AreaChart, BrainCircuit } from "lucide-react";
import Image from "next/image";

function NavLink({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
        isActive ? "bg-muted text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* --- Barra Lateral (Desktop) --- */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image src="/logo.png" alt="AquaSys Logo" width={32} height={32} />
              <span className="">AquaSys</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-100 dark:bg-gray-900 overflow-auto">
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