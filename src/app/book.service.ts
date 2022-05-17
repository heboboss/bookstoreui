import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from './book';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  url = 'http://localhost:5000';
  headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
      
  constructor(private http: HttpClient) { }

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url + '/GetAllBooks',
    {
      headers:
        this.headers
    });
  }

  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(this.url + '/GetBookById/id?id=/' + bookId);
  }

  createBook(book: Book): Observable<Book> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Book>(this.url + '/CreateBook/',
    book, httpOptions);
  }

  updateBook(book: Book): Observable<Book> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<Book>(this.url + '/UpdateBook/',
    book, httpOptions);
  }

  deleteBookById(bookId: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/DeleteBook?id=' + bookId,
      httpOptions);
  }
}
