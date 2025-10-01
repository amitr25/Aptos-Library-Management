import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LocalLibraryService } from "@/lib/localStorage";

interface AddBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAdded: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({
  open,
  onOpenChange,
  onBookAdded
}) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    edition: "",
    category: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    "Computer Science",
    "Programming",
    "Software Engineering", 
    "System Design",
    "Blockchain",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "Mobile Development",
    "DevOps",
    "Cybersecurity",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      LocalLibraryService.addBook({
        ...formData,
        is_borrowed: false
      });

      toast({
        title: "Success",
        description: "Book added successfully!"
      });

      setFormData({
        title: "",
        author: "",
        isbn: "",
        edition: "",
        category: "",
        description: ""
      });
      
      onBookAdded();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleInputChange("isbn", e.target.value)}
                placeholder="978-0-123-45678-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                value={formData.edition}
                onChange={(e) => handleInputChange("edition", e.target.value)}
                placeholder="1st Edition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter book description"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};