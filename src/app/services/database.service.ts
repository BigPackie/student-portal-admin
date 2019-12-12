import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  readonly dbServicesUrl: string = "http://localhost:3000/database/";

  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get(this.dbServicesUrl + 'news');
  }

  getActiveNews(): Observable<any> {
    return this.http.get(this.dbServicesUrl + 'news/active');
  }

  getNewsItem(id: string): Observable<any> {
    return this.http.get(this.dbServicesUrl + "newsItem", { params: { "id": id } }).pipe(catchError(this.handleError));;
  }

  getNewsItemDetail(id: string): Observable<any> {
    return this.http.get(this.dbServicesUrl + "newsDetail", { params: { "id": id } }).pipe(catchError(this.handleError));;
  }

  saveNewsItem(newsItem: any): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'newsItem', { ...newsItem }, {
      reportProgress: true,
      observe: 'events'   
    })
      .pipe(catchError(this.handleError));
  }

  deleteNews(id: string): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'newsItem/delete', { "id": id })
      .pipe(catchError(this.handleError));
  }

  undeleteNews(id: string): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'newsItem/undelete', { "id": id })
      .pipe(catchError(this.handleError));
  }

  saveNewsItemDetail(newsItemDetail: any): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'newsDetail', { ...newsItemDetail }, {
      reportProgress: true,
      observe: 'events'   
    })
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
