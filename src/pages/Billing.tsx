import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBilling } from '../hooks';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { NavigationBar } from '../components/organisms/NavigationBar';
import { useAppContext } from '../contexts/AppContext';
import type { Invoice, PaymentMethod } from '../types';
import type { NavigationItem } from '../components/organisms/NavigationBar';

interface InvoiceCardProps {
  invoice: Invoice;
  onDownload?: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onDownload }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Invoice #{invoice.number}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Issued: {formatDate(invoice.issuedDate)}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
          <p className="text-lg font-bold text-gray-900 mt-2">
            {formatCurrency(invoice.amount, invoice.currency)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Due Date:</span>
          <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
        </div>
        
        <div className="border-t pt-2">
          <p className="text-sm text-gray-500 mb-2">Services:</p>
          <ul className="text-sm text-gray-900 space-y-1">
            {invoice.services.map((service, index) => (
              <li key={index} className="flex items-center">
                <Icon name="check" className="h-3 w-3 text-green-500 mr-2" />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onDownload} className="flex-1">
          <Icon name="arrow-down-tray" className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        {invoice.status === 'pending' && (
          <Button variant="primary" size="sm" className="flex-1">
            <Icon name="credit-card" className="h-4 w-4 mr-2" />
            Pay Now
          </Button>
        )}
      </div>
    </Card>
  );
};

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault?: () => void;
  onRemove?: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  paymentMethod, 
  onSetDefault, 
  onRemove 
}) => {
  const getCardIcon = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'credit-card';
      case 'mastercard':
        return 'credit-card';
      case 'american express':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'credit_card':
        return 'Credit Card';
      case 'bank_account':
        return 'Bank Account';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Payment Method';
    }
  };

  return (
    <Card className={`${paymentMethod.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name={getCardIcon(paymentMethod.brand || '')} className="h-8 w-8 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {getTypeLabel(paymentMethod.type)}
            </h3>
            {paymentMethod.type === 'credit_card' && (
              <p className="text-sm text-gray-500">
                •••• •••• •••• {paymentMethod.last4}
              </p>
            )}
          </div>
        </div>
        {paymentMethod.isDefault && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Default
          </span>
        )}
      </div>

      {paymentMethod.type === 'credit_card' && paymentMethod.brand && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Brand:</span>
            <span className="text-gray-900 capitalize">{paymentMethod.brand}</span>
          </div>
          {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Expires:</span>
              <span className="text-gray-900">
                {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-2">
        {!paymentMethod.isDefault && (
          <Button variant="outline" size="sm" onClick={onSetDefault} className="flex-1">
            Set as Default
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700">
          <Icon name="trash" className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>
    </Card>
  );
};

const Billing: React.FC = () => {
  const { state, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { invoices, paymentMethods, loading, error, loadInvoices, loadPaymentMethods } = useBilling();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payment-methods'>('invoices');

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
      href: '/billing',
      active: location.pathname === '/billing'
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

  useEffect(() => {
    if (state.currentUser) {
      loadInvoices();
      loadPaymentMethods();
    }
  }, [state.currentUser, loadInvoices, loadPaymentMethods]);

  if (!state.currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view billing information.</p>
      </div>
    );
  }

  // Calculate billing stats
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueCount = invoices.filter(invoice => invoice.status === 'overdue').length;

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
            <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your invoices and payment methods
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Total Billed</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  ${pendingAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {invoices.filter(i => i.status === 'paid').length}
                </p>
                <p className="text-sm text-gray-500">Paid Invoices</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                <p className="text-sm text-gray-500">Overdue</p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`${
                  activeTab === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                Invoices
                <span className={`ml-2 ${
                  activeTab === 'invoices' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                  {invoices.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('payment-methods')}
                className={`${
                  activeTab === 'payment-methods'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                Payment Methods
                <span className={`ml-2 ${
                  activeTab === 'payment-methods' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                } py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                  {paymentMethods.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="arrow-path" className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading billing information...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="exclamation-triangle" className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-red-600 mb-2">Failed to load billing information</p>
                <p className="text-gray-500">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  {invoices.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="document-text" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                      <p className="text-gray-500">You don't have any invoices yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {invoices.map((invoice) => (
                        <InvoiceCard
                          key={invoice.id}
                          invoice={invoice}
                          onDownload={() => console.log('Download invoice:', invoice.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payment-methods' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button variant="primary">
                      <Icon name="plus" className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                  
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="credit-card" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                      <p className="text-gray-500 mb-6">Add a payment method to manage your billing.</p>
                      <Button variant="primary">
                        <Icon name="plus" className="h-4 w-4 mr-2" />
                        Add Your First Payment Method
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {paymentMethods.map((method) => (
                        <PaymentMethodCard
                          key={method.id}
                          paymentMethod={method}
                          onSetDefault={() => console.log('Set default:', method.id)}
                          onRemove={() => console.log('Remove method:', method.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
