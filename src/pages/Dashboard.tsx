import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, NavigationBar } from '../components';
import { useAppContext } from '../contexts/AppContext';
import type { NavigationItem } from '../components/organisms/NavigationBar';

/**
 * Dashboard Page Component
 * 
 * Implements the dashboard layout from UX requirements:
 * - Personalized welcome message
 * - Service summary (counts of domains, hosting, SSL, etc.)
 * - Upcoming renewals (next 30/60/90 days)
 * - Recent activity feed
 * - Quick action links
 * - Promotional banners
 */
export const Dashboard: React.FC = () => {
  const { state, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Mock navigation items based on UX requirements
  const navigationItems: NavigationItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: 'home', 
      href: '/dashboard', 
      active: location.pathname === '/dashboard' 
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: 'server', 
      href: '/services',
      active: location.pathname === '/services'
    },
    { id: 'domains', label: 'Domains', icon: 'globe', href: '/domains' },
    { id: 'billing', label: 'Billing', icon: 'user', href: '/billing' },
    { id: 'support', label: 'Support', icon: 'bell', href: '/support', badge: 2 },
  ];

  const handleNavItemClick = (item: NavigationItem) => {
    navigate(item.href);
  };

  const handleNotificationClick = () => {
    console.log('Open notifications');
    // Mock marking notifications as read
    state.notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
  };

  // Mock data - in real app this would come from API
  const mockServices = [
    { type: 'Domains', count: 12, icon: 'globe' },
    { type: 'Hosting', count: 3, icon: 'server' },
    { type: 'SSL Certificates', count: 8, icon: 'check-circle' },
    { type: 'Email Accounts', count: 25, icon: 'bell' },
  ];

  const mockRenewals = [
    { name: 'example.com', type: 'Domain', expires: '2025-08-15', days: 21 },
    { name: 'mysite.net', type: 'Hosting', expires: '2025-09-02', days: 39 },
    { name: 'secure.org', type: 'SSL', expires: '2025-08-28', days: 34 },
  ];

  const mockActivities = [
    { action: 'Domain renewed', item: 'example.com', time: '2 hours ago' },
    { action: 'Support ticket created', item: 'Ticket #12345', time: '1 day ago' },
    { action: 'SSL certificate installed', item: 'secure.org', time: '3 days ago' },
    { action: 'Payment processed', item: '$89.99', time: '5 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        items={navigationItems}
        onItemClick={handleNavItemClick}
        userMenuOpen={userMenuOpen}
        onUserMenuToggle={() => setUserMenuOpen(!userMenuOpen)}
        notificationCount={state.unreadNotificationCount}
        onNotificationClick={handleNotificationClick}
        userName={state.currentUser?.name || 'John Doe'}
        userEmail={state.currentUser?.email || 'john.doe@example.com'}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {state.currentUser?.name || 'John'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your services and recent activities.
          </p>
        </div>

        {/* Service Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockServices.map((service, index) => (
            <Card
              key={index}
              title={service.type}
              icon={service.icon}
              variant="interactive"
              onClick={() => console.log(`View ${service.type}`)}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {service.count}
              </div>
              <div className="text-sm text-gray-500">
                Active {service.type.toLowerCase()}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Renewals */}
          <Card title="Upcoming Renewals" icon="bell">
            <div className="space-y-4">
              {mockRenewals.map((renewal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{renewal.name}</div>
                    <div className="text-sm text-gray-500">{renewal.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-600">
                      {renewal.days} days
                    </div>
                    <div className="text-xs text-gray-500">{renewal.expires}</div>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all renewals →
              </button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" icon="user">
            <div className="space-y-4">
              {mockActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>
                      {' - '}
                      <span className="text-blue-600">{activity.item}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View activity log →
              </button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card title="Quick Actions" icon="plus">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
                <div className="text-blue-600 font-medium">Register Domain</div>
                <div className="text-sm text-gray-500 mt-1">Find and register a new domain</div>
              </button>
              <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
                <div className="text-blue-600 font-medium">Create Ticket</div>
                <div className="text-sm text-gray-500 mt-1">Get help from our support team</div>
              </button>
              <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
                <div className="text-blue-600 font-medium">Manage Billing</div>
                <div className="text-sm text-gray-500 mt-1">Update payment methods</div>
              </button>
            </div>
          </Card>
        </div>

        {/* Promotional Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Special Offer: SSL Certificates</h3>
              <p className="text-blue-100">
                Secure your websites with SSL certificates starting at $9.99/year. 
                Limited time offer - save up to 50%!
              </p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
