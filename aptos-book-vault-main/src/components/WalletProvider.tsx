import React, { createContext, useContext, useState, useCallback } from "react";
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

interface WalletContextType {
  connected: boolean;
  account: { address: string; aptosAccount?: Account } | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string; aptosAccount?: Account } | null>(null);

  const connect = useCallback(async () => {
    try {
      // Check if Petra wallet is available
      if (typeof window !== "undefined" && (window as any).aptos) {
        const response = await (window as any).aptos.connect();
        
        // For now, we'll use the connected account address
        // In a real app, you might want to create a proper Account object
        // with the user's private key (which should be handled securely)
        setAccount({ 
          address: response.address,
          // Note: In production, you shouldn't expose private keys
          // This is just for demo purposes
        });
        setConnected(true);
      } else {
        throw new Error("Petra wallet not found");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && (window as any).aptos) {
        await (window as any).aptos.disconnect();
      }
      setAccount(null);
      setConnected(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      throw error;
    }
  }, []);

  const value = {
    connected,
    account,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};