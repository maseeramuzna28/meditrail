import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  Clock, 
  Sparkles, 
  Share2, 
  Activity, 
  Lock, 
  User, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onLogout, activeShareCount = 1 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'vault', label: 'Medical Vault', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'ai-summary', label: 'AI Health Summary', icon: Sparkles },
    { id: 'share-records', label: 'Share Records', icon: Share2 },
    { id: 'active-shares', label: 'Active Shares', icon: Lock, badge: activeShareCount },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage(user?.isLoggedIn ? 'dashboard' : 'landing')}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Medi<span className="text-teal-600">Trail</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 rounded-md">
                Patient Data Vault
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          {user?.isLoggedIn ? (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-teal-50 text-teal-700 border border-teal-200/80 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="ml-1 px-1.5 py-0.2 text-xs bg-amber-100 text-amber-800 rounded-full font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => setActivePage('landing')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</button>
              <button onClick={() => setActivePage('privacy')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Security & Privacy</button>
            </div>
          )}

          {/* User Profile / Quick Actions */}
          <div className="flex items-center space-x-3">
            {user?.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:inline-block">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActivePage('doctor-demo');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50 flex items-center space-x-2"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>Open Doctor View Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2 border-t border-slate-100"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActivePage('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {user?.isLoggedIn && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && user?.isLoggedIn && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-teal-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
