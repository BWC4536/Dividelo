import { Metadata } from "next";
import Link from "next/link";
import { OAuthButton } from "@/components/auth/OAuthButton";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Crea tu cuenta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gratis para siempre. Sin tarjeta de crédito.
        </p>
      </div>

      <OAuthButton callbackUrl="/dashboard" />

      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
          o regístrate con email
        </span>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
