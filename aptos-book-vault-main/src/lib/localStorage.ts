// Local storage service for library management
export interface LocalBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  category: string;
  description: string;
  is_borrowed: boolean;
  borrowed_by?: string;
  borrowed_date?: string;
  created_at: string;
}

export class LocalLibraryService {
  private static readonly BOOKS_KEY = "library_books";
  private static readonly BORROWED_KEY = "borrowed_books";

  // Initialize with sample data if empty
  static initializeLibrary(): void {
    const books = this.getAllBooks();
    if (books.length === 0) {
      const sampleBooks: LocalBook[] = [
        {
          id: "1",
          title: "The Art of Computer Programming",
          author: "Donald Knuth",
          isbn: "978-0-201-89683-1",
          edition: "3rd Edition",
          category: "Computer Science",
          description: "A comprehensive monograph written by Donald Knuth that covers many kinds of programming algorithms.",
          is_borrowed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Clean Code",
          author: "Robert C. Martin",
          isbn: "978-0-13-235088-4",
          edition: "1st Edition",
          category: "Programming",
          description: "A handbook of agile software craftsmanship.",
          is_borrowed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Design Patterns",
          author: "Gang of Four",
          isbn: "978-0-201-63361-0",
          edition: "1st Edition",
          category: "Software Engineering",
          description: "Elements of Reusable Object-Oriented Software.",
          is_borrowed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Introduction to Algorithms",
          author: "Thomas H. Cormen",
          isbn: "978-0-262-03384-8",
          edition: "3rd Edition",
          category: "Computer Science",
          description: "A comprehensive textbook on computer algorithms.",
          is_borrowed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "5",
          title: "System Design Interview",
          author: "Alex Xu",
          isbn: "978-1-736049-12-4",
          edition: "1st Edition",
          category: "System Design",
          description: "An insider's guide to system design interviews.",
          is_borrowed: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "6",
          title: "Blockchain Basics",
          author: "Daniel Drescher",
          isbn: "978-1-4842-2604-9",
          edition: "1st Edition",
          category: "Blockchain",
          description: "A non-technical introduction in 25 steps.",
          is_borrowed: false,
          created_at: new Date().toISOString(),
        }
      ];
      
      localStorage.setItem(this.BOOKS_KEY, JSON.stringify(sampleBooks));
    }
  }

  static getAllBooks(): LocalBook[] {
    const books = localStorage.getItem(this.BOOKS_KEY);
    return books ? JSON.parse(books) : [];
  }

  static getAvailableBooks(): LocalBook[] {
    return this.getAllBooks().filter(book => !book.is_borrowed);
  }

  static getBorrowedBooks(userAddress?: string): LocalBook[] {
    const books = this.getAllBooks();
    if (!userAddress) {
      return books.filter(book => book.is_borrowed);
    }
    return books.filter(book => book.is_borrowed && book.borrowed_by === userAddress);
  }

  static borrowBook(bookId: string, userAddress: string): boolean {
    const books = this.getAllBooks();
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1 || books[bookIndex].is_borrowed) {
      return false;
    }

    books[bookIndex].is_borrowed = true;
    books[bookIndex].borrowed_by = userAddress;
    books[bookIndex].borrowed_date = new Date().toLocaleDateString();

    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
    return true;
  }

  static returnBook(bookId: string, userAddress: string): boolean {
    const books = this.getAllBooks();
    const bookIndex = books.findIndex(book => 
      book.id === bookId && 
      book.is_borrowed && 
      book.borrowed_by === userAddress
    );
    
    if (bookIndex === -1) {
      return false;
    }

    books[bookIndex].is_borrowed = false;
    delete books[bookIndex].borrowed_by;
    delete books[bookIndex].borrowed_date;

    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
    return true;
  }

  static addBook(book: Omit<LocalBook, 'id' | 'created_at'>): string {
    const books = this.getAllBooks();
    const newBook: LocalBook = {
      ...book,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    books.push(newBook);
    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
    return newBook.id;
  }

  static searchBooks(query: string): LocalBook[] {
    const books = this.getAllBooks();
    const lowercaseQuery = query.toLowerCase();
    
    return books.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.category.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.toLowerCase().includes(lowercaseQuery)
    );
  }

  static getBooksByCategory(category: string): LocalBook[] {
    return this.getAllBooks().filter(book => 
      book.category.toLowerCase() === category.toLowerCase()
    );
  }

  static getCategories(): string[] {
    const books = this.getAllBooks();
    const categories = new Set(books.map(book => book.category));
    return Array.from(categories).sort();
  }
}