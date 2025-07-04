import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="book-detail">
      <div class="book-detail-header">
        <h2>Book Details</h2>
        <button class="close-button" (click)="close.emit()">×</button>
      </div>
      
      <div class="book-detail-content">
        <div class="detail-row">
          <span class="label">ID:</span>
          <span class="value">{{ book.id }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Title:</span>
          <span class="value">{{ book.title }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Author:</span>
          <span class="value">{{ book.author }}</span>
        </div>
        <div class="detail-row">
          <span class="label">ISBN:</span>
          <span class="value">{{ book.isbn }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Category:</span>
          <span class="value">{{ book.category }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Price:</span>
          <span class="value">{{ book.price | currency }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Stock:</span>
          <span class="value" [class.out-of-stock]="book.stock <= 0">
            {{ book.stock }}
          </span>
        </div>
        <div class="detail-row">
          <span class="label">Published:</span>
          <span class="value">{{ book.publishDate | date:'mediumDate' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-detail {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .book-detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: #f9f9f9;
      border-bottom: 1px solid #eee;
    }

    .book-detail-header h2 {
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

    .book-detail-content {
      padding: 16px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f1f1;
    }

    .label {
      font-weight: 600;
      width: 100px;
      color: #555;
    }

    .value {
      flex: 1;
    }

    .out-of-stock {
      color: #FF453A;
      font-weight: 600;
    }
  `]
})
export class BookDetailComponent {
  @Input() book!: Book;
  @Output() close = new EventEmitter<void>();
}