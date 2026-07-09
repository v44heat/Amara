"use client";

import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  folder: "gallery" | "rooms" | "hotel";
  onUploaded: (url: string) => void;
  label?: string;
}

/** File-picker button that uploads straight to Cloudinary via /api/admin/upload. */
export function ImageUploader({ folder, onUploaded, label = "Upload photo" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await axios.post("/api/admin/upload", formData);
      onUploaded(res.data.data.url);
      toast.success("Photo uploaded.");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {!uploading && <Upload size={14} />} {uploading ? "Uploading…" : label}
      </Button>
    </div>
  );
}
