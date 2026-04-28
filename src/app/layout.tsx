import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dividelo",
    template: "%s | Dividelo",
  },
  description:
    "Gestiona gastos compartidos con amigos, familia y compañeros. Divide, salda y mantén el control de tus deudas.",
  keywords: ["gastos compartidos", "dividir gastos", "tricount", "deudas", "grupos"],
  authors: [{ name: "Dividelo" }],
  creator: "Dividelo",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://dividelo.app",
    title: "Dividelo",
    description: "Gestiona gastos compartidos de forma inteligente",
    siteName: "Dividelo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: "12px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
