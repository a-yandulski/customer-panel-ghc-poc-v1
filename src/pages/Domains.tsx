import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServices, useDNS } from '../hooks';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { Input } from '../components/atoms/Input';
import { NavigationBar } from '../components/organisms/NavigationBar';
import { useAppContext } from '../contexts/AppContext';
import type { Service, DNSRecord } from '../types';
import type { NavigationItem } from '../components/organisms/NavigationBar';

interface DomainCardProps {
  domain: Service;
  onManageDNS?: () => void;
  onToggleLock?: () => void;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain, onManageDNS, onToggleLock }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
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

  const daysUntilExpiry = getDaysUntilExpiry(domain.expiryDate);
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  // Mock domain-specific properties (would be in Domain type extending Service)
  const domainData = {
    locked: Math.random() > 0.5,
    nameservers: ['ns1.example.com', 'ns2.example.com'],
    privacy: Math.random() > 0.5
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="globe-alt" className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
            <p className="text-sm text-gray-500">Domain Registration</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
          {domain.status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Expires</span>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-900">
              {formatDate(domain.expiryDate)}
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
          <span className={`text-sm font-medium ${domain.autoRenew ? 'text-green-600' : 'text-gray-600'}`}>
            {domain.autoRenew ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Domain Lock</span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${domainData.locked ? 'text-green-600' : 'text-gray-600'}`}>
              {domainData.locked ? 'Enabled' : 'Disabled'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLock}
              className="p-1"
            >
              <Icon 
                name={domainData.locked ? 'lock-closed' : 'lock-open'} 
                className={`h-4 w-4 ${domainData.locked ? 'text-green-600' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Privacy Protection</span>
          <span className={`text-sm font-medium ${domainData.privacy ? 'text-green-600' : 'text-gray-600'}`}>
            {domainData.privacy ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onManageDNS} className="flex-1">
            <Icon name="cog-6-tooth" className="h-4 w-4 mr-2" />
            Manage DNS
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Icon name="arrow-top-right-on-square" className="h-4 w-4 mr-2" />
            Transfer
          </Button>
        </div>
        
        {isExpiringSoon && (
          <Button variant="primary" size="sm" className="w-full">
            <Icon name="arrow-path" className="h-4 w-4 mr-2" />
            Renew Domain
          </Button>
        )}
      </div>
    </Card>
  );
};

interface DNSRecordRowProps {
  record: DNSRecord;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DNSRecordRow: React.FC<DNSRecordRowProps> = ({ record, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {record.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
        {record.value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {record.ttl}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Icon name="pencil" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Icon name="trash" className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

const Domains: React.FC = () => {
  const { state, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { services, loading, error } = useServices();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'domains' | 'dns'>('domains');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter only domain services
  const domains = services.filter(service => service.type === 'domain');
  const { dnsRecords } = useDNS(selectedDomain || undefined);

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
    { 
      id: 'domains', 
      label: 'Domains', 
      icon: 'globe', 
      href: '/domains',
      active: location.pathname === '/domains'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: 'credit-card', 
      href: '/billing'
    },
    { 
      id: 'support', 
      label: 'Support', 
      icon: 'bell', 
      href: '/support', 
      badge: 2
    },
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

  const handleManageDNS = (domainId: string) => {
    setSelectedDomain(domainId);
    setActiveTab('dns');
  };

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!state.currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view your domains.</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your domain registrations and DNS settings
              </p>
            </div>
            <Button variant="primary">
              <Icon name="plus" className="h-4 w-4 mr-2" />
              Register Domain
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{domains.length}</p>
                <p className="text-sm text-gray-500">Total Domains</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {domains.filter(d => d.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {domains.filter(d => {
                    const daysUntilExpiry = Math.ceil((new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 30;
                  }).length}
                </p>
                <p className="text-sm text-gray-500">Expiring Soon</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {domains.filter(d => d.autoRenew).length}
                </p>
                <p className="text-sm text-gray-500">Auto-Renewal</p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('domains')}
                className={`${
                  activeTab === 'domains'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                My Domains
                <span className={`ml-2 ${
                  activeTab === 'domains' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                  {domains.length}
                </span>
              </button>
              {selectedDomain && (
                <button
                  onClick={() => setActiveTab('dns')}
                  className={`${
                    activeTab === 'dns'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                >
                  DNS Management
                  <span className={`ml-2 ${
                    activeTab === 'dns' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                  } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                    {dnsRecords.length}
                  </span>
                </button>
              )}
            </nav>
          </div>

          {/* Content */}
          {loading && domains.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="arrow-path" className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading your domains...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="exclamation-triangle" className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-red-600 mb-2">Failed to load domains</p>
                <p className="text-gray-500">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {activeTab === 'domains' && (
                <div className="space-y-4">
                  {/* Search */}
                  <div className="max-w-md">
                    <Input
                      type="text"
                      placeholder="Search domains..."
                      value={searchTerm}
                      onChange={setSearchTerm}
                    />
                  </div>

                  {filteredDomains.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="globe-alt" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? 'No domains found' : 'No domains registered'}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm 
                          ? `No domains match "${searchTerm}"`
                          : 'Register your first domain to get started.'
                        }
                      </p>
                      <Button variant="primary">
                        <Icon name="plus" className="h-4 w-4 mr-2" />
                        Register Domain
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredDomains.map((domain) => (
                        <DomainCard
                          key={domain.id}
                          domain={domain}
                          onManageDNS={() => handleManageDNS(domain.id)}
                          onToggleLock={() => console.log('Toggle lock:', domain.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'dns' && selectedDomain && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setActiveTab('domains');
                          setSelectedDomain(null);
                        }}
                      >
                        <Icon name="arrow-left" className="h-4 w-4 mr-2" />
                        Back to Domains
                      </Button>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          DNS Records for {domains.find(d => d.id === selectedDomain)?.name}
                        </h2>
                      </div>
                    </div>
                    <Button variant="primary">
                      <Icon name="plus" className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </div>

                  <Card>
                    {dnsRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="document-text" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No DNS records found</h3>
                        <p className="text-gray-500 mb-6">Add DNS records to configure your domain.</p>
                        <Button variant="primary">
                          <Icon name="plus" className="h-4 w-4 mr-2" />
                          Add First Record
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                TTL
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dnsRecords.map((record) => (
                              <DNSRecordRow
                                key={record.id}
                                record={record}
                                onEdit={() => console.log('Edit record:', record.id)}
                                onDelete={() => console.log('Delete record:', record.id)}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Domains;
