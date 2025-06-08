import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Leaf, User, LogOut, Bell } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      approver: 'bg-blue-100 text-blue-800',
      data_entry: 'bg-green-100 text-green-800',
      basic_user: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Admin',
      approver: 'Approver',
      data_entry: 'Data Entry',
      basic_user: 'User'
    };
    return labels[role as keyof typeof labels] || 'User';
  };

  return (
    <header className="bg-white shadow-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PlantGuard</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button className="bg-gray-300 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <User className="h-8 w-8 rounded-full p-1" />
                  </button>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}