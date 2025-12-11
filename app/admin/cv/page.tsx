// app/admin/cv/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import AdminHeader from "../../(components)/AdminHeader";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Download,
  Eye,
  Trash2,
  File,
  Calendar,
  FileCheck
} from "lucide-react";

type UploadedCV = {
  id: number;
  file_url: string;
  uploaded_at: string;
};

export default function UploadCvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCVs, setUploadedCVs] = useState<UploadedCV[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoadingCVs, setIsLoadingCVs] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch uploaded CVs on component mount
  useEffect(() => {
    fetchUploadedCVs();
  }, []);

  // Fetch CVs from database
  const fetchUploadedCVs = async () => {
    setIsLoadingCVs(true);
    try {
      const response = await fetch("/api/cv/list");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.cvs) {
          setUploadedCVs(data.cvs);
        }
      }
    } catch (error) {
      console.error("Error fetching CVs:", error);
    } finally {
      setIsLoadingCVs(false);
    }
  };

  // Delete CV
  const handleDeleteCV = async (cvId: number) => {
    if (!confirm("Are you sure you want to delete this CV?")) {
      return;
    }

    try {
      const response = await fetch("/api/cv/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cvId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setUploadedCVs(prev => prev.filter(cv => cv.id !== cvId));
        setStatus("success");
        setMessage("CV deleted successfully");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setMessage("Failed to delete CV");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setStatus("error");
      setMessage("Error deleting CV");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Handle file selection
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setStatus("error");
      setMessage("Please select a PDF file");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setStatus("error");
      setMessage("File size must be less than 10MB");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setMessage(null);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!file) {
      setStatus("error");
      setMessage("Please select a PDF file to upload");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("uploading");
    setMessage("Uploading your CV...");
    setUploadProgress(0);

    const fd = new FormData();
    fd.append("file", file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch("/api/cv/upload", { 
        method: "POST", 
        body: fd 
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const json = await res.json();
      
      if (json.success) {
        setStatus("success");
        setMessage("CV uploaded successfully!");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        // Add to uploaded list if returned
        if (json.data) {
          setUploadedCVs(prev => [json.data, ...prev]);
        } else {
          // Refresh the list if no data returned
          fetchUploadedCVs();
        }
        
        setTimeout(() => {
          setStatus("idle");
          setUploadProgress(0);
        }, 3000);
      } else {
        setStatus("error");
        setMessage(json.error || "Upload failed. Please try again.");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Server error. Please check your connection.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    setStatus("idle");
    setMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <AdminHeader title="Upload CV" />
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Upload your latest CV/Resume. Supported format: PDF (Max 10MB)
          </p>
        </div>

        {/* Upload Section */}
        <div className="glass-card p-6 md:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : file 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-purple-400'
                }
              `}
            >
              {!file ? (
                <>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                      Drop your CV here
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      or click to browse from your device
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary text-sm md:text-base"
                    >
                      <FileText className="w-4 h-4" />
                      Choose File
                    </button>

                    <input
                      ref={fileInputRef}
                      id="cv-file"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                      className="hidden"
                      aria-label="Choose CV file"
                    />

                    <p className="text-xs text-gray-500 mt-4">
                      PDF only • Maximum file size: 10MB
                    </p>
                  </div>
                </>
              ) : (
                /* Selected File Preview */
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-green-200">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileCheck className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate mb-1">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    disabled={status === "uploading"}
                    aria-label="Remove selected file"
                    title="Remove file"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {status === "uploading" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="font-semibold text-purple-600">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {status === "success" && message && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-green-800">Success!</div>
                  <div className="text-xs text-green-600 mt-1">{message}</div>
                </div>
              </div>
            )}

            {status === "error" && message && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-red-800">Upload Failed</div>
                  <div className="text-xs text-red-600 mt-1">{message}</div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={!file || status === "uploading"}
              className="w-full btn-primary py-3 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "uploading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload CV
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="glass-card p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">File Format</h4>
                <p className="text-sm text-gray-600">
                  Only PDF files are accepted for consistency and compatibility.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Best Practices</h4>
                <p className="text-sm text-gray-600">
                  Keep your CV updated and ensure all information is current.
                </p>
              </div>
            </div>
          </div>
        </div>

                  {/* Current CV Section (if you want to show uploaded CVs) */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <File className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg md:text-xl font-bold text-gray-800">
              Uploaded CVs
            </h3>
          </div>

          {isLoadingCVs ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto mb-3 text-purple-600 animate-spin" />
              <p className="text-sm text-gray-600">Loading CVs...</p>
            </div>
          ) : uploadedCVs.length > 0 ? (
            <div className="space-y-3">
              {uploadedCVs.map((cv) => (
                <div 
                  key={cv.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {cv.file_url.split('/').pop() || 'Resume.pdf'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(cv.uploaded_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={cv.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View CV"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={cv.file_url}
                      download
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download CV"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteCV(cv.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete CV"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No CVs uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}