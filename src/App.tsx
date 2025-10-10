import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './config/firebase';
import Dashboard from './components/Dashboard';
import Timesheet from './components/Timesheet';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import { AttendanceRecord } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'attendanceRecords'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records: AttendanceRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as AttendanceRecord);
      });
      setAttendanceRecords(records);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />;
      case 'timesheet':
        return <Timesheet attendanceRecords={attendanceRecords} />;
      case 'reports':
        return <Reports attendanceRecords={attendanceRecords} />;
      default:
        return <Dashboard attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />;
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;