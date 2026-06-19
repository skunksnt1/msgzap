import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

// Fontes do sistema (sem depender do Google Fonts, que exige acesso externo).
const fontVariables = {
  "--font-geist-sans":
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  "--font-geist-mono":
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
} as React.CSSProperties;

export const metadata: Metadata = {
  title: "WhatsApp Disparador - Plataforma de Marketing",
  description:
    "Plataforma SaaS para empresas no Brasil utilizarem o WhatsApp para comunicação em massa, com foco em segurança e preço acessível.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" style={fontVariables}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppHeader />
          <main className="min-h-[calc(100vh-140px)]">{children}</main>
          <AppFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
