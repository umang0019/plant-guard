import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Bug,
  Leaf,
  Heart,
  Upload,
  CheckCircle,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['admin', 'approver', 'data_entry', 'basic_user'] },
  { name: 'Diseases', href: '/diseases', icon: Leaf, roles: ['admin', 'approver', 'data_entry', 'basic_user'] },
  { name: 'Pests', href: '/pests', icon: Bug, roles: ['admin', 'approver', 'data_entry', 'basic_user'] },
  { name: 'Natural Remedies', href: '/remedies', icon: Heart, roles: ['admin', 'approver', 'data_entry', 'basic_user'] },
  { name: 'Data Entry', href: '/data-entry', icon: Upload, roles: ['admin', 'data_entry'] },
  { name: 'Approvals', href: '/approvals', icon: CheckCircle, roles: ['admin', 'approver'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'approver'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  { name: 'Help & Support', href: '/help', icon: HelpCircle, roles: ['admin', 'approver', 'data_entry', 'basic_user'] }
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredNavigation = navigationItems.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg border-r border-green-100">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-green-100 text-green-800 border-r-4 border-green-600'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`
                }
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}