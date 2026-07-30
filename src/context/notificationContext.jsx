import React, { createContext, useContext, useEffect, useState } from 'react';
import { ebayNotifications } from '../services/ebayServices';
import { initializeSocketClient, subscribeProductSold, disconnectSocket } from '../socket';
import { API_BASE_URL } from '../api/api';
import { formatShortDate } from '../utils/formatDate';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('app_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    // Disabled notifications fetch and socket initialization to prevent
    // connection errors when backend is not available during development.
    // Original implementation commented out below.
    /*
    let mounted = true;

    (async () => {
      try {
        const data = await ebayNotifications();
        const records = Array.isArray(data) ? data : (Array.isArray(data.notifications) ? data.notifications : []);
        const mapped = records.map((rec) => {
          const id = rec.orderId || rec.id || rec._id || `${rec.eventDate || Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const items = rec.items || rec.skuItems || [];
          const units = items.reduce((s, it) => s + (it.quantity || it.qty || 1), 0);
          const productName = items.length ? (items[0].title || items[0].name || items[0].sku || items.map(i => i.title || i.name).join(', ')) : (rec.productName || 'Product');
          const remainingStock = rec.remainingStock ?? '-';
          const time = rec.eventDate ? formatShortDate(rec.eventDate) : 'Today';
          return {
            id,
            units,
            productName,
            action: 'sold',
            remainingStock,
            time,
            isUnread: true,
            type: 'Sales'
          };
        });

        if (mounted && mapped.length > 0) {
          setNotifications(prev => {
            const deduped = mapped.filter(m => !prev.some(p => p.id === m.id));
            return [...deduped, ...prev];
          });
        }
      } catch (err) {
        console.warn('Failed loading notifications', err);
      }
    })();

    const socket = initializeSocketClient(API_BASE_URL || window.location.origin);
    const unsubscribe = subscribeProductSold((payload) => {
      try {
        const id = payload.orderId || `${payload.eventDate || Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        const items = payload.items || payload.skuItems || [];
        const units = items.reduce((s, it) => s + (it.quantity || it.qty || 1), 0);
        const productName = items.length ? (items[0].title || items[0].name || items[0].sku || items.map(i => i.title || i.name).join(', ')) : (payload.productName || payload.buyer || 'Product');
        const time = payload.eventDate ? formatShortDate(payload.eventDate) : 'Just now';
        const newNotif = {
          id,
          units,
          productName,
          action: 'sold',
          remainingStock: '-',
          time,
          isUnread: true,
          type: 'Sales'
        };
        setNotifications(prev => [newNotif, ...prev]);
      } catch (e) {
        console.warn('Error handling productSold payload', e);
      }
    });

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
      disconnectSocket();
    };
    */

    // No-op while backend is unavailable.
    return () => {};
  }, []);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
