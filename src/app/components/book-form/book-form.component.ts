import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="book-form">
      <div class="form-header">
        <h2>{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h2>
        <button class="close-button" (click)="cancel.emit()">×</button>
      </div>

      <div class="form-content">
        <div class="form-group">
          <label for="id">ID</label>
          <input type="number" id="id" [(ngModel)]="formData.id" [disabled]="isEditing">
        </div>

        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" [(ngModel)]="formData.title" required>
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input type="text" id="author" [(ngModel)]="formData.author" required>
        </div>

        <div class="form-group">
          <label for="isbn">ISBN</label>
          <input type="text" id="isbn" [(ngModel)]="formData.isbn" required>
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" [(ngModel)]="formData.category" required>
            <option value="Fiction">Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Dystopian">Dystopian</option>
            <option value="Classic">Classic</option>
            <option value="Biography">Biography</option>
            <option value="Science">Science</option>
          </select>
        </div>

        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" [(ngModel)]="formData.price" step="0.01" required>
        </div>

        <div class="form-group">
          <label for="stock">Stock</label>
          <input type="number" id="stock" [(ngModel)]="formData.stock" required>
        </div>

        <div class="form-group">
          <label for="publishDate">Publish Date</label>
          <input type="date" id="publishDate" 
            [ngModel]="formData.publishDate | date:'yyyy-MM-dd'" 
            (ngModelChange)="formData.publishDate = $event" 
            required>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" (click)="cancel.emit()">Cancel</button>
          <button type="button" class="save-button" (click)="onSave()">Save</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-form {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
    }

    .form-header h2 {
      margin: 0;
      font-size: 18px;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .form-content {
      padding: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    input:focus, select:focus {
      border-color: #0A84FF;
      outline: none;
      box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }

    .cancel-button {
      background-color: #f5f5f5;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .save-button {
      background-color: #0A84FF;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .save-button:hover {
      background-color: #007AFF;
    }
  `]
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() save = new EventEmitter<Book>();
  @Output() cancel = new EventEmitter<void>();

  formData: Book = this.getEmptyBook();
  isEditing: boolean = false;

  ngOnInit(): void {
    this.isEditing = !!this.book;
    if (this.book) {
      this.formData = this.book;
    } else {
      this.formData = this.getEmptyBook();
      this.formData.id = this.getNextId();
    }
  }

  onSave(): void {
    this.save.emit(this.formData);
  }

  private getEmptyBook(): Book {
    return {
      id: 0,
      title: '',
      author: '',
      isbn: '',
      price: 0,
      stock: 0,
      category: 'Fiction',
      publishDate: new Date()
    };
  }

  private getNextId(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }
}