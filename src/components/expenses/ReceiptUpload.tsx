"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReceiptUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export function ReceiptUpload({ value, onChange }: ReceiptUploadProps) {
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (preview) {
    return (
      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
        <Image src={preview} alt="Recibo" fill className="object-cover" sizes="400px" />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-2 h-32 w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
        dragging
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {dragging ? (
          <Upload className="h-5 w-5 text-primary" />
        ) : (
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">
          {dragging ? "Suelta aquí" : "Subir recibo"}
        </p>
        <p className="text-xs text-muted-foreground/60">
          Arrastra o haz clic
        </p>
      </div>
      <input
        ref={fileInputRef}
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
