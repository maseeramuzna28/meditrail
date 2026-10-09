import React from 'react';
import { Shield, Lock, FileCheck } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Medi<span className="text-teal-400">Trail</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your Medical History. One Secure Trail. Patient-controlled digital health records platform designed for maximum privacy and time-bound doctor sharing.
            </p>
            <div className="flex items-center space-x-3 text-xs text-teal-400 bg-slate-800/80 w-fit px-3 py-1.5 rounded-lg border border-slate-700">
              <Lock className="w-3.5 h-3.5" />
              <span>End-to-End Patient Data Sovereignty</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActivePage('vault')} className="hover:text-teal-400 transition-colors">Medical Vault</button>
              </li>
              <li>
                <button onClick={() => setActivePage('timeline')} className="hover:text-teal-400 transition-colors">Medical History Timeline</button>
              </li>
              <li>
                <button onClick={() => setActivePage('ai-summary')} className="hover:text-teal-400 transition-colors">AI Health Summary</button>
              </li>
              <li>
                <button onClick={() => setActivePage('share-records')} className="hover:text-teal-400 transition-colors">Doctor Sharing</button>
              </li>
            </ul>
          </div>

          {/* Security & Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Security & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActivePage('privacy')} className="hover:text-teal-400 transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => setActivePage('terms')} className="hover:text-teal-400 transition-colors">Terms of Service</button>
              </li>
              <li>
                <button onClick={() => setActivePage('activity')} className="hover:text-teal-400 transition-colors">Security Audit Log</button>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediTrail Health Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <span className="flex items-center space-x-1 text-slate-400">
              <FileCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>HIPAA Compliant Architecture</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
