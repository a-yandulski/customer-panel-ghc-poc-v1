import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { FormField } from '../components/molecules/FormField';
import { NavigationBar } from '../components/organisms/NavigationBar';
import { useAppContext } from '../contexts/AppContext';
import type { NavigationItem } from '../components/organisms/NavigationBar';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const Profile: React.FC = () => {
  const { state, markNotificationRead, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateProfile } = useProfile();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    billingAddress: {
      street: user?.billingAddress?.street || '',
      city: user?.billingAddress?.city || '',
      state: user?.billingAddress?.state || '',
      zipCode: user?.billingAddress?.zipCode || '',
      country: user?.billingAddress?.country || 'US',
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

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
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user-circle',
      href: '/profile',
      active: location.pathname === '/profile'
    }
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

  const handleFieldChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      billingAddress: {
        street: user?.billingAddress?.street || '',
        city: user?.billingAddress?.city || '',
        state: user?.billingAddress?.state || '',
        zipCode: user?.billingAddress?.zipCode || '',
        country: user?.billingAddress?.country || 'US',
      }
    });
    setFormErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!state.currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view your profile.</p>
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information and preferences
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="arrow-right-on-rectangle" className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                Notifications
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Icon name="pencil" className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSave} loading={isSaving}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    disabled={!isEditing}
                    error={formErrors.name}
                    validationRules={{ required: true }}
                  />

                  <FormField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    disabled={!isEditing}
                    error={formErrors.email}
                    validationRules={{ 
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    }}
                  />

                  <FormField
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFieldChange}
                    disabled={!isEditing}
                    error={formErrors.phone}
                    placeholder="+1 (555) 123-4567"
                  />

                  <FormField
                    name="company"
                    label="Company"
                    value={formData.company}
                    onChange={handleFieldChange}
                    disabled={!isEditing}
                    placeholder="Your company name"
                  />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing Address</h2>
                
                <div className="space-y-4">
                  <FormField
                    name="billingAddress.street"
                    label="Street Address"
                    value={formData.billingAddress.street}
                    onChange={handleFieldChange}
                    disabled={!isEditing}
                    placeholder="123 Main Street"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      name="billingAddress.city"
                      label="City"
                      value={formData.billingAddress.city}
                      onChange={handleFieldChange}
                      disabled={!isEditing}
                      placeholder="New York"
                    />

                    <FormField
                      name="billingAddress.state"
                      label="State/Province"
                      value={formData.billingAddress.state}
                      onChange={handleFieldChange}
                      disabled={!isEditing}
                      placeholder="NY"
                    />

                    <FormField
                      name="billingAddress.zipCode"
                      label="ZIP/Postal Code"
                      value={formData.billingAddress.zipCode}
                      onChange={handleFieldChange}
                      disabled={!isEditing}
                      placeholder="10001"
                    />
                  </div>

                  <div className="md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.billingAddress.country}
                      onChange={(e) => handleFieldChange('billingAddress.country', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.twoFactorEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <Button variant="outline" size="sm">
                        {user?.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Login Sessions</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage active sessions and devices
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      title: 'Service Renewals',
                      description: 'Get notified about upcoming service renewals',
                      enabled: true
                    },
                    {
                      title: 'Payment Notifications',
                      description: 'Receive alerts about payments and billing',
                      enabled: true
                    },
                    {
                      title: 'Security Alerts',
                      description: 'Important security notifications',
                      enabled: true
                    },
                    {
                      title: 'Promotional Emails',
                      description: 'Marketing and promotional content',
                      enabled: false
                    },
                    {
                      title: 'Support Updates',
                      description: 'Updates on your support tickets',
                      enabled: true
                    }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{setting.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={setting.enabled}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
