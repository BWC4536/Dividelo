"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Group, CURRENCIES } from "@/types";
import { createGroup, updateGroup } from "@/hooks/useGroups";
import { useRouter } from "next/navigation";
import { generateGradient } from "@/lib/utils/cn";

const groupSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50),
  description: z.string().max(200).optional(),
  currency: z.string().min(1, "Selecciona una moneda"),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface GroupFormProps {
  group?: Group;
  onSuccess?: (group: Group) => void;
}

export function GroupForm({ group, onSuccess }: GroupFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    group?.imageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!group;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name ?? "",
      description: group?.description ?? "",
      currency: group?.currency ?? "EUR",
    },
  });

  const nameValue = watch("name");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: GroupFormData) => {
    setLoading(true);
    try {
      let result: Group;
      if (isEditing && group) {
        result = await updateGroup(group.id, data);
        toast.success("Grupo actualizado");
      } else {
        result = await createGroup(data);
        toast.success("Grupo creado");
      }
      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/groups/${result.id}/expenses`);
      }
    } catch (error: any) {
      toast.error(error.message || "Error al guardar grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image preview */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-2xl"
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: imagePreview ? undefined : generateGradient(nameValue),
          }}
        >
          {imagePreview ? (
            <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="96px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
              {nameValue ? nameValue[0].toUpperCase() : "?"}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {imagePreview && (
          <button
            type="button"
            onClick={() => setImagePreview(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3" />
            Eliminar foto
          </button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre del grupo *</Label>
        <Input
          id="name"
          placeholder="Ej: Vacaciones verano 2025"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input
          id="description"
          placeholder="Descripción breve del grupo"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Moneda</Label>
        <Select
          defaultValue={group?.currency ?? "EUR"}
          onValueChange={(val) => setValue("currency", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona moneda" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.symbol} {c.name} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.currency && (
          <p className="text-xs text-destructive">{errors.currency.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        loading={loading}
      >
        {isEditing ? "Guardar cambios" : "Crear grupo"}
      </Button>
    </form>
  );
}
