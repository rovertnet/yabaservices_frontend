import React, { useEffect, useState } from 'react';
import { BsBell, BsBellFill, BsBellSlash } from 'react-icons/bs';
import { useNotifications } from '../context/NotificationContext';

const NotificationDropdown: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    notificationsEnabled, 
    hasNewNotification,
    toggleNotifications,
    markAsRead,
    clearNewNotificationFlag
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when new notification arrives
  useEffect(() => {
    if (hasNewNotification) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        clearNewNotificationFlag();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hasNewNotification]);

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  const handleToggleNotifications = () => {
    toggleNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-gray-700 hover:text-blue-600 transition ${
          isAnimating ? 'animate-bounce' : ''
        }`}
      >
        {!notificationsEnabled ? (
          <BsBellSlash size={24} className="text-gray-400" />
        ) : unreadCount > 0 ? (
          <BsBellFill size={24} />
        ) : (
          <BsBell size={24} />
        )}
        {unreadCount > 0 && notificationsEnabled && (
          <span className="absolute top-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            {/* Header */}
            <div className="border-b p-4">
              <h3 className="font-bold text-gray-900">Notifications</h3>
            </div>

            {/* Settings Section */}
            <div className="border-b bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {notificationsEnabled ? (
                    <BsBellFill className="text-blue-600" size={18} />
                  ) : (
                    <BsBellSlash className="text-gray-400" size={18} />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Alertes {notificationsEnabled ? 'activées' : 'désactivées'}
                  </span>
                </div>
                <button
                  onClick={handleToggleNotifications}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {notificationsEnabled && (
                <p className="mt-1 text-xs text-gray-500">
                  Son et notifications navigateur activés
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b p-4 hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;

