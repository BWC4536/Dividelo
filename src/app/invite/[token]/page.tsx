"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Users, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import Link from "next/link";

interface InviteInfo {
  group: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    _count: { members: number };
  };
}

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [info, setInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(`/api/groups/invite-info?token=${token}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Invitación no válida");
          return;
        }
        const data = await res.json();
        setInfo(data);
      } catch {
        setError("Error al cargar la invitación");
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  const handleJoin = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/invite/${token}`);
      return;
    }
    setJoining(true);
    try {
      const res = await fetch(`/api/groups/${info!.group.id}/invite/${token}`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al unirse");
      }
      setJoined(true);
      toast.success(`¡Te has unido a ${info!.group.name}!`);
      setTimeout(() => router.push(`/groups/${info!.group.id}/expenses`), 1500);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-background to-violet-50/30 dark:from-brand-900/10 dark:via-background dark:to-violet-900/10 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black gradient-text">Dividelo</span>
        </Link>

        {loading ? (
          <div className="py-8"><LoadingSpinner /></div>
        ) : error ? (
          <div className="py-4">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Invitación no válida</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button asChild variant="outline">
              <Link href="/">Ir al inicio</Link>
            </Button>
          </div>
        ) : joined ? (
          <div className="py-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">¡Bienvenido!</h2>
            <p className="text-sm text-muted-foreground">Redirigiendo al grupo...</p>
          </div>
        ) : info ? (
          <div className="py-4">
            <div className="h-20 w-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg">
              {info.group.imageUrl ? (
                <img src={info.group.imageUrl} alt={info.group.name} className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <Users className="h-10 w-10 text-white" />
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-1">Te han invitado a</p>
            <h2 className="text-2xl font-black mb-2">{info.group.name}</h2>
            {info.group.description && (
              <p className="text-sm text-muted-foreground mb-4">{info.group.description}</p>
            )}
            <p className="text-xs text-muted-foreground mb-6">
              {info.group._count.members} miembro{info.group._count.members !== 1 ? "s" : ""}
            </p>

            {status === "unauthenticated" ? (
              <div className="space-y-3">
                <Button variant="gradient" className="w-full" asChild>
                  <Link href={`/login?callbackUrl=/invite/${token}`}>
                    Iniciar sesión para unirme
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/register?callbackUrl=/invite/${token}`}>
                    Crear cuenta gratis
                  </Link>
                </Button>
              </div>
            ) : (
              <Button
                variant="gradient"
                className="w-full"
                onClick={handleJoin}
                loading={joining}
              >
                Unirme al grupo
              </Button>
            )}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
