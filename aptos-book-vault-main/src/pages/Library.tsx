import React, { useState, useEffect } from "react";
import { useWallet } from "@/components/WalletProvider";
import { LibraryHeader } from "@/components/LibraryHeader";
import { BookCard } from "@/components/BookCard";
import { AddBookModal } from "@/components/AddBookModal";
import { SearchBar } from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LocalLibraryService, LocalBook } from "@/lib/localStorage";
import { LibraryContract } from "@/lib/contract";
import { Plus, BookOpen, Users, CheckCircle, AlertCircle, Wallet, Database } from "lucide-react";

export const Library: React.FC = () => {
  const { connected, account } = useWallet();
  const { toast } = useToast();
  
  // State management
  const [availableBooks, setAvailableBooks] = useState<LocalBook[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<LocalBook[]>([]);
  const [filteredAvailableBooks, setFilteredAvailableBooks] = useState<LocalBook[]>([]);
  const [filteredBorrowedBooks, setFilteredBorrowedBooks] = useState<LocalBook[]>([]);
  const [loading, setLoading] = useState<{ [bookId: string]: boolean }>({});
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize library on component mount
  useEffect(() => {
    initializeData();
  }, [account?.address]);

  const initializeData = () => {
    // Initialize local storage with sample data
    LocalLibraryService.initializeLibrary();
    loadBooks();
    setCategories(LocalLibraryService.getCategories());
  };

  const loadBooks = () => {
    const userAddress = account?.address;
    const available = LocalLibraryService.getAvailableBooks();
    const borrowed = userAddress ? LocalLibraryService.getBorrowedBooks(userAddress) : [];
    
    setAvailableBooks(available);
    setBorrowedBooks(borrowed);
    setFilteredAvailableBooks(available);
    setFilteredBorrowedBooks(borrowed);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
  };

  const applyFilters = (query: string, category: string) => {
    let available = LocalLibraryService.getAvailableBooks();
    let borrowed = account?.address ? LocalLibraryService.getBorrowedBooks(account.address) : [];

    // Apply search filter
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      available = available.filter(book => 
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.category.toLowerCase().includes(lowercaseQuery) ||
        book.isbn.toLowerCase().includes(lowercaseQuery)
      );
      borrowed = borrowed.filter(book => 
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        book.category.toLowerCase().includes(lowercaseQuery) ||
        book.isbn.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Apply category filter
    if (category) {
      available = available.filter(book => book.category === category);
      borrowed = borrowed.filter(book => book.category === category);
    }

    setFilteredAvailableBooks(available);
    setFilteredBorrowedBooks(borrowed);
  };

  const handleBorrowBook = async (bookId: string) => {
    if (!connected || !account?.address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to borrow books",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, [bookId]: true }));

    try {
      if (useBlockchain) {
        // Try blockchain first (if enabled)
        try {
          const txHash = await LibraryContract.borrowBookWithWallet(account.address, parseInt(bookId));
          
          // Also update local storage for immediate UI feedback
          LocalLibraryService.borrowBook(bookId, account.address);
          
          toast({
            title: "Success",
            description: `Book borrowed on blockchain! Real transaction submitted.`,
            action: (
              <a 
                href={`https://explorer.aptoslabs.com/txn/${txHash}?network=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline"
              >
                View on Explorer
              </a>
            ),
          });
        } catch (blockchainError: any) {
          console.error("Blockchain borrow failed:", blockchainError);
          // Fall back to local storage
          const success = LocalLibraryService.borrowBook(bookId, account.address);
          if (success) {
            toast({
              title: "Success",
              description: "Book borrowed successfully (local storage fallback)",
            });
          } else {
            throw new Error("Failed to borrow book");
          }
        }
      } else {
        // Use local storage
        const success = LocalLibraryService.borrowBook(bookId, account.address);
        if (success) {
          toast({
            title: "Success", 
            description: "Book borrowed successfully!"
          });
        } else {
          throw new Error("Book not available or already borrowed");
        }
      }

      loadBooks();
      applyFilters(searchQuery, selectedCategory);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to borrow book",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const handleReturnBook = async (bookId: string) => {
    if (!connected || !account?.address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to return books",
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, [bookId]: true }));

    try {
      if (useBlockchain) {
        // Try blockchain first (if enabled)
        try {
          const txHash = await LibraryContract.returnBookWithWallet(account.address, parseInt(bookId));
          
          // Also update local storage for immediate UI feedback
          LocalLibraryService.returnBook(bookId, account.address);
          
          toast({
            title: "Success",
            description: `Book returned on blockchain! Real transaction submitted.`,
            action: (
              <a 
                href={`https://explorer.aptoslabs.com/txn/${txHash}?network=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline"
              >
                View on Explorer
              </a>
            ),
          });
        } catch (blockchainError: any) {
          console.error("Blockchain return failed:", blockchainError);
          // Fall back to local storage
          const success = LocalLibraryService.returnBook(bookId, account.address);
          if (success) {
            toast({
              title: "Success",
              description: "Book returned successfully (local storage fallback)",
            });
          } else {
            throw new Error("Failed to return book");
          }
        }
      } else {
        // Use local storage
        const success = LocalLibraryService.returnBook(bookId, account.address);
        if (success) {
          toast({
            title: "Success",
            description: "Book returned successfully!"
          });
        } else {
          throw new Error("Book not found or not borrowed by you");
        }
      }

      loadBooks();
      applyFilters(searchQuery, selectedCategory);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to return book",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const handleBookAdded = () => {
    loadBooks();
    setCategories(LocalLibraryService.getCategories());
    applyFilters(searchQuery, selectedCategory);
  };

  const stats = {
    totalBooks: availableBooks.length + borrowedBooks.length,
    availableBooks: availableBooks.length,
    borrowedBooks: borrowedBooks.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <LibraryHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Status and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Connection Status */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${connected ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <Wallet className={`h-5 w-5 ${connected ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Wallet Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {connected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${useBlockchain ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                  <Database className={`h-5 w-5 ${useBlockchain ? 'text-blue-500' : 'text-orange-500'}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Storage Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    {useBlockchain ? 'Blockchain' : 'Local Storage'}
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseBlockchain(!useBlockchain)}
                className="w-full mt-4"
              >
                Switch to {useBlockchain ? 'Local' : 'Blockchain'}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stats.totalBooks}</h3>
                  <p className="text-sm text-muted-foreground">Total Books</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stats.availableBooks}</h3>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <Users className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stats.borrowedBooks}</h3>
                  <p className="text-sm text-muted-foreground">Borrowed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Warning */}
        {useBlockchain && (
          <Alert className="border-green-500/20 bg-green-500/10">
            <AlertCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              <strong>🚀 Real Blockchain Mode Active!</strong> Your transactions will appear on Aptos devnet explorer. 
              Make sure your Petra wallet is connected to devnet and has some APT for transaction fees.
              <br />
              <a 
                href="https://aptoslabs.com/testnet-faucet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium mt-1 inline-block"
              >
                Get devnet APT from faucet →
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <SearchBar
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          categories={categories}
          selectedCategory={selectedCategory}
        />

        {/* Add Book Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Library Management</h2>
            <p className="text-muted-foreground">Manage your digital library collection</p>
          </div>
          <Button onClick={() => setAddBookModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Available Books ({filteredAvailableBooks.length})
            </TabsTrigger>
            <TabsTrigger value="borrowed" className="gap-2">
              <Users className="h-4 w-4" />
              My Borrowed Books ({filteredBorrowedBooks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {filteredAvailableBooks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Books Available</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || selectedCategory 
                      ? "No books match your search criteria." 
                      : "The library is empty. Add some books to get started!"
                    }
                  </p>
                  {!searchQuery && !selectedCategory && (
                    <Button onClick={() => setAddBookModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Book
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAvailableBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={{
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      isbn: book.isbn,
                      edition: book.edition,
                      category: book.category,
                      description: book.description
                    }}
                    isBorrowed={false}
                    onBorrow={() => handleBorrowBook(book.id)}
                    loading={loading[book.id] || false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="borrowed">
            {!connected ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Please connect your wallet to view your borrowed books.
                  </p>
                </CardContent>
              </Card>
            ) : filteredBorrowedBooks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Borrowed Books</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory 
                      ? "No borrowed books match your search criteria."
                      : "You haven't borrowed any books yet. Check out the available books!"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBorrowedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={{
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      isbn: book.isbn,
                      edition: book.edition,
                      category: book.category,
                      description: book.description,
                      borrowedDate: book.borrowed_date
                    }}
                    isBorrowed={true}
                    onReturn={() => handleReturnBook(book.id)}
                    loading={loading[book.id] || false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Book Modal */}
      <AddBookModal
        open={addBookModalOpen}
        onOpenChange={setAddBookModalOpen}
        onBookAdded={handleBookAdded}
      />
    </div>
  );
};