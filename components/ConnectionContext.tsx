import React, { createContext, useState, useContext } from 'react';

type ConnectionContextType = {
  isConnected: boolean | null; // null = 연결 시도중, true/false = 연결 상태
  setIsConnected: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnection must be used within ConnectionProvider');
  return context;
}

