import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ebayNotifications } from '../services/ebayServices';
import { initializeSocketClient, subscribeProductSold, disconnectSocket } from '../socket';
import { API_BASE_URL } from '../api/api';
import { formatShortDate } from '../shared/utils/formatDate';

const NotificationContext = createContext(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

const formatNotification = (record) => {
  const fallbackId = `${record?.orderId || record?._id || record?.id || record?.eventDate || Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const items = Array.isArray(record?.items) ? record.items : Array.isArray(record?.skuItems) ? record.skuItems : [];
  const totalUnits = items.reduce((sum, item) => sum + Number(item?.quantity ?? item?.qty ?? 1), 0);
  const productName = items.length
    ? items
        .map((item) => item?.title || item?.name || item?.sku || 'Product')
        .filter(Boolean)
        .join(', ')
    : record?.productName || record?.buyer || 'Product';

  return {
    id: record?.orderId || record?.id || record?._id || fallbackId,
    units: totalUnits || 1,
    productName,
    action: 'sold',
    remainingStock: record?.remainingStock ?? '-',
    time: record?.eventDate ? formatShortDate(record.eventDate) : 'Just now',
    isUnread: true,
    type: 'Sales',
    buyer: record?.buyer || '',
  };
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
  const [saleAlert, setSaleAlert] = useState(null);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!saleAlert) return;

    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    alertTimeoutRef.current = setTimeout(() => {
      setSaleAlert(null);
    }, 4000);

    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [saleAlert]);

  useEffect(() => {
    let mounted = true;

    const loadInitialNotifications = async () => {
      try {
        const response = await ebayNotifications();
        const records = Array.isArray(response)
          ? response
          : Array.isArray(response?.notifications)
            ? response.notifications
            : [];

        if (!mounted || !records.length) return;

        const mapped = records.map(formatNotification);
        setNotifications((prev) => {
          const nextIds = new Set(prev.map((item) => item.id));
          const newItems = mapped.filter((item) => !nextIds.has(item.id));
          return [...newItems, ...prev];
        });
      } catch (err) {
        console.warn('Failed loading notifications', err);
      }
    };

    loadInitialNotifications();

    const socketUrl = API_BASE_URL || window.location.origin;
    initializeSocketClient(socketUrl);
    const unsubscribe = subscribeProductSold((payload) => {
      try {
        if (!payload) return;
        const nextNotification = formatNotification(payload);
        const buyerName = payload?.buyer || 'Customer';
        const itemLabel = nextNotification.productName || 'Product';

        setNotifications((prev) => {
          const filtered = prev.filter((item) => item.id !== nextNotification.id);
          return [nextNotification, ...filtered];
        });

        setSaleAlert({
          id: nextNotification.id,
          title: 'Product sold',
          message: `${itemLabel} sold to ${buyerName} (${nextNotification.units} unit${nextNotification.units > 1 ? 's' : ''})`,
        });
      } catch (err) {
        console.warn('Error handling productSold payload', err);
      }
    });

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
      disconnectSocket();
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, unreadCount, saleAlert, setSaleAlert }}>
      {children}

      {saleAlert && (
        <div className="fixed right-5 top-5 z-[9999] w-[320px] rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 text-white shadow-2xl backdrop-blur-sm">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
              Sale
            </span>
            <span className="text-[10px] text-slate-300">Just now</span>
          </div>
          <p className="text-sm font-semibold text-white">{saleAlert.title}</p>
          <p className="mt-1 text-sm text-slate-200">{saleAlert.message}</p>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
