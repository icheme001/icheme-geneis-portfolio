// app/admin/messages/MessageList.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  Calendar,
  User,
  Star,
  MoreVertical,
  Reply
} from "lucide-react";

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read?: boolean;
};

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  // Toggle message selection
  const toggleSelection = (id: number) => {
    setSelectedMessages(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  // Toggle message expansion
  const toggleExpand = (id: number) => {
    setExpandedMessage(prev => prev === id ? null : id);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Truncate message
  const truncateMessage = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-2">
      {messages.map((message, index) => {
        const isExpanded = expandedMessage === message.id;
        const isSelected = selectedMessages.includes(message.id);

        return (
          <div
            key={message.id}
            className={`
              group bg-white border rounded-xl transition-all duration-200 overflow-hidden
              ${isSelected ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}
              ${!message.read ? 'border-l-4 border-l-blue-500' : ''}
              fade-in-up
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Message Header */}
            <div className="flex items-start gap-3 p-4 md:p-5">
              {/* Checkbox */}
              <div className="flex-shrink-0 pt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(message.id)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  aria-label={`Select message from ${message.name}`}
                  title={`Select message from ${message.name}`}
                />
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                {/* Sender Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-gray-800 truncate text-sm md:text-base ${!message.read ? 'font-bold' : ''}`}>
                        {message.name}
                      </h3>
                      {!message.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {message.email}
                    </p>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span className="hidden sm:inline">{formatDate(message.created_at)}</span>
                    </div>

                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Star message"
                    >
                      <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                    </button>

                    <button
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Message Preview/Full */}
                <div className="mb-3">
                  <p className={`text-sm text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {isExpanded ? message.message : truncateMessage(message.message, 120)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleExpand(message.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>

                  <a
                    href={`mailto:${message.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </a>

                  <Link
                    href={`/admin/messages/${message.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MailOpen className="w-3.5 h-3.5" />
                    View Details
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm('Delete this message?')) {
                        // Handle delete
                        console.log('Delete message:', message.id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content Border */}
            {isExpanded && (
              <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-gray-100">
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Full Message</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>

                {/* Additional metadata */}
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{message.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(message.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Bulk Actions (when messages are selected) */}
      {selectedMessages.length > 0 && (
        <div className="sticky bottom-4 glass-card p-4 border-2 border-purple-300 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-800">
                {selectedMessages.length} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Mark as Read
              </button>
              <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedMessages([])}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}