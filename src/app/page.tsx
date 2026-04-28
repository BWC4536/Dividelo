import Link from "next/link";
import { ArrowRight, Zap, Users, BarChart2, Shield, Receipt, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Receipt,
    title: "Añade gastos fácilmente",
    description:
      "Registra gastos en segundos con categorías, fotos de recibos y divisiones flexibles.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: BarChart2,
    title: "Balances en tiempo real",
    description:
      "Visualiza quién debe a quién con gráficos claros y simplificación automática de deudas.",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Users,
    title: "Grupos ilimitados",
    description:
      "Crea grupos para viajes, piso compartido, cenas con amigos o cualquier ocasión.",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    icon: Shield,
    title: "Seguro y privado",
    description:
      "Tus datos están protegidos. Accede con Google o crea una cuenta con contraseña.",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
];

const steps = [
  {
    number: "01",
    title: "Crea un grupo",
    description:
      "Invita a tus amigos o compañeros de piso al grupo en segundos.",
  },
  {
    number: "02",
    title: "Añade gastos",
    description:
      "Registra quién pagó, cuánto y cómo dividirlo entre los participantes.",
  },
  {
    number: "03",
    title: "Salda las deudas",
    description:
      "Dividelo simplifica las deudas y te dice exactamente quién debe pagar a quién.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Dividelo</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link href="/register">Registrarse gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-28">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-background to-violet-50/30 dark:from-brand-700/10 dark:via-background dark:to-violet-900/10" />
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-100/50 dark:bg-brand-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-100/50 dark:bg-violet-900/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 dark:border-brand-800 dark:bg-brand-900/30 mb-6">
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              Gratis para siempre
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-6">
            Divide gastos
            <br />
            <span className="gradient-text">sin complicaciones</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-10">
            La forma más fácil de gestionar gastos compartidos. Viajes,
            restaurantes, piso compartido... Dividelo lo hace simple.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="gradient" size="xl" asChild>
              <Link href="/register">
                Empezar gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>

          {/* Hero mockup */}
          <div className="mt-16 relative mx-auto max-w-2xl">
            <div className="glass-card rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  dividelo.app
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="col-span-1 rounded-xl bg-emerald-400 p-4 text-white">
                  <p className="text-xs text-emerald-100">Te deben</p>
                  <p className="text-2xl font-bold mt-1">€84</p>
                </div>
                <div className="col-span-1 rounded-xl gradient-bg p-4 text-white">
                  <p className="text-xs text-white/80">Balance</p>
                  <p className="text-2xl font-bold mt-1">+€45</p>
                </div>
                <div className="col-span-1 rounded-xl bg-red-400 p-4 text-white">
                  <p className="text-xs text-red-100">Debes</p>
                  <p className="text-2xl font-bold mt-1">€39</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { emoji: "🍕", title: "Cena italiana", amount: "€45", who: "Pagó Carlos" },
                  { emoji: "🚗", title: "Gasolina viaje", amount: "€30", who: "Pagó Ana" },
                  { emoji: "🏠", title: "Alquiler julio", amount: "€900", who: "Pagó Tú" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-muted p-3">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.who}</p>
                    </div>
                    <p className="text-sm font-bold">{item.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Diseñado para hacer la gestión de gastos compartidos lo más sencilla posible.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${feature.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Cómo funciona
            </h2>
            <p className="text-muted-foreground">
              Empieza en menos de 2 minutos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-white text-2xl font-black mb-4">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute translate-x-[180px] translate-y-[-48px]">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-muted-foreground mb-8">
            Únete a miles de usuarios que ya usan Dividelo para gestionar sus gastos compartidos.
          </p>
          <Button variant="gradient" size="xl" asChild>
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg gradient-bg">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">Dividelo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dividelo. Hecho con ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
