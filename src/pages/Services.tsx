import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServices } from '../hooks';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { NavigationBar } from '../components/organisms/NavigationBar';
import { useAppContext } from '../contexts/AppContext';
import type { Service } from '../types';
import type { NavigationItem } from '../components/organisms/NavigationBar';

interface ServiceCardProps {
  service: Service;
  onToggleAutoRenew: (serviceId: string, autoRenew: boolean) => Promise<any>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onToggleAutoRenew }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleAutoRenew = async () => {
    setIsLoading(true);
    try {
      await onToggleAutoRenew(service.id, !service.autoRenew);
    } catch (error) {
      console.error('Failed to toggle auto-renewal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'expired':
        return 'text-red-600';
      case 'suspended':
        return 'text-orange-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'domain':
        return 'globe-alt';
      case 'hosting':
        return 'server';
      case 'ssl':
        return 'shield-check';
      case 'email':
        return 'mail';
      default:
        return 'cog-6-tooth';
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateString: string) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(service.expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  return (
    <Card 
      className="h-full"
      variant={service.status === 'active' ? 'default' : 'interactive'}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Icon 
              name={getServiceIcon(service.type)} 
              className="h-8 w-8 text-blue-600" 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{service.type}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(service.status)}`}>
          {service.status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Expires</span>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-900">
              {formatExpiryDate(service.expiryDate)}
            </span>
            {isExpiringSoon && (
              <p className="text-xs text-orange-600">
                {daysUntilExpiry} days remaining
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Auto-renewal</span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${service.autoRenew ? 'text-green-600' : 'text-gray-600'}`}>
              {service.autoRenew ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAutoRenew}
              loading={isLoading}
              className="p-1"
            >
              <Icon 
                name={service.autoRenew ? 'toggle-right' : 'toggle-left'} 
                className={`h-4 w-4 ${service.autoRenew ? 'text-green-600' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
        </div>

        {service.planDetails && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Plan</span>
            <span className="text-sm text-gray-900">{service.planDetails}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="cog-6-tooth" className="h-4 w-4 mr-2" />
          Manage
        </Button>
        {isExpiringSoon && (
          <Button variant="primary" size="sm" className="flex-1">
            <Icon name="arrow-path" className="h-4 w-4 mr-2" />
            Renew
          </Button>
        )}
      </div>
    </Card>
  );
};

const Services: React.FC = () => {
  const { state, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { services, loading, error, toggleAutoRenew } = useServices();
  const [filter, setFilter] = useState<'all' | 'domain' | 'hosting' | 'ssl' | 'email'>('all');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Navigation items
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
    // Mock marking notifications as read
    state.notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationRead(notification.id);
      }
    });
  };

  const filteredServices = services.filter(service => 
    filter === 'all' || service.type === filter
  );

  const serviceTypeCounts = services.reduce((acc, service) => {
    acc[service.type] = (acc[service.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!state.currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view your services.</p>
      </div>
    );
  }

  if (loading && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="arrow-path" className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-500">Loading your services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="exclamation-triangle" className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600 mb-2">Failed to load services</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        items={navigationItems}
        onItemClick={handleNavItemClick}
        userMenuOpen={userMenuOpen}
        onUserMenuToggle={() => setUserMenuOpen(!userMenuOpen)}
        notificationCount={state.unreadNotificationCount}
        onNotificationClick={handleNotificationClick}
        userName={state.currentUser?.name}
        userEmail={state.currentUser?.email}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your domains, hosting, SSL certificates, and other services
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{services.length}</p>
            <p className="text-sm text-gray-500">Total Services</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{serviceTypeCounts.domain || 0}</p>
            <p className="text-sm text-gray-500">Domains</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{serviceTypeCounts.hosting || 0}</p>
            <p className="text-sm text-gray-500">Hosting</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {services.filter(s => getDaysUntilExpiry(s.expiryDate) <= 30).length}
            </p>
            <p className="text-sm text-gray-500">Expiring Soon</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Services', count: services.length },
            { key: 'domain', label: 'Domains', count: serviceTypeCounts.domain || 0 },
            { key: 'hosting', label: 'Hosting', count: serviceTypeCounts.hosting || 0 },
            { key: 'ssl', label: 'SSL', count: serviceTypeCounts.ssl || 0 },
            { key: 'email', label: 'Email', count: serviceTypeCounts.email || 0 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 ${
                  filter === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="server" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No services found' : `No ${filter} services found`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? 'You don\'t have any services yet.' 
              : `You don\'t have any ${filter} services.`
            }
          </p>
          <Button variant="primary">
            <Icon name="plus" className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onToggleAutoRenew={toggleAutoRenew}
            />
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

// Helper function for calculating days until expiry
function getDaysUntilExpiry(dateString: string): number {
  const expiryDate = new Date(dateString);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default Services;
