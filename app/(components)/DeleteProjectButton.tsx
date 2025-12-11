// app/(components)/DeleteProjectButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProjectButtonProps {
  projectId: number;
  projectTitle: string;
}

export default function DeleteProjectButton({ projectId, projectTitle }: DeleteProjectButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/projects/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: projectId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the page to show updated list
        router.refresh();
      } else {
        alert(data.error || "Failed to delete project");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the project");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4" />
          Delete
        </>
      )}
    </button>
  );
}