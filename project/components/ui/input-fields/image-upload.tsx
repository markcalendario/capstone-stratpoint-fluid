"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface ImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  className?: string;
  required?: boolean;
  value?: string; // default image URL if available
  placeholderImageUrl: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({
  id,
  label,
  className,
  required,
  value,
  placeholderImageUrl,
  onChange,
  ...props
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange(evt);
  };

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!placeholderImageUrl && !preview) return;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <label
          htmlFor={id}
          className="font-medium text-neutral-500 dark:text-neutral-400">
          {label}
        </label>
        {!required && (
          <p className="p-1 text-xs text-neutral-500 dark:text-neutral-400">
            Optional
          </p>
        )}
      </div>

      <div className="border-primary rounded-xs border-2 p-2">
        {/* Clickable image wrapper */}
        <div
          onClick={triggerFileInput}
          className="group hover:border-primary dark:hover:border-primary relative m-auto h-32 w-32 cursor-pointer overflow-hidden rounded border-2 border-dashed border-neutral-300 transition dark:border-neutral-700">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src={preview || placeholderImageUrl}
            alt="preview"
            className="object-cover transition group-hover:opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
            <span className="text-sm text-white">Click to upload</span>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        id={id}
        ref={fileInputRef}
        type="file"
        accept="image/jpeg"
        onChange={handleImageChange}
        className="hidden"
        {...props}
      />
    </div>
  );
}
