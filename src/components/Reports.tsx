import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Clock, BarChart3, PieChart } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface ReportsProps {
  attendanceRecords: AttendanceRecord[];
}

const Reports: React.FC<ReportsProps> = ({ attendanceRecords }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2022, 2023, 2024, 2025];

  const getFilteredRecords = () => {
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      
      if (selectedPeriod === 'monthly') {
        return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
      } else if (selectedPeriod === 'yearly') {
        return recordDate.getFullYear() === selectedYear;
      }
      
      return true; // For weekly and quarterly, return all for now
    });
  };

  const generateReport = (format: 'csv' | 'excel') => {
    const filteredRecords = getFilteredRecords();
    
    if (format === 'csv') {
      const csvContent = [
        ['Date', 'Clock In', 'Clock Out', 'Total Hours', 'Status', 'Notes'],
        ...filteredRecords.map(record => [
          record.date,
          record.clockIn || '',
          record.clockOut || '',
          record.totalHours.toString(),
          record.status,
          record.notes || ''
        ])
      ];
      
      const csvString = csvContent.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${selectedPeriod}-${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getDashboardStats = () => {
    const filteredRecords = getFilteredRecords();
    
    return {
      totalHours: filteredRecords.reduce((sum, record) => sum + record.totalHours, 0),
      averageHours: filteredRecords.length > 0 ? 
        filteredRecords.reduce((sum, record) => sum + record.totalHours, 0) / filteredRecords.length : 0,
      presentDays: filteredRecords.filter(record => record.status === 'present').length,
      attendanceRate: filteredRecords.length > 0 ? 
        (filteredRecords.filter(record => record.status === 'present').length / filteredRecords.length) * 100 : 0
    };
  };

  const getMonthlyData = () => {
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === i && recordDate.getFullYear() === selectedYear;
      });
      
      const totalHours = monthRecords.reduce((sum, record) => sum + record.totalHours, 0);
      monthlyData.push({
        month: months[i].substring(0, 3),
        hours: totalHours,
        target: 160 // 8 hours * 20 working days
      });
    }
    return monthlyData;
  };

  const getAttendanceBreakdown = () => {
    const filteredRecords = getFilteredRecords();
    const breakdown = {
      present: filteredRecords.filter(r => r.status === 'present').length,
      late: filteredRecords.filter(r => r.status === 'late').length,
      absent: filteredRecords.filter(r => r.status === 'absent').length,
      earlyLeave: filteredRecords.filter(r => r.status === 'early_leave').length
    };
    
    const total = Object.values(breakdown).reduce((sum, count) => sum + count, 0);
    
    return [
      { status: 'Present', count: breakdown.present, percentage: total > 0 ? Math.round((breakdown.present / total) * 100) : 0 },
      { status: 'Late', count: breakdown.late, percentage: total > 0 ? Math.round((breakdown.late / total) * 100) : 0 },
      { status: 'Absent', count: breakdown.absent, percentage: total > 0 ? Math.round((breakdown.absent / total) * 100) : 0 },
      { status: 'Early Leave', count: breakdown.earlyLeave, percentage: total > 0 ? Math.round((breakdown.earlyLeave / total) * 100) : 0 }
    ];
  };

  const stats = getDashboardStats();
  const monthlyData = getMonthlyData();
  const attendanceBreakdown = getAttendanceBreakdown();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive attendance and productivity insights</p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => generateReport('csv')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </button>
          <button
            onClick={() => generateReport('excel')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Report Period:</span>
          </div>
          
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>{period.label}</option>
            ))}
          </select>

          {selectedPeriod === 'monthly' && (
            <>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>

              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours.toFixed(1)}h</p>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="text-xs text-green-600 mt-1">+5.2% vs last period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.averageHours.toFixed(1)}h</p>
              <p className="text-sm text-gray-600">Avg Daily Hours</p>
              <p className="text-xs text-blue-600 mt-1">Target: 8.0h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.presentDays}</p>
              <p className="text-sm text-gray-600">Days Present</p>
              <p className="text-xs text-green-600 mt-1">Excellent attendance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-xs text-green-600 mt-1">Above target</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Hours Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Monthly Hours ({selectedYear})
            </h3>
            <div className="flex space-x-2">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                Actual Hours
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                Target Hours
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div 
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${Math.max((item.hours / 200) * 200, 4)}px` }}
                  ></div>
                  <div 
                    className="w-8 bg-gray-300 rounded-t opacity-50"
                    style={{ height: `${(item.target / 200) * 200}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Attendance Breakdown
            </h3>
          </div>
          
          <div className="space-y-4">
            {attendanceBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-3 ${
                    item.status === 'Present' ? 'bg-green-500' :
                    item.status === 'Late' ? 'bg-yellow-500' :
                    item.status === 'Absent' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Days: {attendanceBreakdown.reduce((sum, item) => sum + item.count, 0)}</p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                {stats.attendanceRate > 90 ? 'Excellent Performance' : 
                 stats.attendanceRate > 80 ? 'Good Performance' : 
                 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Average Daily Hours</h4>
            <p className="text-sm text-blue-700">
              You're averaging {stats.averageHours.toFixed(1)} hours per day
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Attendance Consistency</h4>
            <p className="text-sm text-green-700">
              {stats.attendanceRate.toFixed(1)}% attendance rate this period
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Total Hours Tracked</h4>
            <p className="text-sm text-purple-700">
              {stats.totalHours.toFixed(1)} hours logged in selected period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;