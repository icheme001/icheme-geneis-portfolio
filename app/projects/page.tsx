// app/projects/page.tsx
import { supabase } from "@/app/(lib)/supabaseClient";
import Link from "next/link";
import ProjectImage from "../(components)/ProjectImage";
import { Github, ExternalLink, Calendar, Tag, Folder, Sparkles, ArrowRight } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  github?: string;
  tags?: string[];
  created_at?: string;
};

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  // Fetch CV for download button
  const { data: cvData } = await supabase
    .from("cv_files")
    .select("file_url")
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single();

  const cvUrl = cvData?.file_url || "/cv/resume.pdf";

  // Group projects by tags
  const allTags = projects
    ?.flatMap((p) => p.tags || [])
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .slice(0, 10) || [];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="hidden md:block absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute bottom-40 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="hidden md:block absolute top-1/2 right-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section with 3D Effects */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold shimmer fade-in-up">
            <Folder className="w-4 h-4 inline mr-2" />
            Portfolio Showcase
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
            My <span className="gradient-text neon-glow">Projects</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            A collection of my work showcasing web applications, tools, and creative projects 
            built with modern technologies and best practices.
          </p>
        </div>

        {/* Tags Filter with Enhanced Styling */}
        {allTags.length > 0 && (
          <div className="mb-8 md:mb-12 fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card hover-lift p-4 md:p-6 glow-border">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-purple-600 shimmer" />
                <h3 className="text-sm font-semibold gradient-text">Technologies Used</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <span
                    key={index}
                    className="skill-badge text-xs"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <>
            {/* Stats Bar with Animation */}
            <div className="mb-8 glass-card hover-lift p-4 md:p-5 flex items-center justify-between fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-sm md:text-base font-medium text-gray-700">
                  {projects.length} Project{projects.length !== 1 ? 's' : ''} Available
                </span>
              </div>
              <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Sorted by newest first
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project, index) => (
                <article 
                  key={project.id}
                  className="glass-card hover-3d-rotate overflow-hidden group fade-in-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  {/* Project Image with Shimmer */}
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden shimmer">
                    <ProjectImage
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                    />
                    
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white rounded-full shadow-2xl hover:scale-125 hover-3d-rotate transition-all duration-300 glow-border"
                          aria-label="View GitHub Repository"
                        >
                          <Github className="w-5 h-5 text-gray-800" />
                        </a>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white rounded-full shadow-2xl hover:scale-125 hover-3d-rotate transition-all duration-300 glow-border"
                          aria-label="View Live Demo"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-800" />
                        </a>
                      )}
                    </div>

                    {/* Corner Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shimmer">
                      View Project
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-2 gradient-text-blue group-hover:neon-glow transition-all duration-300 line-clamp-1">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed min-h-[3.6rem]">
                      {project.description || "No description available for this project."}
                    </p>

                    {/* Enhanced Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 4).map((tag: string, i: number) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-xs rounded-full border border-purple-200 hover:scale-110 hover:shadow-md transition-all duration-300 cursor-default"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs rounded-full hover:scale-110 transition-transform duration-300 cursor-default">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer with Enhanced Links */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        {project.github && (
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110 hover-lift"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Code</span>
                          </a>
                        )}
                        {project.url && (
                          <a 
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110 hover-lift"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Live</span>
                          </a>
                        )}
                      </div>
                      
                      {project.created_at && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 group/date hover:text-purple-600 transition-colors">
                          <Calendar className="w-3 h-3 group-hover/date:scale-110 transition-transform" />
                          <span className="hidden md:inline">
                            {new Date(project.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Message */}
            {projects.length >= 20 && (
              <div className="mt-12 text-center fade-in-up">
                <div className="glass-card hover-lift inline-block p-4 px-6 glow-border">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shimmer" />
                    Showing {projects.length} projects. More coming soon! 🚀
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-16 md:py-24 fade-in-up">
            <div className="glass-card hover-lift max-w-md mx-auto p-8 md:p-12 glow-border">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center floating shimmer">
                <Folder className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 gradient-text">No Projects Yet</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Projects will appear here once they're added from the admin dashboard.
              </p>
              <Link href="/admin/projects/create" className="btn-primary ripple text-sm md:text-base">
                <Sparkles className="w-4 h-4" />
                Add Your First Project
              </Link>
            </div>
          </div>
        )}

        {/* Enhanced CTA Section */}
        <div className="mt-16 md:mt-24 text-center fade-in-up">
          <div className="glass-card hover-3d-rotate p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Interested in <span className="gradient-text neon-glow">Working Together?</span>
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact" className="btn-primary ripple text-sm md:text-base group">
                  Get In Touch
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href={cvUrl}
                  download="Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm md:text-base"
                >
                  Download Resume
                </a>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}