import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { User, Notification, Service, SupportTicket } from '../types';

// Global state interface
interface AppState {
  currentUser: User | null;
  notifications: Notification[];
  unreadNotificationCount: number;
  services: Service[];
  supportTickets: SupportTicket[];
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'SET_SUPPORT_TICKETS'; payload: SupportTicket[] }
  | { type: 'ADD_SUPPORT_TICKET'; payload: SupportTicket }
  | { type: 'UPDATE_SUPPORT_TICKET'; payload: SupportTicket }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
  currentUser: null,
  notifications: [],
  unreadNotificationCount: 0,
  services: [],
  supportTickets: [],
  loading: false,
  error: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    
    case 'CLEAR_USER':
      return {
        ...state,
        currentUser: null,
      };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadNotificationCount: action.payload.filter(n => !n.read).length,
      };
    
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadNotificationCount: newNotifications.filter(n => !n.read).length,
      };
    
    case 'MARK_NOTIFICATION_READ':
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadNotificationCount: updatedNotifications.filter(n => !n.read).length,
      };
    
    case 'SET_SERVICES':
      return {
        ...state,
        services: action.payload,
      };
    
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    
    case 'SET_SUPPORT_TICKETS':
      return {
        ...state,
        supportTickets: action.payload,
      };
    
    case 'ADD_SUPPORT_TICKET':
      return {
        ...state,
        supportTickets: [action.payload, ...state.supportTickets],
      };
    
    case 'UPDATE_SUPPORT_TICKET':
      return {
        ...state,
        supportTickets: state.supportTickets.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setUser: (user: User) => void;
  logout: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  updateService: (service: Service) => void;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'CLEAR_USER' });
    // Clear other user-specific data
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
    dispatch({ type: 'SET_SERVICES', payload: [] });
    dispatch({ type: 'SET_SUPPORT_TICKETS', payload: [] });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const updateService = (service: Service) => {
    dispatch({ type: 'UPDATE_SERVICE', payload: service });
  };

  const addSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SUPPORT_TICKET', payload: newTicket });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setUser,
    logout,
    addNotification,
    markNotificationRead,
    updateService,
    addSupportTicket,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
