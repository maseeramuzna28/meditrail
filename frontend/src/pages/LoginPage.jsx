import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage({ onLogin, onDemoLogin, setActivePage }) {
  const [email, setEmail] = useState('alex.mercer@meditrail.org');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold mx-auto shadow-sm">
            <Shield className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to manage your medical records vault</p>
        </div>

        {/* 1-Click Demo Access Banner */}
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl space-y-2 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-teal-800 text-xs font-bold">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Hackathon Judge Quick-Access</span>
          </div>
          <p className="text-[11px] text-teal-700">Jump directly into the pre-loaded patient vault with sample medical records</p>
          <button
            type="button"
            onClick={onDemoLogin}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>1-Click Patient Demo Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400">or sign in with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Standard Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Sign In to Patient Portal
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => setActivePage('signup')} className="text-teal-600 hover:underline font-semibold">
            Create account
          </button>
        </div>

      </div>
    </div>
  );
}
