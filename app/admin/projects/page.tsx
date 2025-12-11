// app/admin/projects/page.tsx
import { supabase } from "@/app/(lib)/supabaseClient";
import AdminHeader from "../../(components)/AdminHeader";
import DeleteProjectButton from "../../(components)/DeleteProjectButton";
import ProjectImage from "../../(components)/ProjectImage";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Edit,
  Calendar,
  ExternalLink,
  Github,
  Tag,
} from "lucide-react";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Project = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  github?: string;
  url?: string;
  tags?: string[];
  created_at?: string;
};

export default async function AdminProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <AdminHeader title="Projects" />
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Manage your portfolio projects, edit details, and showcase your
            work.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              All Projects ({projects?.length || 0})
            </h2>
          </div>

          <Link
            href="/admin/projects/create"
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Project
          </Link>
        </div>

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project: Project, index: number) => (
              <div
                key={project.id}
                className="glass-card overflow-hidden group fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                  <ProjectImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          title="View on GitHub"
                        >
                          <Github className="w-4 h-4 text-gray-700" />
                        </a>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                          title="View Live Site"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-700" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {project.description || "No description provided"}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {project.created_at
                        ? new Date(project.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Date unknown"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/edit/${project.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <div className="flex-1">
                      <DeleteProjectButton 
                        projectId={project.id} 
                        projectTitle={project.title}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex p-4 bg-purple-50 rounded-full mb-4">
                <FolderKanban className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Projects Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start building your portfolio by creating your first project.
                Showcase your work and skills to potential clients and
                employers.
              </p>
              <Link
                href="/admin/projects/create"
                className="btn-primary inline-flex"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Link>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {projects && projects.length > 0 && (
          <div className="mt-8 glass-card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {projects.filter((p) => p.github).length}
                </div>
                <div className="text-sm text-gray-600">With GitHub Links</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter((p) => p.url).length}
                </div>
                <div className="text-sm text-gray-600">Live Deployments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}