import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, FileText, Settings, LogOut, Bell, BarChart3 } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Timesheet from './components/Timesheet';
import LeaveManagement from './components/LeaveManagement';
import Reports from './components/Reports';
import UserSettings from './components/UserSettings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { User, AttendanceRecord } from './types';

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'admin@company.com', role: 'admin', department: 'IT' },
  { id: '2', name: 'Jane Smith', email: 'manager@company.com', role: 'manager', department: 'HR' },
  { id: '3', name: 'Mike Johnson', email: 'employee@company.com', role: 'employee', department: 'Sales' }
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Load mock attendance data
    const mockAttendance: AttendanceRecord[] = [
      {
        id: '1',
        userId: '1',
        date: '2024-01-15',
        clockIn: '09:00',
        clockOut: '17:30',
        totalHours: 8.5,
        status: 'present',
        notes: ''
      },
      {
        id: '2',
        userId: '1',
        date: '2024-01-14',
        clockIn: '08:45',
        clockOut: '17:15',
        totalHours: 8.5,
        status: 'present',
        notes: ''
      }
    ];
    setAttendanceRecords(mockAttendance);
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser!} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />;
      case 'timesheet':
        return <Timesheet user={currentUser!} attendanceRecords={attendanceRecords} />;
      case 'leaves':
        return <LeaveManagement user={currentUser!} />;
      case 'reports':
        return <Reports user={currentUser!} attendanceRecords={attendanceRecords} />;
      case 'settings':
        return <UserSettings user={currentUser!} />;
      default:
        return <Dashboard user={currentUser!} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />;
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} userRole={currentUser.role} />
      
      <div className="flex-1 flex flex-col">
        <Header user={currentUser} onLogout={handleLogout} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;