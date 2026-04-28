"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AvatarUpload } from "./AvatarUpload";
import { User } from "@/types";
import { mutate } from "swr";

interface ProfileAvatarSectionProps {
  user: Pick<User, "id" | "name" | "image">;
}

export function ProfileAvatarSection({ user }: ProfileAvatarSectionProps) {
  const [saving, setSaving] = useState(false);

  const handleImageChange = async (base64: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}/avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) throw new Error("Error al subir la imagen");
      toast.success("Foto actualizada");
      mutate(`/api/users/${user.id}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AvatarUpload
      currentImage={user.image}
      name={user.name}
      onImageChange={handleImageChange}
    />
  );
}
