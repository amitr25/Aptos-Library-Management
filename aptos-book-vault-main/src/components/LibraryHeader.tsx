import React from "react";
import { WalletButton } from "./WalletButton";
import { Library, Blocks } from "lucide-react";

export const LibraryHeader: React.FC = () => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-primary">
              <Library className="h-6 w-6 text-white" />
              <Blocks className="h-5 w-5 text-white/80" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Blockchain Library
              </h1>
              <p className="text-sm text-muted-foreground">
                Decentralized Book Borrowing on Aptos
              </p>
            </div>
          </div>
          
          <WalletButton />
        </div>
      </div>
    </header>
  );
};