"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGroup, deleteGroup, updateGroup } from "@/hooks/useGroups";
import { GroupForm } from "@/components/groups/GroupForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Archive, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { mutate } from "swr";

export default function SettingsPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { data: session } = useSession();
  const { group, isLoading } = useGroup(groupId);
  const router = useRouter();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;
  if (!group) return null;

  const isAdmin = group.members?.some(
    (m) => m.userId === (session?.user?.id as string) && m.role === "admin"
  );

  const handleArchive = async () => {
    try {
      await updateGroup(groupId, { archived: !group.archived });
      toast.success(group.archived ? "Grupo restaurado" : "Grupo archivado");
      router.push("/groups");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGroup(groupId);
      toast.success("Grupo eliminado");
      router.push("/groups");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleLeave = async () => {
    try {
      const member = group.members?.find((m) => m.userId === (session?.user?.id as string));
      if (!member) return;
      const res = await fetch(`/api/groups/${groupId}/members/${member.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al salir del grupo");
      await mutate("/api/groups");
      toast.success("Has salido del grupo");
      router.push("/groups");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      {isAdmin && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Editar grupo</h2>
          <GroupForm group={group} />
        </section>
      )}

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-destructive">Zona de peligro</h2>

        {isAdmin && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setArchiveOpen(true)}
          >
            <Archive className="h-4 w-4 mr-2" />
            {group.archived ? "Restaurar grupo" : "Archivar grupo"}
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => setLeaveOpen(true)}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Salir del grupo
        </Button>

        {isAdmin && (
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar grupo
          </Button>
        )}
      </section>

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={group.archived ? "¿Restaurar grupo?" : "¿Archivar grupo?"}
        description={group.archived ? "El grupo volverá a estar activo." : "El grupo se ocultará pero conservará todos los datos."}
        onConfirm={handleArchive}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="¿Eliminar grupo?"
        description="Esta acción es irreversible. Se eliminarán todos los gastos y datos del grupo."
        onConfirm={handleDelete}
        variant="destructive"
      />
      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="¿Salir del grupo?"
        description="Dejarás de tener acceso a este grupo y sus gastos."
        onConfirm={handleLeave}
        variant="destructive"
      />
    </div>
  );
}
