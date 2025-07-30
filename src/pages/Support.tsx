import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupportTickets } from '../hooks';
import { Card } from '../components/molecules/Card';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { Input } from '../components/atoms/Input';
import { NavigationBar } from '../components/organisms/NavigationBar';
import { useAppContext } from '../contexts/AppContext';
import type { SupportTicket } from '../types';
import type { NavigationItem } from '../components/organisms/NavigationBar';

interface TicketCardProps {
  ticket: SupportTicket;
  onClick?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      variant="interactive" 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {ticket.subject}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Ticket #{ticket.id} • {ticket.category}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('-', ' ')}
          </span>
          <span className={`text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {ticket.body}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Created: {formatDate(ticket.createdAt)}</span>
          {ticket.messages.length > 0 && (
            <span className="flex items-center">
              <Icon name="chat-bubble-left-right" className="h-4 w-4 mr-1" />
              {ticket.messages.length} messages
            </span>
          )}
        </div>
        <span>Updated: {formatDate(ticket.updatedAt)}</span>
      </div>
    </Card>
  );
};

interface CreateTicketFormProps {
  onClose: () => void;
  onSubmit: (ticketData: any) => Promise<void>;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: 'Technical',
    subject: '',
    body: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.body.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create Support Ticket</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Icon name="x-mark" className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <Input
            type="text"
            value={formData.subject}
            onChange={(value) => setFormData({ ...formData, subject: value })}
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Please provide detailed information about your issue"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Create Ticket
          </Button>
        </div>
      </form>
    </Card>
  );
};

const Support: React.FC = () => {
  const { state, markNotificationRead } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { tickets, loading, error, createTicket } = useSupportTickets();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'closed'>('all');

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
    { 
      id: 'support', 
      label: 'Support', 
      icon: 'bell', 
      href: '/support', 
      badge: tickets.filter(t => t.status === 'open').length,
      active: location.pathname === '/support'
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

  const handleCreateTicket = async (ticketData: any) => {
    await createTicket(ticketData);
  };

  const filteredTickets = tickets.filter(ticket => 
    filter === 'all' || ticket.status === filter
  );

  const ticketCounts = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (!state.currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view support tickets.</p>
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
        {showCreateForm ? (
          <CreateTicketForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={handleCreateTicket}
          />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Get help with your services and account
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                <Icon name="plus" className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
                  <p className="text-sm text-gray-500">Total Tickets</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{ticketCounts.open || 0}</p>
                  <p className="text-sm text-gray-500">Open</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{ticketCounts['in-progress'] || 0}</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{ticketCounts.resolved || 0}</p>
                  <p className="text-sm text-gray-500">Resolved</p>
                </div>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'All Tickets', count: tickets.length },
                  { key: 'open', label: 'Open', count: ticketCounts.open || 0 },
                  { key: 'in-progress', label: 'In Progress', count: ticketCounts['in-progress'] || 0 },
                  { key: 'resolved', label: 'Resolved', count: ticketCounts.resolved || 0 },
                  { key: 'closed', label: 'Closed', count: ticketCounts.closed || 0 },
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

            {/* Loading State */}
            {loading && tickets.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Icon name="arrow-path" className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">Loading support tickets...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Icon name="exclamation-triangle" className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-red-600 mb-2">Failed to load support tickets</p>
                  <p className="text-gray-500">{error}</p>
                </div>
              </div>
            )}

            {/* Tickets List */}
            {!loading && !error && (
              <>
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="ticket" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {filter === 'all' ? 'No support tickets found' : `No ${filter.replace('-', ' ')} tickets found`}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {filter === 'all' 
                        ? 'You haven\'t created any support tickets yet.' 
                        : `You don't have any ${filter.replace('-', ' ')} tickets.`
                      }
                    </p>
                    <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                      <Icon name="plus" className="h-4 w-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onClick={() => console.log('View ticket:', ticket.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
