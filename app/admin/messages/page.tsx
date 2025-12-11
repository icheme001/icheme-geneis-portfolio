// app/admin/messages/page.tsx
import MessageList from "./MessageList";
import { supabase } from "@/app/(lib)/supabaseClient";
import AdminHeader from "../../(components)/AdminHeader";
import {
  MessageSquare,
  Inbox,
  Mail,
  MailOpen,
  AlertCircle,
  TrendingUp,
  Clock
} from "lucide-react";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read?: boolean;
};

export default async function MessagesPage() {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <AdminHeader title="Messages" />
          <div className="glass-card p-8 md:p-12 text-center">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Failed to Load Messages
            </h3>
            <p className="text-gray-600 mb-6">
              There was an error loading your messages. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalMessages = messages?.length || 0;
  const unreadMessages = messages?.filter((m: Message) => !m.read).length || 0;
  const todayMessages = messages?.filter((m: Message) => {
    const today = new Date().toDateString();
    const messageDate = new Date(m.created_at).toDateString();
    return today === messageDate;
  }).length || 0;

  const stats = [
    {
      title: "Total Messages",
      value: totalMessages,
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Unread",
      value: unreadMessages,
      icon: Mail,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Today",
      value: todayMessages,
      icon: Clock,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Response Rate",
      value: "94%",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <AdminHeader title="Messages" />
          <p className="text-sm md:text-base text-gray-600 mt-2">
            View and manage contact form submissions from your portfolio visitors.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-4 md:p-6 hover-lift fade-in-up group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex p-2.5 md:p-3 rounded-xl ${stat.bgColor} mb-3 md:mb-4`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.textColor}`} />
                </div>

                {/* Value */}
                <div className="mb-1 md:mb-2">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                </div>

                {/* Title */}
                <p className="text-xs md:text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Messages Section */}
        <div className="glass-card p-4 md:p-6 lg:p-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                All Messages
              </h2>
              {unreadMessages > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                  {unreadMessages} new
                </span>
              )}
            </div>

            {/* Filter/Sort Options (Optional) */}
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                All
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Unread
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Starred
              </button>
            </div>
          </div>

          {/* Messages List */}
          {messages && messages.length > 0 ? (
            <MessageList messages={messages} />
          ) : (
            /* Empty State */
            <div className="text-center py-12 md:py-16">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <MailOpen className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                No Messages Yet
              </h3>
              <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto">
                When visitors submit the contact form on your portfolio, their messages will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        {messages && messages.length > 0 && (
          <div className="mt-6 md:mt-8 glass-card p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>
                  Showing <strong>{messages.length}</strong> message{messages.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  Mark All as Read
                </button>
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}