import { io } from 'socket.io-client';

let socket;

export const initializeSocketClient = (url) => {
  if (socket) return socket;
  try {
    socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
    });
  } catch (e) {
    console.warn('Socket initialization failed', e);
  }
  return socket;
};

export const subscribeProductSold = (cb) => {
  if (!socket) return null;
  socket.on('productSold', cb);
  return () => socket.off('productSold', cb);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
