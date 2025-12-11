// app/admin/projects/edit/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  RefreshCw
} from "lucide-react";

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    
    async function load() {
      try {
        const res = await fetch(`/api/projects/get?id=${id}`);
        const json = await res.json();
        if (json.success && json.project) {
          setProject(json.project);
          setTitle(json.project.title ?? "");
          setDescription(json.project.description ?? "");
          setGithub(json.project.github ?? "");
          setUrl(json.project.url ?? "");
          setTags(json.project.tags?.join(", ") ?? "");
          if (json.project.image) {
            setImagePreview(json.project.image);
          }
        } else {
          setLoadError(true);
        }
      } catch (err) {
        console.error(err);
        setLoadError(true);
      }
    }
    load();
  }, [id]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(project?.image || null);
  }

  function removeExistingImage() {
    setImagePreview(null);
    setImageFile(null);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const form = new FormData();
      form.append("id", id);
      form.append("title", title);
      form.append("description", description);
      form.append("github", github);
      form.append("url", url);
      form.append("tags", tags);
      if (imageFile) form.append("file", imageFile);

      const res = await fetch("/api/projects/update", { method: "POST", body: form });
      const json = await res.json();
      
      if (!json.success) {
        setStatus("error");
        setIsLoading(false);
        return;
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

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="inline-flex p-4 bg-red-50 rounded-full mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/admin/projects" className="btn-primary inline-flex">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
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
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Edit Project
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Update your project details and keep your portfolio fresh.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Project Details
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
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
              {/* Current Image */}
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeExistingImage}
                      aria-label="Remove image"
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {imageFile ? "New image selected" : "Current project image"}
                  </p>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No image set for this project</p>
                </div>
              )}

              {/* Upload New Image */}
              <label 
                htmlFor="image" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-400 group-hover:text-purple-600 transition-colors mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-purple-600">
                      {imagePreview ? "Replace image" : "Upload image"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
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
            </div>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="glass-card p-4 bg-green-50 border border-green-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Project updated successfully!</p>
                  <p className="text-xs text-green-600">Redirecting to projects list...</p>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="glass-card p-4 bg-red-50 border border-red-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Failed to update project</p>
                  <p className="text-xs text-red-600">Please try again or check your input</p>
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Project
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