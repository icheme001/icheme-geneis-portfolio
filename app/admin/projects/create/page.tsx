// app/admin/projects/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Upload,
  Github,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      // If image, upload to supabase via API route
      let imageUrl = "";
      if (imageFile) {
  const fd = new FormData();
  fd.append("file", imageFile);
  fd.append("title", title);
  fd.append("description", description);
  fd.append("github", github);
  fd.append("url", url);
  fd.append("tags", JSON.stringify(
    tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  )); // ✅ Convert array to JSON string

  const r = await fetch("/api/projects/add", {
    method: "POST",
    body: fd,
  });
  const data = await r.json();
  if (!data.success) {
    setStatus("error");
    setIsLoading(false);
    return;
  }
  imageUrl = data.imageUrl ?? "";
} else {
        // create without image by posting JSON
        const r = await fetch("/api/projects/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            github,
            url,
            tags: tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }),
        });
        const data = await r.json();
        if (!data.success) {
          setStatus("error");
          setIsLoading(false);
          return;
        }
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create New Project
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Add a new project to your portfolio and showcase your work.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Project Details
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter project title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe your project, its features, and technologies used..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length} characters
                </p>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="React, TypeScript, Next.js (comma separated)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-purple-600" />
              Project Links
            </h2>

            <div className="space-y-5">
              {/* GitHub URL */}
              <div>
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Github className="w-4 h-4 inline mr-1" />
                  GitHub Repository
                </label>
                <input
                  id="github"
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Live URL */}
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <ExternalLink className="w-4 h-4 inline mr-1" />
                  Live Demo URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Project Image
            </h2>

            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="Remove image"
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-purple-500 transition-colors mb-3" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    aria-label="Upload project image"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="glass-card p-4 bg-green-50 border border-green-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Project created successfully!
                  </p>
                  <p className="text-xs text-green-600">
                    Redirecting to projects list...
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="glass-card p-4 bg-red-50 border border-red-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Failed to create project
                  </p>
                  <p className="text-xs text-red-600">
                    Please try again or check your input
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="submit"
              disabled={isLoading || !title}
              className="btn-primary flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>

            <Link
              href="/admin/projects"
              className="btn-secondary flex-1 sm:flex-initial text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
