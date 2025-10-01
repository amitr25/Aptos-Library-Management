import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Calendar, Hash } from "lucide-react";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    edition: string;
    category: string;
    description?: string;
    borrowedDate?: string;
  };
  isBorrowed: boolean;
  onBorrow?: () => void;
  onReturn?: () => void;
  loading?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isBorrowed,
  onBorrow,
  onReturn,
  loading = false
}) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 mb-2">
              {book.title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {book.category}
            </Badge>
          </div>
          <BookOpen className="h-5 w-5 text-primary/60 flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 py-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <User className="h-4 w-4 mr-2" />
          <span>{book.author}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Hash className="h-4 w-4 mr-2" />
          <span>ISBN: {book.isbn}</span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Edition:</span> {book.edition}
        </div>
        
        {isBorrowed && book.borrowedDate && (
          <div className="flex items-center text-sm text-accent">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Borrowed: {book.borrowedDate}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4">
        {isBorrowed ? (
          <Button 
            variant="outline" 
            className="w-full border-primary/20 hover:bg-primary/5"
            onClick={onReturn}
            disabled={loading}
          >
            {loading ? "Returning..." : "Return Book"}
          </Button>
        ) : (
          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={onBorrow}
            disabled={loading}
          >
            {loading ? "Borrowing..." : "Borrow Book"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};