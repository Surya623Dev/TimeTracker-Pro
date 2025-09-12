import React, { useState, useEffect } from 'react';
import { Clock, Calendar, BarChart3 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Timesheet from './components/Timesheet';
import Reports from './components/Reports';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { AttendanceRecord } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

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

export default App;