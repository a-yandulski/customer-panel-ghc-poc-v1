import React from 'react';
import clsx from 'clsx';
import { Icon } from '../atoms';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  badge?: number;
}

export interface NavigationBarProps {
  items: NavigationItem[];
  onItemClick: (item: NavigationItem) => void;
  userMenuOpen?: boolean;
  onUserMenuToggle?: () => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  userName?: string;
  userEmail?: string;
}

/**
 * Navigation Bar Component
 * 
 * Implements the UI specification for navigation:
 * - Default: Primary background (#2563eb), white text, selected item accent (#38bdf8)
 * - Hover: Slightly lighter background for hovered item
 * - Active: Selected item highlighted with accent border
 * 
 * Typography: Inter, 16px, 500 weight
 * Sizing: Height 64px, item padding 16px vertical, 24px horizontal
 * Accessibility: Keyboard navigation, visible focus indicator, ARIA roles
 */
export const NavigationBar: React.FC<NavigationBarProps> = ({
  items,
  onItemClick,
  userMenuOpen = false,
  onUserMenuToggle,
  notificationCount = 0,
  onNotificationClick,
  userName = 'User',
  userEmail = 'user@example.com',
}) => {
  const handleItemClick = (item: NavigationItem) => {
    onItemClick(item);
  };

  return (
    <nav 
      className="bg-blue-600 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Customer Panel</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={clsx(
                    'inline-flex items-center px-6 py-4 text-base font-medium rounded-md',
                    'transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-blue-600',
                    {
                      'bg-sky-400 text-white border-b-2 border-sky-300': item.active,
                      'text-blue-100 hover:bg-blue-500 hover:text-white': !item.active,
                    }
                  )}
                  aria-current={item.active ? 'page' : undefined}
                >
                  <Icon 
                    name={item.icon} 
                    size="sm" 
                    className="mr-2" 
                    aria-hidden={true}
                  />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notification Button */}
            <button
              onClick={onNotificationClick}
              className={clsx(
                'relative p-2 rounded-full text-blue-100 hover:text-white hover:bg-blue-500',
                'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-blue-600',
                'transition-colors duration-200'
              )}
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            >
              <Icon 
                name="bell" 
                size="md" 
                className={notificationCount > 0 ? 'text-sky-300' : 'text-blue-100'}
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={onUserMenuToggle}
                className={clsx(
                  'flex items-center space-x-3 p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-500',
                  'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-blue-600',
                  'transition-colors duration-200'
                )}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center">
                  <Icon name="user" size="sm" className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-blue-200">{userEmail}</div>
                </div>
                <Icon 
                  name="chevron-down" 
                  size="sm" 
                  className={clsx(
                    'transition-transform duration-200',
                    userMenuOpen ? 'rotate-180' : 'rotate-0'
                  )}
                />
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Security Settings
                  </a>
                  <hr className="border-gray-200 my-1" />
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="md:hidden border-t border-blue-500">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item) => (
            <button
              key={`mobile-${item.id}`}
              onClick={() => handleItemClick(item)}
              className={clsx(
                'flex items-center w-full px-3 py-2 text-base font-medium rounded-md',
                'transition-colors duration-200 ease-in-out',
                {
                  'bg-sky-400 text-white': item.active,
                  'text-blue-100 hover:bg-blue-500 hover:text-white': !item.active,
                }
              )}
              aria-current={item.active ? 'page' : undefined}
            >
              <Icon 
                name={item.icon} 
                size="sm" 
                className="mr-3" 
                aria-hidden={true}
              />
              {item.label}
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
