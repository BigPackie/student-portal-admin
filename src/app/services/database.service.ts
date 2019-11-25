import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get('http://localhost:3000/database/news');
  }

  createNewsItem(newsItem: any): Observable<any> {
    return this.http.post('http://localhost:3000/database/news', { ...newsItem })
      .pipe(catchError(this.handleError));
  }


  //TODO: globaly in interceptor?
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(errorMessage);
  }
 
}
