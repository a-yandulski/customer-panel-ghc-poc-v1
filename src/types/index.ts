// Core types for the Customer Panel application

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  twoFactorEnabled: boolean;
  billingAddress?: Address;
  legalAddress?: Address;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Service {
  id: string;
  type: 'domain' | 'hosting' | 'email' | 'ssl' | 'other';
  name: string;
  status: 'active' | 'expired' | 'suspended' | 'pending';
  expiryDate: string;
  autoRenew: boolean;
  planDetails?: string;
  resourceUsage?: Record<string, any>;
}

export interface Domain extends Service {
  type: 'domain';
  nameservers: string[];
  dnsRecords: DNSRecord[];
  locked: boolean;
  eppCode?: string;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  name: string;
  value: string;
  ttl: number;
}

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  body: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  attachments?: string[];
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issuedDate: string;
  dueDate: string;
  pdfUrl: string;
  services: string[];
}

export interface Notification {
  id: string;
  type: 'renewal' | 'payment' | 'security' | 'system' | 'promotional';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Component Props types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
  'aria-describedby'?: string;
}
