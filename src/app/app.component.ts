import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookListComponent } from './components/book-list/book-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookListComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>Book Stock Manager</h1>
        <p>Manage your book inventory with ease</p>
      </header>
      
      <main>
        <app-book-list></app-book-list>
      </main>

      <footer>
        <p>© 2025 Book Stock Manager | Debugging Practice App</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f7;
    }

    header {
      background-color: #0A84FF;
      color: white;
      padding: 24px;
      text-align: center;
    }

    header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
    }

    main {
      flex: 1;
      padding: 24px;
    }

    footer {
      background-color: #f8f8f8;
      color: #666;
      text-align: center;
      padding: 16px;
      margin-top: auto;
      font-size: 14px;
    }
  `]
})
export class AppComponent {
  title = 'Book Stock Manager';
}