"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials, getAvatarColor } from "@/lib/utils/cn";

interface AvatarUploadProps {
  currentImage?: string | null;
  name?: string | null;
  onImageChange: (base64: string) => void;
}

export function AvatarUpload({
  currentImage,
  name,
  onImageChange,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const color = getAvatarColor(name);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPreview(url);
      onImageChange(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar preview */}
      <div
        className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full ring-4 ring-primary/20 hover:ring-primary/40 transition-all"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {preview ? (
          <Image src={preview} alt="Avatar" fill className="object-cover" sizes="96px" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {getInitials(name)}
          </div>
        )}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${dragging ? "opacity-100" : "opacity-0 hover:opacity-100"}`}>
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        Cambiar foto
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />
    </div>
  );
}
