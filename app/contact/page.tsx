// app/contact/page.tsx
"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  XCircle,
  Linkedin,
  Github,
  Twitter,
  Loader2,
  Zap,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | "sending" | "success" | "error">(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }

    setTimeout(() => setStatus(null), 5000);
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "ichemegenesis@gmail.com",
      link: "mailto:ichemegenesis@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+234 9024694268",
      link: "tel:+2349024694268",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Abuja, Nigeria",
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/icheme001",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://linkedin.com/in/yourusername",
    },
    {
      icon: Twitter,
      label: "Twitter",
      url: "https://twitter.com/othellodegreat",
    },
  ];

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="hidden md:block absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="hidden md:block absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header with 3D Effects */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 fade-in-up">
              Get In <span className="gradient-text neon-glow">Touch</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.1s' }}>
              Have a project in mind or just want to say hi? I'd love to hear
              from you. Fill out the form below or reach out through any of my
              social channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Information Cards with 3D Hover */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold mb-4 gradient-text fade-in-up">
                  Contact Info
                </h3>
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="glass-card hover-3d-rotate p-4 md:p-5 fade-in-up group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg shimmer group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                          {info.label}
                        </div>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-sm md:text-base font-medium text-gray-800 hover:text-purple-600 transition-colors break-all group-hover:gradient-text"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <div className="text-sm md:text-base font-medium text-gray-800">
                            {info.value}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links with Magnetic Effect */}
              <div className="glass-card hover-lift p-5 md:p-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
                <h4 className="text-lg font-bold mb-4 gradient-text">Follow Me</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-full shadow-md hover:shadow-xl hover-3d-rotate group glow-border"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors group-hover:rotate-12 duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability Badge with Pulse */}
              <div className="glass-card hover-lift p-5 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 glow-border fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-semibold text-green-700 neon-glow">
                    Available for Work
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Currently accepting new projects and collaborations
                </p>
              </div>
            </div>

            {/* Contact Form with 3D Effects */}
            <div className="lg:col-span-2">
              <div className="glass-card hover-lift p-6 sm:p-8 md:p-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 gradient-text">
                  Send Me a Message
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 md:space-y-6"
                >
                  {/* Name Input with Focus Animation */}
                  <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Othellodegreat"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-sm md:text-base hover:border-purple-300 hover-lift"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="othellodegreat@gmail.com"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-sm md:text-base hover:border-purple-300 hover-lift"
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      placeholder="Tell me about your project or just say hello..."
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none resize-none text-sm md:text-base hover:border-purple-300 hover-lift"
                    />
                  </div>

                  {/* Submit Button with Ripple */}
                  <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="btn-primary ripple w-full sm:w-auto text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message{" "}
                          <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Status Messages with Enhanced Animation */}
                    {status === "success" && (
                      <div className="mt-4 glass-card p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3 animate-fade-in hover-lift">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '1s' }} />
                        <div>
                          <div className="text-sm font-semibold text-green-800">
                            Message Sent Successfully! 🎉
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Thanks for reaching out. I'll get back to you as
                            soon as possible.
                          </div>
                        </div>
                      </div>
                    )}

                    {status === "error" && (
                      <div className="mt-4 glass-card p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 animate-fade-in hover-lift">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-semibold text-red-800">
                            Failed to Send Message
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            Something went wrong. Please try again or contact me
                            directly via email.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Additional Info with Animated Icon */}
              <div className="mt-6 glass-card hover-lift p-4 md:p-5 bg-gradient-to-r from-purple-50 to-blue-50 glow-border fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl shimmer floating">⚡</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 mb-1 gradient-text">
                      Quick Response Time
                    </div>
                    <div className="text-xs text-gray-600">
                      I typically respond within 24 hours during business days.
                      For urgent inquiries, please mention "URGENT" in your
                      message subject.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}