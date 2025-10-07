import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from '../utils/axiosConfig';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch unread count on initial load
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUnreadCount();
    }
  }, [isAuthenticated, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/admin/requests/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for new service requests (admin only)
    if (isAuthenticated && user?.role === 'admin') {
      socket.on('new_request', (data) => {
        const newNotification = {
          id: Date.now(),
          type: 'new_request',
          message: `New service request from ${data.name} for ${data.service_type}`,
          data: data,
          read: false,
          timestamp: new Date()
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1); // Increment unread count
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Service Request', {
            body: `${data.name} requested ${data.service_type} service`,
            icon: '/logo192.png'
          });
        }
      });

      // Join admin room
      socket.emit('join', { user_id: 'admin' });
    }

    // Listen for request status updates (user notification)
    socket.on('request_update', (data) => {
      const newNotification = {
        id: Date.now(),
        type: 'status_update',
        message: `Your request status has been updated to: ${data.status}`,
        data: data,
        read: false,
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socket.off('new_request');
      socket.off('request_update');
    };
  }, [socket, isAuthenticated, user]);

  const markAsRead = async (requestId) => {
    try {
      // Call API to mark request as read
      await axios.put(`/api/admin/requests/${requestId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.data && notification.data._id === requestId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark request as read:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};