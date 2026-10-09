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
import { supabase } from './services/supabaseClient';

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, name: 'Guest', email: '' });
  // Always land on Landing Page first as requested by user!
  const [activePage, setActivePage] = useState('landing');
  
  // Data States
  const [records, setRecords] = useState(() => mockStore.getRecords());
  const [shares, setShares] = useState(() => mockStore.getShares());
  const [logs, setLogs] = useState(() => mockStore.getLogs());
  const [aiSummary, setAiSummary] = useState(() => mockStore.getAISummary());
  const [doctorToken, setDoctorToken] = useState('mt-dr-ahmed-8821');

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [activeShareData, setActiveShareData] = useState(null);
  const [preSelectedShareRecordId, setPreSelectedShareRecordId] = useState(null);

  // Sync session with Supabase Auth
  useEffect(() => {
    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          isLoggedIn: true
        });
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          isLoggedIn: true
        });
      } else {
        setUser({ isLoggedIn: false, name: 'Guest', email: '' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshData = () => {
    setRecords(mockStore.getRecords());
    setShares(mockStore.getShares());
    setLogs(mockStore.getLogs());
    setAiSummary(mockStore.getAISummary());
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActivePage('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser({ isLoggedIn: false, name: 'Guest', email: '' });
    setActivePage('landing');
  };

  const handleAddRecord = (recordData) => {
    mockStore.addRecord(recordData);
    refreshData();
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this record from your vault?')) {
      mockStore.deleteRecord(id);
      refreshData();
    }
  };

  const handleCreateShare = (shareConfig) => {
    const newShare = mockStore.createShare(shareConfig);
    setActiveShareData(newShare);
    setIsQRCodeModalOpen(true);
    refreshData();
  };

  const handleRevokeShare = (shareId) => {
    mockStore.revokeShare(shareId);
    refreshData();
  };

  const handleOpenDoctorPortal = (token) => {
    setDoctorToken(token || 'mt-dr-ahmed-8821');
    setActivePage('doctor-demo');
  };

  const handleOpenShareWithRecord = (recordId) => {
    setPreSelectedShareRecordId(recordId);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Global Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
        activeShareCount={shares.filter(s => s.status === 'active').length}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage 
            setActivePage={setActivePage} 
            isLoggedIn={user.isLoggedIn} 
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'signup' && (
          <SignupPage
            onLoginSuccess={handleLoginSuccess}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            records={records}
            shares={shares}
            logs={logs}
            user={user}
            setActivePage={setActivePage}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenShare={(id) => handleOpenShareWithRecord(id)}
            onViewRecord={(rec) => setViewingRecord(rec)}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {activePage === 'vault' && (
          <VaultPage
            records={records}
            onViewRecord={(rec) => setViewingRecord(rec)}
            onDeleteRecord={handleDeleteRecord}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenShareBatch={(recordIds) => handleOpenShareWithRecord(recordIds[0])}
          />
        )}

        {activePage === 'timeline' && (
          <TimelinePage
            records={records}
            onViewRecord={(rec) => setViewingRecord(rec)}
            onShareRecord={(rec) => handleOpenShareWithRecord(rec.id)}
          />
        )}

        {activePage === 'ai-summary' && (
          <AISummaryPage
            aiSummaryData={aiSummary}
            onRegenerate={refreshData}
          />
        )}

        {activePage === 'share-records' && (
          <ShareRecordsPage
            onOpenShareModal={() => setIsShareModalOpen(true)}
            setActivePage={setActivePage}
            activeShares={shares.filter(s => s.status === 'active')}
          />
        )}

        {activePage === 'active-shares' && (
          <ActiveSharesPage
            shares={shares}
            onRevokeShare={handleRevokeShare}
            onOpenDoctorPortal={handleOpenDoctorPortal}
          />
        )}

        {activePage === 'activity' && (
          <ActivityHistoryPage logs={logs} />
        )}

        {activePage === 'doctor-demo' && (
          <DoctorViewPage
            token={doctorToken}
            getShareByToken={mockStore.getShareByToken}
            allRecords={records}
            onBackToPatientPortal={() => setActivePage('dashboard')}
          />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyPage />
        )}

        {activePage === 'terms' && (
          <TermsConditionsPage />
        )}
      </main>

      {/* Global Modals */}
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

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
