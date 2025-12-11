// app/(components)/ProjectImage.tsx
"use client";
import { useState } from "react";
import { Folder } from "lucide-react";

interface ProjectImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function ProjectImage({ src, alt, className = "" }: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    // Fallback when no image or image fails to load
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500 ${className}`}>
        <Folder className="w-16 h-16 text-white opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}