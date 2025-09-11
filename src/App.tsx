import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Timesheet from './components/Timesheet';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AttendanceRecord } from './types';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load attendance records from localStorage
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    }
  }, []);

  useEffect(() => {
    // Save attendance records to localStorage whenever they change
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const handleLogin = (user: any) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;