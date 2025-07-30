import { useState, useEffect } from 'react';
import { mockApi } from '../api/mockApi';
import { useAppContext } from '../contexts/AppContext';
import type { SupportTicket, Invoice, PaymentMethod, DNSRecord } from '../types';

// Custom hook for loading user profile
export const useProfile = () => {
  const { state, setUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.updateProfile(profileData);
      if (response.success) {
        setUser(response.data);
        return response;
      } else {
        setError('Failed to update profile');
        return response;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user: state.currentUser,
    loading,
    error,
    loadProfile,
    updateProfile,
  };
};

// Custom hook for services management
export const useServices = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getServices();
      if (response.success) {
        dispatch({ type: 'SET_SERVICES', payload: response.data });
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRenew = async (serviceId: string, autoRenew: boolean) => {
    try {
      const response = await mockApi.toggleAutoRenew(serviceId, autoRenew);
      if (response.success) {
        // Update the service in state
        const updatedService = state.services.find(s => s.id === serviceId);
        if (updatedService) {
          dispatch({ 
            type: 'UPDATE_SERVICE', 
            payload: { ...updatedService, autoRenew } 
          });
        }
        return response;
      } else {
        throw new Error('Failed to update auto-renewal setting');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      throw err;
    }
  };

  useEffect(() => {
    if (state.currentUser && state.services.length === 0) {
      loadServices();
    }
  }, [state.currentUser]);

  return {
    services: state.services,
    loading,
    error,
    loadServices,
    toggleAutoRenew,
  };
};

// Custom hook for support tickets
export const useSupportTickets = () => {
  const { state, dispatch, addSupportTicket } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getSupportTickets();
      if (response.success) {
        dispatch({ type: 'SET_SUPPORT_TICKETS', payload: response.data });
      } else {
        setError('Failed to load support tickets');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.createSupportTicket(ticketData);
      if (response.success) {
        addSupportTicket(response.data);
        return response;
      } else {
        setError('Failed to create support ticket');
        return response;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create support ticket';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.currentUser && state.supportTickets.length === 0) {
      loadTickets();
    }
  }, [state.currentUser]);

  return {
    tickets: state.supportTickets,
    loading,
    error,
    loadTickets,
    createTicket,
  };
};

// Custom hook for notifications
export const useNotifications = () => {
  const { state, dispatch, markNotificationRead } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getNotifications();
      if (response.success) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await mockApi.markNotificationRead(notificationId);
      if (response.success) {
        markNotificationRead(notificationId);
        return response;
      } else {
        throw new Error('Failed to mark notification as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification');
      throw err;
    }
  };

  useEffect(() => {
    if (state.currentUser) {
      loadNotifications();
    }
  }, [state.currentUser]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadNotificationCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
  };
};

// Custom hook for billing data
export const useBilling = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getInvoices();
      if (response.success) {
        setInvoices(response.data);
      } else {
        setError('Failed to load invoices');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.data);
      } else {
        setError('Failed to load payment methods');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  return {
    invoices,
    paymentMethods,
    loading,
    error,
    loadInvoices,
    loadPaymentMethods,
  };
};

// Custom hook for DNS management
export const useDNS = (domainId?: string) => {
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDnsRecords = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockApi.getDnsRecords(id);
      if (response.success) {
        setDnsRecords(response.data);
      } else {
        setError('Failed to load DNS records');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load DNS records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domainId) {
      loadDnsRecords(domainId);
    }
  }, [domainId]);

  return {
    dnsRecords,
    loading,
    error,
    loadDnsRecords,
  };
};
