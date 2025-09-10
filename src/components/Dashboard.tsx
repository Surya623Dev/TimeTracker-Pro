import React, { useState, useEffect } from 'react';
import { Clock, Calendar, TrendingUp, Users, Play, Square, AlertCircle } from 'lucide-react';
import { User, AttendanceRecord } from '../types';

interface DashboardProps {
  user: User;
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, attendanceRecords, setAttendanceRecords }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorking, setIsWorking] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendanceRecords.find(r => r.userId === user.id && r.date === today);
    setTodayRecord(record || null);
    setIsWorking(record?.clockIn && !record?.clockOut);
  }, [attendanceRecords, user.id]);

  const handleClockInOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentTimeStr = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (!isWorking) {
      // Clock In
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        userId: user.id,
        date: today,
        clockIn: currentTimeStr,
        totalHours: 0,
        status: 'present',
        notes: ''
      };
      setAttendanceRecords(prev => [...prev, newRecord]);
      setIsWorking(true);
    } else {
      // Clock Out
      setAttendanceRecords(prev => prev.map(record => {
        if (record.userId === user.id && record.date === today && !record.clockOut) {
          const clockInTime = new Date(`${today} ${record.clockIn}`);
          const clockOutTime = new Date(`${today} ${currentTimeStr}`);
          const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
          
          return {
            ...record,
            clockOut: currentTimeStr,
            totalHours: Math.round(totalHours * 100) / 100
          };
        }
        return record;
      }));
      setIsWorking(false);
    }
  };

  const getCurrentWorkingHours = () => {
    if (todayRecord?.clockIn && !todayRecord?.clockOut) {
      const clockInTime = new Date(`${todayRecord.date} ${todayRecord.clockIn}`);
      const now = new Date();
      const hours = (now.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
      return Math.round(hours * 100) / 100;
    }
    return todayRecord?.totalHours || 0;
  };

  const getWeeklyHours = () => {
    const thisWeekRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      return recordDate >= weekStart && record.userId === user.id;
    });
    
    return thisWeekRecords.reduce((total, record) => total + record.totalHours, 0);
  };

  const getMonthlyHours = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return attendanceRecords
      .filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === thisMonth && 
               recordDate.getFullYear() === thisYear && 
               record.userId === user.id;
      })
      .reduce((total, record) => total + record.totalHours, 0);
  };

  const stats = [
    {
      title: 'Today\'s Hours',
      value: getCurrentWorkingHours().toFixed(1),
      unit: 'hrs',
      icon: Clock,
      color: 'bg-blue-500',
      change: '+0.5 from yesterday'
    },
    {
      title: 'Weekly Hours',
      value: getWeeklyHours().toFixed(1),
      unit: 'hrs',
      icon: Calendar,
      color: 'bg-green-500',
      change: '+2.3 from last week'
    },
    {
      title: 'Monthly Hours',
      value: getMonthlyHours().toFixed(1),
      unit: 'hrs',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15.7 from last month'
    },
    {
      title: 'Attendance Rate',
      value: '98.5',
      unit: '%',
      icon: Users,
      color: 'bg-orange-500',
      change: '+1.2 from last month'
    }
  ];

  const recentActivity = [
    { time: '09:00 AM', action: 'Clocked in', status: 'success' },
    { time: '12:30 PM', action: 'Break started', status: 'info' },
    { time: '01:00 PM', action: 'Break ended', status: 'info' },
    { time: '05:30 PM', action: 'Clocked out', status: 'success' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your attendance and manage your time effectively</p>
        </div>
        
        {/* Clock In/Out Button */}
        <div className="mt-4 lg:mt-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: true, 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <button
                onClick={handleClockInOut}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isWorking 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isWorking ? (
                  <>
                    <Square className="w-5 h-5 mr-2" />
                    Clock Out
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Clock In
                  </>
                )}
              </button>
              
              {isWorking && (
                <div className="mt-3 text-sm text-green-600 font-medium">
                  ● Working since {todayRecord?.clockIn}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                    <span className="text-lg text-gray-500 ml-1">{stat.unit}</span>
                  </p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">Request Leave</p>
                <p className="text-sm text-gray-500">Apply for time off</p>
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">View Timesheet</p>
                <p className="text-sm text-gray-500">Check your hours</p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900">Download Report</p>
                <p className="text-sm text-gray-500">Export attendance data</p>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {isWorking && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-green-900">Currently Working</h4>
              <p className="text-sm text-green-700">
                You clocked in at {todayRecord?.clockIn}. Don't forget to clock out when you're done.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;