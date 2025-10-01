import React from "react";
import { useWallet } from "@/components/WalletProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WalletButton: React.FC = () => {
  const { connect, disconnect, account, connected } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Petra wallet.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Please make sure Petra wallet is installed and try again.",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet.",
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const copyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (connected && account) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-2">
          <Wallet className="h-3 w-3" />
          <span className="text-xs font-mono">
            {shortenAddress(account.address)}
          </span>
          <button
            onClick={copyAddress}
            className="hover:text-primary transition-colors"
          >
            <Copy className="h-3 w-3" />
          </button>
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-primary hover:opacity-90 transition-opacity"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Petra Wallet
    </Button>
  );
};