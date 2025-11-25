/**
 * Utility for browser notifications
 */

/**
 * Request permission for browser notifications
 * @returns Promise with permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

/**
 * Show a browser notification
 * @param title Notification title
 * @param body Notification body text
 * @param options Additional notification options
 */
export const showBrowserNotification = (
  title: string,
  body: string,
  options?: NotificationOptions
): void => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'kinhelp-notification',
      requireInteraction: false,
      ...options,
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Optional: Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

/**
 * Check if browser notifications are supported
 */
export const areBrowserNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * Get current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
};
