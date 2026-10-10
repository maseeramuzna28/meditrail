import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Clock, 
  Sparkles, 
  Share2, 
  Activity, 
  Lock, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  ChevronDown,
  Upload,
  User,
  HeartPulse
} from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  user, 
  onLogout, 
  onOpenUpload,
  activeShareCount = 0 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield, protected: true },
    { id: 'vault', label: 'Medical Vault', icon: FileText, protected: true },
    { id: 'timeline', label: 'Medical Timeline', icon: Clock, protected: true },
    { id: 'ai-summary', label: 'AI Health Summary', icon: Sparkles, protected: true },
    { id: 'share-records', label: 'Share With Doctor', icon: Share2, protected: true },
    { id: 'active-shares', label: 'Active Shares', icon: Lock, protected: true, badge: activeShareCount },
    { id: 'activity', label: 'Activity History', icon: Activity, protected: true }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick(user?.isLoggedIn ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-800 transition-colors">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-teal-700 transition-colors">
                    MediTrail
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 rounded">
                    Patient Vault
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Your Medical History. One Secure Trail.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          {user?.isLoggedIn && (
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                      isActive 
                        ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span>{item.label}</span>

                    {/* Active shares notification badge */}
                    {item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {user?.isLoggedIn ? (
              <>
                {/* Quick Action: Upload Record */}
                {onOpenUpload && (
                  <button
                    onClick={onOpenUpload}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-teal-500/20"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Record</span>
                  </button>
                )}

                {/* Patient Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[11px]">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <span className="max-w-[100px] truncate font-semibold text-slate-900">{user.name || 'Patient'}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] font-mono text-slate-500 truncate">{user.email || 'patient@meditrail.org'}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('dashboard');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>Patient Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('activity');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        <span>Security & Access Logs</span>
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-sm transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            {user?.isLoggedIn && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && user?.isLoggedIn && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  isActive 
                    ? 'bg-teal-50 text-teal-800 border border-teal-200' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
