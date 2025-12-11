// app/page.tsx
import Link from "next/link";
import { supabase } from "@/app/(lib)/supabaseClient";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Download,
  Code2,
  Zap,
  Coffee,
  Sparkles,
  ExternalLink,
} from "lucide-react";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch CV from database
  const { data: cvData } = await supabase
    .from("cv_files")
    .select("file_url")
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .single();

  const cvUrl = cvData?.file_url || "/cv/resume.pdf";

  // Fetch featured projects from database
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const featuredProjects = projects || [];

  const skills = [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Supabase",
    "PostgreSQL",
    "Tailwind CSS",
    "REST APIs",
    "Docker",
    "AWS",
    "Git",
    "CI/CD",
  ];

  const stats = [
    { label: "Projects Completed", value: "10+", icon: Code2 },
    { label: "Happy Clients", value: "10+", icon: Sparkles },
    { label: "Cups of Coffee", value: "∞", icon: Coffee },
    { label: "Lines of Code", value: "100K+", icon: Zap },
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-28">
        {/* Animated morphing background blobs */}
        <div className="hidden md:block absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="hidden md:block absolute top-40 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="hidden md:block absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Profile Image with 3D Float */}
            <div className="relative floating w-full md:w-auto flex justify-center md:block">
              <div className="glow-border w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden ring-4 ring-white shadow-2xl hover-3d-rotate">
                <img
                  src="/images/pro.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Animated decorative rings */}
              <div className="absolute -inset-2 md:-inset-4 rounded-full border-2 border-purple-200 opacity-50 animate-spin" style={{ animationDuration: '20s' }}></div>
              <div className="hidden md:block absolute -inset-8 rounded-full border-2 border-blue-200 opacity-30 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
            </div>

            {/* Hero Content */}
            <div className="flex-1 text-center md:text-left fade-in-up w-full">
              <div className="inline-block mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold shimmer">
                👋 Available for freelance work
              </div>

              <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Hi, I'm{" "}
                <span className="gradient-text neon-glow">Icheme Genesis Ojochegbe</span>
              </h1>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 mb-4 md:mb-6 font-light text-reveal">
                Full-Stack Developer & UI/UX Enthusiast
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto md:mx-0 fade-in-up" style={{ animationDelay: '0.2s' }}>
                I craft beautiful, functional web applications with modern
                technologies. Passionate about creating seamless user
                experiences and writing clean, maintainable code.
              </p>

              {/* CTA Buttons with Ripple Effect */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center md:justify-start mb-6 md:mb-8">
                <Link
                  href="/projects"
                  className="w-full sm:w-auto btn-primary ripple text-sm sm:text-base"
                >
                  View My Work <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto btn-secondary text-sm sm:text-base"
                >
                  Get In Touch <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <a
                  href={cvUrl}
                  download="Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto btn-secondary text-sm sm:text-base"
                >
                  Download CV <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>

              {/* Social Links with 3D Hover */}
              <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                <a
                  href="https://github.com/icheme001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 md:p-3 bg-white rounded-full shadow-md hover-lift transition-all duration-300"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 md:p-3 bg-white rounded-full shadow-md hover-lift transition-all duration-300"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="mailto:ichemegenesis@gmail.com"
                  className="p-2.5 md:p-3 bg-white rounded-full shadow-md hover-lift transition-all duration-300"
                  aria-label="Email Contact"
                >
                  <Mail className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION with 3D Cards */}
      <section className="py-12 md:py-16 bg-white/50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card hover-3d-rotate p-4 md:p-6 text-center fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="shimmer">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 md:mb-3 text-purple-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 pulse">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold fade-in-up">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-center text-gray-600 mb-8 md:mb-12 text-sm sm:text-base md:text-lg fade-in-up" style={{ animationDelay: '0.1s' }}>
              Passionate developer with a love for creating elegant solutions
            </p>

            <div className="glass-card hover-lift p-6 sm:p-8 md:p-10 lg:p-12 mb-8 md:mb-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
                I'm a full-stack developer with over 5 years of experience
                building web applications that make a difference. My journey
                started with a curiosity about how websites work, and it evolved
                into a passion for creating exceptional digital experiences.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">
                I specialize in modern JavaScript frameworks, particularly
                Next.js and React, and I'm well-versed in backend technologies
                like Node.js and PostgreSQL. I believe in writing clean,
                maintainable code and creating interfaces that users love.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies,
                contributing to open-source projects, or sharing my knowledge
                through blog posts and tutorials.
              </p>
            </div>

            {/* Skills with Enhanced Badges */}
            <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
                <span className="gradient-text">Tech Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-badge fade-in-up"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS with 3D Effects */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white/30">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold fade-in-up">
              Featured <span className="gradient-text neon-glow">Projects</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg fade-in-up" style={{ animationDelay: '0.1s' }}>
              Check out some of my recent work
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="glass-card hover-3d-rotate overflow-hidden group fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Project Image with Shimmer */}
                <div className="relative h-40 sm:h-44 md:h-48 bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden shimmer">
                  <img
                    src={project.image || "/images/default-placeholder.png"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Floating overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Project Info */}
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors gradient-text-blue">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 md:mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags with enhanced style */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                      {project.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs rounded-full font-medium hover:scale-110 transition-transform cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links with hover effects */}
                  <div className="flex gap-3 md:gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110"
                      >
                        <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Code
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110"
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="text-center fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/projects" className="btn-primary ripple text-sm sm:text-base">
              View All Projects <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION with Animated Gradient */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 gradient-bg text-white relative overflow-hidden">
        <div className="container text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-white mb-3 md:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold fade-in-up">
            Let's Work <span className="neon-glow">Together</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.1s' }}>
            Have a project in mind? Let's collaborate and create something
            amazing together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 sm:px-7 md:px-8 py-3 md:py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 text-sm sm:text-base ripple fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Start a Conversation <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}