module Library::Library {
    use std::signer;
    use std::string;
    use aptos_std::table_with_length;
    use aptos_std::table_with_length::{TableWithLength};

    /// Error code when attempting to access a book that doesn't exist in the library
    const EBOOK_NOT_FOUND: u64 = 1001;
    /// Error code when attempting to borrow a book that is already borrowed
    const EBOOK_ALREADY_BORROWED: u64 = 1002;
    /// Error code when attempting to return a book that is not currently borrowed
    const EBOOK_NOT_BORROWED: u64 = 1003;

    //
    // Book structure
    //
    struct Book has copy, drop, store {
        title: string::String,
        author: string::String,
        category: string::String,
        description: string::String,
        is_borrowed: bool,
    }

    //
    // Library resource
    //
    struct Library has key {
        books: TableWithLength<u64, Book>,
        next_id: u64,
    }

    //
    // Initialize Library (only once by admin)
    //
    public entry fun init_library(account: &signer) {
        move_to(account, Library {
            books: table_with_length::new<u64, Book>(),
            next_id: 0,
        });
    }

    //
    // Add a book
    //
    public entry fun add_book(
        account: &signer, 
        title: string::String, 
        author: string::String,
        category: string::String,
        description: string::String
    ) acquires Library {
        let library = borrow_global_mut<Library>(signer::address_of(account));
        let id = library.next_id;
        library.next_id = id + 1;

        let book = Book { 
            title, 
            author, 
            category,
            description,
            is_borrowed: false 
        };
        library.books.add(id, book);
    }

    //
    // Borrow a book
    //
    public entry fun borrow_book(account: &signer, book_id: u64) acquires Library {
        let library = borrow_global_mut<Library>(signer::address_of(account));

        if (!library.books.contains(book_id)) {
            abort EBOOK_NOT_FOUND;
        };

        let book_ref = library.books.borrow_mut(book_id);
        if (book_ref.is_borrowed) {
            abort EBOOK_ALREADY_BORROWED;
        };

        book_ref.is_borrowed = true;
    }

    //
    // Return a book
    //
    public entry fun return_book(account: &signer, book_id: u64) acquires Library {
        let library = borrow_global_mut<Library>(signer::address_of(account));

        if (!library.books.contains(book_id)) {
            abort EBOOK_NOT_FOUND;
        };

        let book_ref = library.books.borrow_mut(book_id);
        if (!book_ref.is_borrowed) {
            abort EBOOK_NOT_BORROWED;
        };

        book_ref.is_borrowed = false;
    }

    // View functions for getting book information
    #[view]
    public fun get_book_count(library_owner: address): u64 acquires Library {
        if (!exists<Library>(library_owner)) {
            return 0
        };
        let library = borrow_global<Library>(library_owner);
        table_with_length::length(&library.books)
    }

    #[view]
    public fun get_book(library_owner: address, book_id: u64): Book acquires Library {
        let library = borrow_global<Library>(library_owner);
        if (!library.books.contains(book_id)) {
            abort EBOOK_NOT_FOUND;
        };
        *library.books.borrow(book_id)
    }

    #[view]
    public fun library_exists(library_owner: address): bool {
        exists<Library>(library_owner)
    }
}