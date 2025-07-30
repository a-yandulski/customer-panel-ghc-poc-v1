// Mock API client that simulates real API calls with delays and responses
// This replaces actual HTTP requests for MVP development

export class MockApiClient {
  private baseDelay = 500; // Simulate network delay

  private async simulateRequest<T>(data: T, delay?: number): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, delay || this.baseDelay));
    return data;
  }

  private async simulateError(message: string, delay?: number): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, delay || this.baseDelay));
    throw new Error(message);
  }

  // Simulate random failures for testing error handling
  private shouldSimulateError(chance: number = 0.1): boolean {
    return Math.random() < chance;
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    if (this.shouldSimulateError(0.05)) {
      return this.simulateError('Network error. Please try again.');
    }

    if (email === 'john.doe@example.com' && password === 'password123') {
      return this.simulateRequest({
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Example Corp',
            twoFactorEnabled: true,
          }
        }
      });
    }

    return this.simulateRequest({
      success: false,
      message: 'Invalid email or password',
      errors: ['Invalid credentials']
    });
  }

  async logout() {
    return this.simulateRequest({
      success: true,
      message: 'Logged out successfully'
    });
  }

  // User profile endpoints
  async getProfile() {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load profile');
    }

    return this.simulateRequest({
      success: true,
      data: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Example Corp',
        twoFactorEnabled: true,
        billingAddress: {
          id: '1',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US'
        },
        legalAddress: {
          id: '2',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US'
        }
      }
    });
  }

  async updateProfile(profileData: any) {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to update profile');
    }

    return this.simulateRequest({
      success: true,
      data: { ...profileData, id: '1', updatedAt: new Date().toISOString() },
      message: 'Profile updated successfully'
    });
  }

  // Services endpoints
  async getServices() {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load services');
    }

    return this.simulateRequest({
      success: true,
      data: [
        {
          id: '1',
          type: 'domain' as const,
          name: 'example.com',
          status: 'active' as const,
          expiryDate: '2025-12-15T00:00:00Z',
          autoRenew: true,
          nameservers: ['ns1.example.com', 'ns2.example.com'],
          locked: true
        },
        {
          id: '2',
          type: 'domain' as const,
          name: 'mysite.net',
          status: 'active' as const,
          expiryDate: '2025-09-02T00:00:00Z',
          autoRenew: false,
          nameservers: ['ns1.provider.com', 'ns2.provider.com'],
          locked: false
        },
        {
          id: '3',
          type: 'hosting' as const,
          name: 'Web Hosting Pro',
          status: 'active' as const,
          expiryDate: '2025-08-28T00:00:00Z',
          autoRenew: true,
          planDetails: 'Pro Plan - 10GB Storage, Unlimited Bandwidth'
        },
        {
          id: '4',
          type: 'ssl' as const,
          name: 'SSL Certificate',
          status: 'active' as const,
          expiryDate: '2025-11-10T00:00:00Z',
          autoRenew: true,
          planDetails: 'Standard SSL - Protects example.com and www.example.com'
        }
      ]
    });
  }

  async toggleAutoRenew(serviceId: string, autoRenew: boolean) {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to update auto-renewal setting');
    }

    return this.simulateRequest({
      success: true,
      data: { id: serviceId, autoRenew, updatedAt: new Date().toISOString() },
      message: `Auto-renewal ${autoRenew ? 'enabled' : 'disabled'} successfully`
    });
  }

  // Support tickets endpoints
  async getSupportTickets() {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load support tickets');
    }

    return this.simulateRequest({
      success: true,
      data: [
        {
          id: '12345',
          category: 'Technical' as const,
          subject: 'DNS configuration issue',
          body: 'Having trouble configuring DNS records for my domain.',
          status: 'open' as const,
          priority: 'medium' as const,
          createdAt: '2025-07-24T10:30:00Z',
          updatedAt: '2025-07-24T14:15:00Z',
          messages: [
            {
              id: '1',
              sender: 'user' as const,
              message: 'Having trouble configuring DNS records for my domain.',
              timestamp: '2025-07-24T10:30:00Z'
            },
            {
              id: '2',
              sender: 'support' as const,
              message: 'Thank you for contacting us. We\'ll help you with the DNS configuration.',
              timestamp: '2025-07-24T14:15:00Z'
            }
          ]
        },
        {
          id: '12346',
          category: 'Billing' as const,
          subject: 'Payment method update',
          body: 'Need to update my credit card information.',
          status: 'resolved' as const,
          priority: 'low' as const,
          createdAt: '2025-07-22T09:00:00Z',
          updatedAt: '2025-07-23T16:30:00Z',
          messages: [
            {
              id: '3',
              sender: 'user' as const,
              message: 'Need to update my credit card information.',
              timestamp: '2025-07-22T09:00:00Z'
            },
            {
              id: '4',
              sender: 'support' as const,
              message: 'I\'ve sent you a secure link to update your payment method.',
              timestamp: '2025-07-23T16:30:00Z'
            }
          ]
        }
      ]
    });
  }

  async createSupportTicket(ticketData: any) {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to create support ticket');
    }

    const newTicket = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      ...ticketData,
      status: 'open',
      priority: ticketData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: '1',
          sender: 'user',
          message: ticketData.body,
          timestamp: new Date().toISOString()
        }
      ]
    };

    return this.simulateRequest({
      success: true,
      data: newTicket,
      message: 'Support ticket created successfully'
    });
  }

  // Notifications endpoints
  async getNotifications() {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load notifications');
    }

    return this.simulateRequest({
      success: true,
      data: [
        {
          id: '1',
          type: 'renewal' as const,
          title: 'Domain Renewal Reminder',
          message: 'Your domain example.com expires in 21 days',
          read: false,
          timestamp: '2025-07-25T08:00:00Z',
          actionUrl: '/services/domains/1'
        },
        {
          id: '2',
          type: 'system' as const,
          title: 'Support Ticket Update',
          message: 'Your support ticket #12345 has been updated',
          read: false,
          timestamp: '2025-07-24T14:15:00Z',
          actionUrl: '/support/tickets/12345'
        },
        {
          id: '3',
          type: 'payment' as const,
          title: 'Payment Processed',
          message: 'Payment of $89.99 has been processed successfully',
          read: true,
          timestamp: '2025-07-20T12:00:00Z'
        }
      ]
    });
  }

  async markNotificationRead(notificationId: string) {
    return this.simulateRequest({
      success: true,
      data: { id: notificationId, read: true },
      message: 'Notification marked as read'
    });
  }

  // Billing endpoints
  async getInvoices() {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load invoices');
    }

    return this.simulateRequest({
      success: true,
      data: [
        {
          id: 'INV-2025-001',
          number: 'INV-2025-001',
          amount: 89.99,
          currency: 'USD',
          status: 'paid' as const,
          issuedDate: '2025-07-01T00:00:00Z',
          dueDate: '2025-07-15T00:00:00Z',
          pdfUrl: '/api/invoices/INV-2025-001.pdf',
          services: ['example.com - Domain Registration', 'Web Hosting Pro']
        },
        {
          id: 'INV-2025-002',
          number: 'INV-2025-002',
          amount: 129.99,
          currency: 'USD',
          status: 'pending' as const,
          issuedDate: '2025-07-20T00:00:00Z',
          dueDate: '2025-08-05T00:00:00Z',
          pdfUrl: '/api/invoices/INV-2025-002.pdf',
          services: ['SSL Certificate', 'Domain Transfer']
        }
      ]
    });
  }

  async getPaymentMethods() {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load payment methods');
    }

    return this.simulateRequest({
      success: true,
      data: [
        {
          id: '1',
          type: 'credit_card' as const,
          last4: '4242',
          brand: 'Visa',
          expiryMonth: 12,
          expiryYear: 2027,
          isDefault: true
        },
        {
          id: '2',
          type: 'credit_card' as const,
          last4: '5555',
          brand: 'Mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false
        }
      ]
    });
  }

  // DNS management
  async getDnsRecords(_domainId: string) {
    if (this.shouldSimulateError()) {
      return this.simulateError('Failed to load DNS records');
    }

    return this.simulateRequest({
      success: true,
      data: [
        {
          id: '1',
          type: 'A' as const,
          name: '@',
          value: '192.168.1.1',
          ttl: 3600
        },
        {
          id: '2',
          type: 'CNAME' as const,
          name: 'www',
          value: 'example.com',
          ttl: 3600
        },
        {
          id: '3',
          type: 'MX' as const,
          name: '@',
          value: '10 mail.example.com',
          ttl: 3600
        }
      ]
    });
  }
}

// Create singleton instance
export const mockApi = new MockApiClient();
