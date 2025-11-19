import React, { createContext, useEffect, useState, useContext } from 'react';
import socketService from '../services/socketService';
import { useAuth } from '../hooks/useAuth';


export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  // const { handleUserStatus } = useChat();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const s = socketService.connect();
      s.emit("user:online", user._id);

      // Đăng ký listeners global ở đây
      s.on("notification", handleNotification);
      // s.on("user:status", handleUserStatus);

      setSocket(s);

      return () => {
        s.off("notification");
        // s.off("user:status");
        socketService.disconnect();
      };
    }
  }, [user]);

  const handleNotification = (msg) => {

  }

  const handleUserStatus = (msg) => {
    console.log(msg); 
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
