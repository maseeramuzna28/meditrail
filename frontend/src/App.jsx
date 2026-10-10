import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadModal from './components/UploadModal';
import DocumentViewerModal from './components/DocumentViewerModal';
import ShareModal from './components/ShareModal';
import QRCodeModal from './components/QRCodeModal';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import VaultPage from './pages/VaultPage';
import TimelinePage from './pages/TimelinePage';
import AISummaryPage from './pages/AISummaryPage';
import ShareRecordsPage from './pages/ShareRecordsPage';
import ActiveSharesPage from './pages/ActiveSharesPage';
import ActivityHistoryPage from './pages/ActivityHistoryPage';
import DoctorViewPage from './pages/DoctorViewPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';

import { mockStore } from './services/mockStore';
import { apiService } from './services/apiService';
import { supabase } from './services/supabaseClient';

// List of pages that STRICTLY REQUIRE LOGIN
const PROTECTED_PAGES = [
  'dashboard',
  'vault',
  'timeline',
  'ai-summary',
  'share-records',
  'active-shares',
  'activity'
];

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, name: 'Guest', email: '', id: null });
  const [activePage, setActivePage] = useState('landing');
  const [authErrorAlert, setAuthErrorAlert] = useState('');
  
  // Per-User Data States
  const [records, setRecords] = useState([]);
  const [shares, setShares] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aiSummary, setAiSummary] = useState({});
  const [doctorToken, setDoctorToken] = useState('');

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [activeShareData, setActiveShareData] = useState(null);
  const [preSelectedShareRecordId, setPreSelectedShareRecordId] = useState(null);

  // Sync state helpers scoped to current user
  const loadUserData = async (userId) => {
    if (!userId) {
      setRecords([]);
      setShares([]);
      setLogs([]);
      setAiSummary({});
      return;
    }
    const userRecs = await apiService.getRecords(userId);
    const userShares = await apiService.getShares(userId);
    const userLogs = await apiService.getLogs(userId);
    const userSummary = await apiService.getAISummary(userId);

    setRecords(userRecs);
    setShares(userShares);
    setLogs(userLogs);
    setAiSummary(userSummary);
  };

  // Sync session with Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const currentUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          isLoggedIn: true
        };
        setUser(currentUser);
        loadUserData(currentUser.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const currentUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          isLoggedIn: true
        };
        setUser(currentUser);
        loadUserData(currentUser.id);
      } else {
        setUser({ isLoggedIn: false, name: 'Guest', email: '', id: null });
        loadUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protected Route Navigation Guard
  const navigateTo = (pageId) => {
    if (PROTECTED_PAGES.includes(pageId) && !user.isLoggedIn) {
      setAuthErrorAlert('Authentication required: Please sign in to access your personal medical vault.');
      setActivePage('login');
      return;
    }
    setAuthErrorAlert('');
    setActivePage(pageId);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    loadUserData(userData.id);
    setAuthErrorAlert('');
    setActivePage('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser({ isLoggedIn: false, name: 'Guest', email: '', id: null });
    loadUserData(null);
    setActivePage('landing');
  };

  const handleAddRecord = async (recordData) => {
    if (!user.id) return;
    const added = await apiService.addRecord(user.id, recordData);
    if (added) {
      setRecords(prev => [added, ...prev.filter(r => r.id !== added.id)]);
    }
    await loadUserData(user.id);
  };

  const handleDeleteRecord = async (id) => {
    if (!user.id) return;
    if (window.confirm('Are you sure you want to delete this record from your vault?')) {
      await apiService.deleteRecord(user.id, id);
      loadUserData(user.id);
    }
  };

  const handleCreateShare = async (shareConfig) => {
    if (!user.id) return;
    const newShare = await apiService.createShare(user.id, shareConfig);
    setActiveShareData(newShare);
    setIsQRCodeModalOpen(true);
    loadUserData(user.id);
  };

  const handleRevokeShare = async (shareId) => {
    if (!user.id) return;
    await apiService.revokeShare(user.id, shareId);
    loadUserData(user.id);
  };

  const handleOpenDoctorPortal = (token) => {
    setDoctorToken(token || 'mt-dr-ahmed-8821');
    setActivePage('doctor-demo');
  };

  const handleOpenShareWithRecord = (recordId) => {
    if (!user.isLoggedIn) {
      navigateTo('login');
      return;
    }
    setPreSelectedShareRecordId(recordId);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Global Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={navigateTo}
        user={user}
        onLogout={handleLogout}
        activeShareCount={shares.filter(s => s.status === 'active').length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        
        {/* Auth Error Notification Banner */}
        {authErrorAlert && activePage === 'login' && (
          <div className="max-w-md mx-auto mt-6 px-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <span>🔒 {authErrorAlert}</span>
            </div>
          </div>
        )}

        {activePage === 'landing' && (
          <LandingPage 
            setActivePage={navigateTo} 
            isLoggedIn={user.isLoggedIn} 
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            setActivePage={navigateTo}
          />
        )}

        {activePage === 'signup' && (
          <SignupPage
            onLoginSuccess={handleLoginSuccess}
            setActivePage={navigateTo}
          />
        )}

        {/* PROTECTED ROUTES */}
        {user.isLoggedIn && activePage === 'dashboard' && (
          <DashboardPage
            records={records}
            shares={shares}
            logs={logs}
            user={user}
            setActivePage={navigateTo}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenShare={(id) => handleOpenShareWithRecord(id)}
            onViewRecord={(rec) => setViewingRecord(rec)}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {user.isLoggedIn && activePage === 'vault' && (
          <VaultPage
            records={records}
            onViewRecord={(rec) => setViewingRecord(rec)}
            onDeleteRecord={handleDeleteRecord}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenShareBatch={(recordIds) => handleOpenShareWithRecord(recordIds[0])}
          />
        )}

        {user.isLoggedIn && activePage === 'timeline' && (
          <TimelinePage
            records={records}
            onViewRecord={(rec) => setViewingRecord(rec)}
            onShareRecord={(rec) => handleOpenShareWithRecord(rec.id)}
          />
        )}

        {user.isLoggedIn && activePage === 'ai-summary' && (
          <AISummaryPage
            aiSummaryData={aiSummary}
            onRegenerate={() => loadUserData(user.id)}
          />
        )}

        {user.isLoggedIn && activePage === 'share-records' && (
          <ShareRecordsPage
            onOpenShareModal={() => setIsShareModalOpen(true)}
            setActivePage={navigateTo}
            activeShares={shares.filter(s => s.status === 'active')}
          />
        )}

        {user.isLoggedIn && activePage === 'active-shares' && (
          <ActiveSharesPage
            shares={shares}
            onRevokeShare={handleRevokeShare}
            onOpenDoctorPortal={handleOpenDoctorPortal}
          />
        )}

        {user.isLoggedIn && activePage === 'activity' && (
          <ActivityHistoryPage logs={logs} />
        )}

        {/* Public Doctor Token Portal View */}
        {activePage === 'doctor-demo' && (
          <DoctorViewPage
            token={doctorToken}
            getShareByToken={apiService.getShareByToken}
            allRecords={records}
            onBackToPatientPortal={() => navigateTo('landing')}
          />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyPage />
        )}

        {activePage === 'terms' && (
          <TermsConditionsPage />
        )}
      </main>

      {/* Global Modals (Only active when logged in) */}
      {user.isLoggedIn && (
        <>
          <UploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onUploadSuccess={handleAddRecord}
          />

          <DocumentViewerModal
            record={viewingRecord}
            isOpen={!!viewingRecord}
            onClose={() => setViewingRecord(null)}
            onShareRecord={(rec) => handleOpenShareWithRecord(rec.id)}
          />

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            records={records}
            preSelectedRecordId={preSelectedShareRecordId}
            onCreateShare={handleCreateShare}
          />

          <QRCodeModal
            shareData={activeShareData}
            isOpen={isQRCodeModalOpen}
            onClose={() => setIsQRCodeModalOpen(false)}
            onOpenDoctorPortal={handleOpenDoctorPortal}
          />
        </>
      )}

      {/* Global Footer */}
      <Footer setActivePage={navigateTo} />

    </div>
  );
}
