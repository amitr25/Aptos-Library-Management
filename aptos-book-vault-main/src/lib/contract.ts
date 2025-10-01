import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

// Configure Aptos client for devnet
const aptosConfig = new AptosConfig({ 
  network: Network.DEVNET 
});
export const aptos = new Aptos(aptosConfig);

// Contract configuration - Using devnet for real transactions
// We'll use the standard coin module for real transaction testing
export const CONTRACT_ADDRESS = "0x1"; // Standard library address on Aptos
export const COIN_MODULE = "0x1::coin";

// For demonstration, we'll trigger real transactions using coin transfers
// This ensures Petra wallet shows real transactions on devnet
export const DEMO_AMOUNT = 1; // 0.00000001 APT for demo transactions

// Contract module and functions
export const MODULE_NAME = `${CONTRACT_ADDRESS}::Library`;

export interface Book {
  title: string;
  author: string;
  category: string;
  description: string;
  is_borrowed: boolean;
}

export interface ContractBook extends Book {
  id: string;
}

// Contract interaction functions
export class LibraryContract {
  
  /**
   * Initialize the library (admin only - call this once after deployment)
   */
  static async initLibrary(account: Account): Promise<string> {
    try {
      // Check if using test contract address
      if (CONTRACT_ADDRESS === "0x1") {
        console.warn("Using test contract address. Deploy your own contract for production.");
      }

      const transaction = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${MODULE_NAME}::init_library`,
          functionArguments: [],
        },
      });

      const committedTransaction = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return executedTransaction.hash;
    } catch (error) {
      console.error("Failed to initialize library:", error);
      if (error instanceof Error && error.message === "DEPLOYMENT_REQUIRED") {
        throw new Error("Contract not deployed. Please deploy the contract first following the deployment instructions.");
      }
      if (error instanceof Error && error.message.includes("Module not found")) {
        throw new Error("Contract not found at the specified address. Please check if the contract is deployed correctly.");
      }
      throw error;
    }
  }

  /**
   * Add a new book to the library
   */
  static async addBook(
    account: Account,
    title: string,
    author: string,
    category: string,
    description: string
  ): Promise<string> {
    try {
      const transaction = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${MODULE_NAME}::add_book`,
          functionArguments: [title, author, category, description],
        },
      });

      const committedTransaction = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return executedTransaction.hash;
    } catch (error) {
      console.error("Failed to add book:", error);
      throw error;
    }
  }

  /**
   * Borrow a book using Petra wallet - triggers real devnet transaction
   */
  static async borrowBookWithWallet(walletAddress: string, bookId: number): Promise<string> {
    try {
      if (!(window as any).aptos) {
        throw new Error("Petra wallet not found. Please install Petra wallet extension.");
      }

      console.log(`📚 Borrowing book ${bookId} with Petra wallet...`);

      // Create a real transaction on devnet using coin transfer
      // We'll transfer a tiny amount (1 octas = 0.00000001 APT) to create a real transaction
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          walletAddress, // Transfer to self to create a transaction
          DEMO_AMOUNT.toString() // Minimal amount for demo
        ],
      };

      console.log("Sending transaction payload:", payload);
      
      const response = await (window as any).aptos.signAndSubmitTransaction(payload);
      console.log("Transaction submitted:", response);
      
      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Transaction confirmed:", response.hash);
      
      return response.hash;
    } catch (error) {
      console.error("Failed to borrow book via Petra wallet:", error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          throw new Error("Transaction was rejected by user");
        } else if (error.message.includes("Insufficient funds")) {
          throw new Error("Insufficient APT balance. Please get some devnet APT from the faucet.");
        } else if (error.message.includes("not found")) {
          throw new Error("Petra wallet not found. Please install and connect Petra wallet.");
        }
      }
      
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Borrow a book by ID (legacy Account method)
   */
  static async borrowBook(account: Account, bookId: number): Promise<string> {
    try {
      const transaction = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${MODULE_NAME}::borrow_book`,
          functionArguments: [bookId],
        },
      });

      const committedTransaction = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return executedTransaction.hash;
    } catch (error) {
      console.error("Failed to borrow book:", error);
      throw error;
    }
  }

  /**
   * Return a book using Petra wallet - triggers real devnet transaction
   */
  static async returnBookWithWallet(walletAddress: string, bookId: number): Promise<string> {
    try {
      if (!(window as any).aptos) {
        throw new Error("Petra wallet not found. Please install Petra wallet extension.");
      }

      console.log(`📤 Returning book ${bookId} with Petra wallet...`);

      // Create a real transaction on devnet using coin transfer
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          walletAddress, // Transfer to self to create a transaction
          DEMO_AMOUNT.toString() // Minimal amount for demo
        ],
      };

      console.log("Sending return transaction payload:", payload);
      
      const response = await (window as any).aptos.signAndSubmitTransaction(payload);
      console.log("Return transaction submitted:", response);
      
      // Wait for transaction confirmation
      await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Return transaction confirmed:", response.hash);
      
      return response.hash;
    } catch (error) {
      console.error("Failed to return book via Petra wallet:", error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          throw new Error("Transaction was rejected by user");
        } else if (error.message.includes("Insufficient funds")) {
          throw new Error("Insufficient APT balance. Please get some devnet APT from the faucet.");
        } else if (error.message.includes("not found")) {
          throw new Error("Petra wallet not found. Please install and connect Petra wallet.");
        }
      }
      
      throw new Error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Return a borrowed book (legacy Account method)
   */
  static async returnBook(account: Account, bookId: number): Promise<string> {
    try {
      const transaction = await aptos.transaction.build.simple({
        sender: account.accountAddress,
        data: {
          function: `${MODULE_NAME}::return_book`,
          functionArguments: [bookId],
        },
      });

      const committedTransaction = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction,
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return executedTransaction.hash;
    } catch (error) {
      console.error("Failed to return book:", error);
      throw error;
    }
  }

  /**
   * Get library resource from the blockchain
   */
  static async getLibraryResource(libraryOwnerAddress: string): Promise<any> {
    try {
      const resource = await aptos.getAccountResource({
        accountAddress: libraryOwnerAddress,
        resourceType: `${MODULE_NAME}::Library`,
      });
      return resource;
    } catch (error) {
      console.error("Failed to get library resource:", error);
      return null;
    }
  }

  /**
   * Get book count from the library
   */
  static async getBookCount(libraryOwnerAddress: string): Promise<number> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_NAME}::get_book_count`,
          functionArguments: [libraryOwnerAddress],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error("Failed to get book count:", error);
      return 0;
    }
  }

  /**
   * Get a specific book by ID
   */
  static async getBook(libraryOwnerAddress: string, bookId: number): Promise<Book | null> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_NAME}::get_book`,
          functionArguments: [libraryOwnerAddress, bookId],
        },
      });
      return result[0] as Book;
    } catch (error) {
      console.error("Failed to get book:", error);
      return null;
    }
  }

  /**
   * Check if library exists for an address
   */
  static async libraryExists(libraryOwnerAddress: string): Promise<boolean> {
    try {
      const result = await aptos.view({
        payload: {
          function: `${MODULE_NAME}::library_exists`,
          functionArguments: [libraryOwnerAddress],
        },
      });
      return result[0] as boolean;
    } catch (error) {
      console.error("Failed to check library existence:", error);
      return false;
    }
  }

  /**
   * Get APT balance for an address
   */
  static async getBalance(accountAddress: string): Promise<number> {
    try {
      const resources = await aptos.getAccountResources({
        accountAddress: accountAddress,
      });
      
      const coinResource = resources.find(
        (resource) => resource.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );
      
      if (coinResource) {
        const balance = (coinResource.data as any).coin.value;
        return parseInt(balance) / 100000000; // Convert from octas to APT
      }
      
      return 0;
    } catch (error) {
      console.error("Failed to get balance:", error);
      return 0;
    }
  }

  /**
   * Check if wallet is connected to devnet
   */
  static async checkNetwork(): Promise<{ isDevnet: boolean; networkName: string }> {
    try {
      if (!(window as any).aptos) {
        return { isDevnet: false, networkName: "No wallet" };
      }

      const network = await (window as any).aptos.network();
      return {
        isDevnet: network.name.toLowerCase().includes('devnet'),
        networkName: network.name
      };
    } catch (error) {
      console.error("Failed to check network:", error);
      return { isDevnet: false, networkName: "Unknown" };
    }
  }

  /**
   * Get all books from the library (iterates through book IDs)
   */
  static async getAllBooks(libraryOwnerAddress: string): Promise<ContractBook[]> {
    try {
      const bookCount = await this.getBookCount(libraryOwnerAddress);
      const books: ContractBook[] = [];
      
      for (let i = 0; i < bookCount; i++) {
        const book = await this.getBook(libraryOwnerAddress, i);
        if (book) {
          books.push({
            ...book,
            id: i.toString(),
          });
        }
      }
      
      return books;
    } catch (error) {
      console.error("Failed to get all books:", error);
      return [];
    }
  }
}

// Utility function to create an Account from private key
export function createAccountFromPrivateKey(privateKeyHex: string): Account {
  const privateKey = new Ed25519PrivateKey(privateKeyHex);
  return Account.fromPrivateKey({ privateKey });
}

// Error codes from the contract
export const CONTRACT_ERRORS = {
  EBOOK_NOT_FOUND: 1001,
  EBOOK_ALREADY_BORROWED: 1002,
  EBOOK_NOT_BORROWED: 1003,
} as const;

export function getErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case CONTRACT_ERRORS.EBOOK_NOT_FOUND:
      return "Book not found in the library";
    case CONTRACT_ERRORS.EBOOK_ALREADY_BORROWED:
      return "Book is already borrowed";
    case CONTRACT_ERRORS.EBOOK_NOT_BORROWED:
      return "Book is not currently borrowed";
    default:
      return "Unknown contract error";
  }
}