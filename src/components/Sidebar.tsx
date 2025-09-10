import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  FileText, 
  Settings,
  Users,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: 'admin' | 'manager' | 'employee';
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
    { id: 'timesheet', label: 'Timesheet', icon: Clock, roles: ['admin', 'manager', 'employee'] },
    { id: 'leaves', label: 'Leave Management', icon: Calendar, roles: ['admin', 'manager', 'employee'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'manager'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'manager'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager', 'employee'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">TimeTracker</h1>
            <p className="text-sm text-gray-500">Pro</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2024 TimeTracker Pro</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;