import { Metadata } from "next";
import Link from "next/link";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bienvenido de nuevo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Accede a tu cuenta para continuar
        </p>
      </div>

      <OAuthButton />

      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
          o continúa con email
        </span>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </div>
  );
}
