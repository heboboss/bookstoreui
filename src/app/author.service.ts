import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Author } from './utils';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  url = 'http://localhost:5000';
  headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
      
  constructor(private http: HttpClient) { }

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url + '/GetAllAuthors',
    {
      headers:
        this.headers
    });
  }

  getAuthorById(authorId: number): Observable<Author> {
    return this.http.get<Author>(this.url + '/GetAuthorById/id?id=/' + authorId);
  }

  createAuthor(author: Author): Observable<Author> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Author>(this.url + '/CreateAuthor/',
    author, httpOptions);
  }

  updateAuthor(author: Author): Observable<Author> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<Author>(this.url + '/UpdateAuthor/',
    author, httpOptions);
  }

  deleteAuthorById(authorId: number): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/DeleteAuthor?id=' + authorId,
      httpOptions);
  }
}
