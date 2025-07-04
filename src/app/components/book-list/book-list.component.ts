import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { BookFormComponent } from '../book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookDetailComponent, BookFormComponent],
  template: `
    <div class="container">
      <div class="search-container">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          placeholder="Search books..." 
          class="search-input"
        />
        <select [(ngModel)]="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Dystopian">Dystopian</option>
          <option value="Classic">Classic</option>
        </select>
      </div>

      <div class="books-header">
        <h2>Books Inventory</h2>
        <button class="add-button" (click)="showAddForm = true">Add New Book</button>
      </div>

      <div *ngIf="showAddForm" class="form-container">
        <app-book-form 
          [book]="null" 
          (save)="onBookAdded($event)" 
          (cancel)="showAddForm = false">
        </app-book-form>
      </div>

      <div class="books-stats">
        <div class="stat-card">
          <h3>Total Books</h3>
          <p>{{ getTotalBooks() }}</p>
        </div>
        <div class="stat-card">
          <h3>Low Stock</h3>
          <p>{{ getLowStockCount() }}</p>
        </div>
        <div class="stat-card">
          <h3>Out of Stock</h3>
          <p>{{ getOutOfStockCount() }}</p>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let book of filteredBooks" 
                [class.low-stock]="book.stock <= 2 && book.stock > 0"
                [class.out-of-stock]="book.stock <= 0">
              <td>{{ book.id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>{{ book.category }}</td>
              <td>{{ book.price | currency }}</td>
              <td>{{ book.stock }}</td>
              <td class="actions">
                <button class="action-button view" (click)="viewBook(book)">View</button>
                <button class="action-button edit" (click)="editBook(book)">Edit</button>
                <button class="action-button delete" (click)="deleteBook(book.id)">Delete</button>
                <div class="stock-controls">
                  <button class="stock-button" (click)="updateStock(book.id, '1')">+</button>
                  <button class="stock-button" (click)="updateStock(book.id, '-1')">-</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="selectedBook" class="modal-backdrop">
        <div class="modal">
          <app-book-detail 
            [book]="selectedBook" 
            (close)="selectedBook = null">
          </app-book-detail>
        </div>
      </div>

      <div *ngIf="bookToEdit" class="modal-backdrop">
        <div class="modal">
          <app-book-form 
            [book]="bookToEdit" 
            (save)="onBookUpdated($event)" 
            (cancel)="bookToEdit = null">
          </app-book-form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
    }

    .search-container {
      display: flex;
      margin-bottom: 24px;
      gap: 16px;
    }

    .search-input, .filter-select {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid #dddddd;
      flex: 1;
      font-size: 16px;
    }

    .books-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .add-button {
      background-color: #0A84FF;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .add-button:hover {
      background-color: #007AFF;
    }

    .books-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background-color: white;
      border-radius: 8px;
      padding: 16px;
      flex: 1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-card h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #555;
    }

    .stat-card p {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .table-container {
      overflow-x: auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f9f9f9;
      font-weight: 600;
    }

    .low-stock {
      background-color: #FFF3E0;
    }

    .out-of-stock {
      background-color: #FFEBEE;
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .action-button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .view {
      background-color: #E3F2FD;
      color: #1976D2;
    }

    .edit {
      background-color: #E8F5E9;
      color: #388E3C;
    }

    .delete {
      background-color: #FFEBEE;
      color: #D32F2F;
    }

    .stock-controls {
      display: flex;
      gap: 4px;
    }

    .stock-button {
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 4px;
      background-color: #f5f5f5;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background-color: white;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .form-container {
      background-color: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .books-stats {
        flex-direction: column;
      }
      
      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  filterCategory: string = '';
  selectedBook: Book | null = null;
  bookToEdit: Book | null = null;
  showAddForm: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredBooks = this.books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = 
        !this.filterCategory || book.category === this.filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  viewBook(book: Book): void {
    this.selectedBook = book;
  }

  editBook(book: Book): void {
    this.bookToEdit = book;
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id);
    }
  }

  updateStock(id: number, quantity: string): void {
    this.bookService.updateStock(id, quantity);
  }

  onBookAdded(book: Book): void {
    this.bookService.addBook(book);
    this.showAddForm = false;
  }

  onBookUpdated(book: Book): void {
    this.bookService.updateBook(book);
    this.bookToEdit = null;
  }

  getTotalBooks(): number {
    return this.bookService.getTotalBooks();
  }

  getLowStockCount(): number {
    return this.books.filter(book => book.stock > 0 && book.stock <= 2).length;
  }

  getOutOfStockCount(): number {
    return this.books.filter(book => book.stock <= 0).length;
  }
}