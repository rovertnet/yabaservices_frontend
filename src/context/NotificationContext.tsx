import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { notificationsApi, type Notification } from '../services/notifications';
import { requestNotificationPermission, showBrowserNotification } from '../utils/BrowserNotification';
import { playNotificationSound } from '../utils/NotificationSound';
import { useAuth } from './AuthContext';

const NOTIFICATIONS_ENABLED_KEY = 'kinhelp_notifications_enabled';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  notificationsEnabled: boolean;
  hasNewNotification: boolean;
  toggleNotifications: () => void;
  requestPermission: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  clearNewNotificationFlag: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    // Load from localStorage, default to true
    const saved = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return saved !== 'false';
  });
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const { isAuthenticated } = useAuth();
  const previousCountRef = useRef<number>(0);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationsApi.getAllNotifications();
      
      // Check for new notifications
      const currentUnreadCount = data.filter(n => !n.isRead).length;
      const hadNewNotification = currentUnreadCount > previousCountRef.current;
      
      if (hadNewNotification && notificationsEnabled && previousCountRef.current > 0) {
        // Play sound
        playNotificationSound();
        
        // Show browser notification
        const latestNotification = data.find(n => !n.isRead);
        if (latestNotification) {
          showBrowserNotification(
            'Nouvelle Notification - Kinhelp',
            latestNotification.message
          );
        }
        
        // Trigger animation
        setHasNewNotification(true);
      }
      
      previousCountRef.current = currentUnreadCount;
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, notificationsEnabled]);

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(newValue));
    
    // If enabling, request permission
    if (newValue) {
      requestPermission();
    }
  };

  const requestPermission = async () => {
    try {
      await requestNotificationPermission();
    } catch (error) {
      console.error('Failed to request notification permission', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const clearNewNotificationFlag = () => {
    setHasNewNotification(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        notificationsEnabled,
        hasNewNotification,
        toggleNotifications,
        requestPermission,
        markAsRead, 
        refreshNotifications: fetchNotifications,
        clearNewNotificationFlag
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

