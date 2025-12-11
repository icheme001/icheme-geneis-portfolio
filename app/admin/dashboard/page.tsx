// app/admin/dashboard/page.tsx
import { supabase } from "../../(lib)/supabaseClient";
import AdminHeader from "../../(components)/AdminHeader";
import Link from "next/link";
import { 
  FolderKanban, 
  MessageSquare, 
  FileText, 
  Plus, 
  Settings, 
  TrendingUp,
  Calendar,
  Eye,
  Mail,
  BarChart3,
  Activity
} from "lucide-react";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Get counts and recent data with proper error handling
  const [
    projectsResult,
    messagesResult,
    cvResult,
    recentProjectsResult,
    recentMessagesResult,
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("cv_files").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("id, title, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("messages").select("id, name, email, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const projectsCount = projectsResult.count;
  const messagesCount = messagesResult.count;
  const cvCount = cvResult.count;
  const recentProjects = recentProjectsResult.data;
  const recentMessages = recentMessagesResult.data;

  const stats = [
    {
      title: "Total Projects",
      value: projectsCount ?? 0,
      icon: FolderKanban,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "New Messages",
      value: messagesCount ?? 0,
      icon: MessageSquare,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "+23%",
      trendUp: true
    },
    {
      title: "CV Downloads",
      value: cvCount ?? 0,
      icon: FileText,
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Total Views",
      value: "1.2K",
      icon: Eye,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "+45%",
      trendUp: true
    }
  ];

  const quickActions = [
    {
      title: "Add New Project",
      description: "Create a new portfolio project",
      icon: Plus,
      href: "/admin/projects/create",
      gradient: "from-blue-500 to-cyan-500",
      primary: true
    },
    {
      title: "View Messages",
      description: "Check contact form submissions",
      icon: Mail,
      href: "/admin/messages",
      gradient: "from-purple-500 to-pink-500",
      primary: false
    },
    {
      title: "Manage Projects",
      description: "Edit or delete existing projects",
      icon: FolderKanban,
      href: "/admin/projects",
      gradient: "from-orange-500 to-red-500",
      primary: false
    },
    {
      title: "Settings",
      description: "Update profile and preferences",
      icon: Settings,
      href: "/admin/settings",
      gradient: "from-green-500 to-emerald-500",
      primary: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <AdminHeader title="Dashboard" />
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Welcome back! Here's what's happening with your portfolio today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-5 md:p-6 hover-lift fade-in-up group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>

                {/* Value */}
                <div className="mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                </div>

                {/* Title and Trend */}
                <div className="flex items-center justify-between">
                  <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
                  <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`w-3 h-3 ${!stat.trendUp && 'rotate-180'}`} />
                    <span>{stat.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="glass-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg md:text-xl font-bold">Quick Actions</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className={`group relative p-5 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                      action.primary 
                        ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 hover:border-purple-400 hover:shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    {/* Background Gradient on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <div className="relative">
                      <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${action.gradient} mb-3`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Overview */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 md:p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg md:text-xl font-bold">Overview</h2>
              </div>

              <div className="space-y-4">
                {/* Progress Bars */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Projects Published</span>
                    <span className="text-sm font-semibold text-gray-800">{projectsCount ?? 0}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((projectsCount ?? 0) * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Messages Received</span>
                    <span className="text-sm font-semibold text-gray-800">{messagesCount ?? 0}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((messagesCount ?? 0) * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Portfolio Completion</span>
                    <span className="text-sm font-semibold text-gray-800">85%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Portfolio Live</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your portfolio is active and receiving traffic
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Projects */}
          <div className="glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg md:text-xl font-bold">Recent Projects</h2>
              </div>
              <Link href="/admin/projects" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All
              </Link>
            </div>

            {recentProjects && recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate text-sm md:text-base">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(project.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <Link 
                        href={`/admin/projects/edit/${project.id}`}
                        className="ml-3 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FolderKanban className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No projects yet</p>
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div className="glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg md:text-xl font-bold">Recent Messages</h2>
              </div>
              <Link href="/admin/messages" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All
              </Link>
            </div>

            {recentMessages && recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((message, index) => (
                  <div 
                    key={message.id}
                    className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate text-sm md:text-base">
                          {message.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 truncate">
                            {message.email}
                          </span>
                        </div>
                      </div>
                      <Link 
                        href={`/admin/messages/${message.id}`}
                        className="ml-3 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}