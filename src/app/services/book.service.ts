import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, catchError } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private initialBooks: Book[] = [
    { 
      id: 1, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      isbn: '9780743273565', 
      price: 12.99, 
      stock: 5, 
      category: 'Fiction',
      publishDate: new Date('1925-04-10')
    },
    { 
      id: 2, 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      isbn: '9780061120084', 
      price: 14.99, 
      stock: 3, 
      category: 'Fiction',
      publishDate: new Date('1960-07-11')
    },
    { 
      id: 3, 
      title: 'The Hobbit', 
      author: 'J.R.R. Tolkien', 
      isbn: '9780547928227', 
      price: 11.99, 
      stock: 7, 
      category: 'Fantasy',
      publishDate: new Date('1937-09-21')
    },
    { 
      id: 4, // Fixed duplicate ID
      title: '1984', 
      author: 'George Orwell', 
      isbn: '9780451524935', 
      price: 9.99, 
      stock: 0, // Fixed negative stock
      category: 'Dystopian',
      publishDate: new Date('1949-06-08')
    },
    { 
      id: 5, 
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      isbn: '9780141439518', 
      price: 7.99, 
      stock: 0, 
      category: 'Classic',
      publishDate: new Date('1813-01-28')
    }
  ];

  private booksSubject = new BehaviorSubject<Book[]>(this.initialBooks);
  
  constructor() {}

  async searchOpenLibrary(query: string): Promise<Book[]> {
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch from Open Library');
      }
      
      const data = await response.json();
      return data.docs.slice(0, 10).map((book: any, index: number) => ({
        id: this.getNextId(),
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        isbn: book.isbn?.[0] || 'N/A',
        price: 9.99, // Default price
        stock: 0, // Default stock
        category: book.subject?.[0] || 'Uncategorized',
        publishDate: book.first_publish_year ? new Date(book.first_publish_year, 0, 1) : new Date()
      }));
    } catch (error) {
      console.error('Error fetching from Open Library:', error);
      return [];
    }
  }

  getBooks(): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }

  getBookById(id: number): Book | undefined {
    return this.booksSubject.value.find(book => book.id === id);
  }

  addBook(book: Book): void {
    const books = [...this.booksSubject.value, book];
    this.booksSubject.next(books);
  }

  updateBook(updatedBook: Book): void {
    const books = this.booksSubject.value.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    this.booksSubject.next(books);
  }

  deleteBook(id: number): void {
    const books = this.booksSubject.value.filter(book => book.id !== id);
    this.booksSubject.next(books);
  }

  updateStock(id: number, quantity: string): void {
    const numQuantity = parseInt(quantity);
    
    const books = this.booksSubject.value.map(book => {
      if (book.id === id) {
        const newStock = book.stock + numQuantity;
        book.stock = newStock;
      }
      return book;
    });
    this.booksSubject.next(books);
  }

  getTotalBooks(): number {
    return this.booksSubject.value.reduce((total, book) => total + book.stock, 0);
  }

  private getNextId(): number {
    const maxId = Math.max(...this.booksSubject.value.map(book => book.id), 0);
    return maxId + 1;
  }
}