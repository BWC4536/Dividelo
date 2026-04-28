"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Search, Copy, Link2, Check } from "lucide-react";
import { User } from "@/types";

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
}

export function InviteModal({ open, onOpenChange, groupId }: InviteModalProps) {
  const [emailSearch, setEmailSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);

  const debouncedSearch = useDebounce(emailSearch, 400);

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const users = await res.json();
        setSearchResults(users);
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  };

  // Effect for debounced search
  useState(() => {
    handleSearch(debouncedSearch);
  });

  const handleInviteUser = async (userId: string) => {
    setInviting(userId);
    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("Usuario invitado al grupo");
        setSearchResults((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const err = await res.json();
        toast.error(err.error || "Error al invitar usuario");
      }
    } catch {
      toast.error("Error al invitar usuario");
    } finally {
      setInviting(null);
    }
  };

  const generateLink = async () => {
    setGeneratingLink(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/invite`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        const link = `${window.location.origin}/invite/${data.token}`;
        setInviteLink(link);
      } else {
        toast.error("Error al generar enlace");
      }
    } catch {
      toast.error("Error al generar enlace");
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar al grupo</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="email">
          <TabsList className="w-full">
            <TabsTrigger value="email" className="flex-1">
              Por email
            </TabsTrigger>
            <TabsTrigger value="link" className="flex-1">
              Por enlace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por email o nombre..."
                value={emailSearch}
                onChange={(e) => {
                  setEmailSearch(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-9"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searching && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Buscando...
                </p>
              )}
              {!searching && emailSearch.length >= 3 && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No se encontraron usuarios
                </p>
              )}
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    loading={inviting === user.id}
                    onClick={() => handleInviteUser(user.id)}
                  >
                    Invitar
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Comparte este enlace para que cualquiera pueda unirse al grupo.
              Expira en 7 días.
            </p>

            {inviteLink ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted p-3">
                  <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-xs text-muted-foreground truncate">
                    {inviteLink}
                  </span>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  onClick={copyLink}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar enlace
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                loading={generatingLink}
                onClick={generateLink}
              >
                <Link2 className="h-4 w-4" />
                Generar enlace de invitación
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
