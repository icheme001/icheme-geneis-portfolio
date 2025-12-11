// app/admin/settings/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Settings, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Key
} from "lucide-react";

export default function AdminSettingsPage() {
  // Profile Settings
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileStatus(null);

    try {
      const res = await fetch("/api/admin/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });

      const data = await res.json();
      
      if (data.success) {
        setProfileStatus("success");
        setTimeout(() => setProfileStatus(null), 3000);
      } else {
        setProfileStatus("error");
      }
    } catch (err) {
      console.error(err);
      setProfileStatus("error");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordStatus(null);
    setPasswordError(null);

    // Validation
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setPasswordStatus("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordStatus(null), 3000);
      } else {
        setPasswordError(data.error || "Failed to change password");
        setPasswordStatus("error");
      }
    } catch (err) {
      console.error(err);
      setPasswordError("Server error occurred");
      setPasswordStatus("error");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Settings
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  id="name" 
                  type="text"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input 
                  id="email" 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* Status Message */}
              {profileStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Profile updated successfully!
                    </p>
                  </div>
                </div>
              )}

              {profileStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium text-red-800">
                      Failed to update profile
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={profileLoading || (!name && !email)}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Change */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  <Key className="w-4 h-4 inline mr-1" />
                  Current Password
                </label>
                <div className="relative">
                  <input 
                    id="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle current password visibility"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  New Password
                </label>
                <div className="relative">
                  <input 
                    id="newPassword" 
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle new password visibility"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-medium text-red-800">
                      {passwordError}
                    </p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {passwordStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-800">
                      Password changed successfully!
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Notice */}
          <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Security Recommendations
                </h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Use a strong, unique password with letters, numbers, and symbols</li>
                  <li>Change your password regularly</li>
                  <li>Never share your credentials with anyone</li>
                  <li>Enable two-factor authentication when available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}