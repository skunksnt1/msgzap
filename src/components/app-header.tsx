"use client";

import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { MessageSquare, BarChart3, Users, Settings, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    protected: true,
  },
  {
    name: "Contatos",
    href: "/contacts",
    icon: Users,
    protected: true,
  },
  {
    name: "Campanhas",
    href: "/campaigns",
    icon: MessageSquare,
    protected: true,
  },
  {
    name: "Instâncias",
    href: "/instances",
    icon: Phone,
    protected: true,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    protected: true,
  },
];

export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                WhatsApp Disparador
              </span>
            </Link>
          </h1>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems
                .filter((item) => !item.protected || isAuthenticated)
                .map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
          )}
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
