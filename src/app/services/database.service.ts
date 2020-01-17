import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  readonly dbServicesUrl: string = environment.newsServicesUrl + "/database/";

  constructor(private http: HttpClient) { }

  // --- news ---

  getNews(): Observable<any> {
    return this.http.get(this.dbServicesUrl + 'news')
    .pipe(catchError(this.handleError));
  }

  getActiveNews(): Observable<any> {
    return this.http.get(this.dbServicesUrl + 'news/active')
    .pipe(catchError(this.handleError));
  }

  getNewsItem(id: string): Observable<any> {
    return this.http.get(this.dbServicesUrl + "newsItem", { params: { "id": id } })
    .pipe(catchError(this.handleError));
  }

  getNewsItemDetail(id: string): Observable<any> {
    return this.http.get(this.dbServicesUrl + "newsDetail", { params: { "id": id } })
    .pipe(catchError(this.handleError));
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

  // --- news end---

  // --- promotions ---

  getPromotions(): Observable<any> {
    return this.http.get(this.dbServicesUrl + 'promotions')
    .pipe(catchError(this.handleError));
  }

  getActivePromotions(): Observable<any> {
    return this.http.get(this.dbServicesUrl + 'promotions/active')
    .pipe(catchError(this.handleError));
  }

  getPromotion(id: string): Observable<any> {
    return this.http.get(this.dbServicesUrl + "promotion", { params: { "id": id } })
    .pipe(catchError(this.handleError));;
  }

  getPromotionDetail(id: string): Observable<any> {
    return this.http.get(this.dbServicesUrl + "promotionDetail", { params: { "id": id } })
    .pipe(catchError(this.handleError));;
  }

  savePromotion(promotion: any): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'promotion', { ...promotion }, {
      reportProgress: true,
      observe: 'events'   
    })
      .pipe(catchError(this.handleError));
  }

  deletePromotion(id: string): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'promotion/delete', { "id": id })
      .pipe(catchError(this.handleError));
  }

  undeletePromotion(id: string): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'promotion/undelete', { "id": id })
      .pipe(catchError(this.handleError));
  }

  savePromotionDetail(promotionDetail: any): Observable<any> {
    return this.http.post(this.dbServicesUrl + 'promotionDetail', { ...promotionDetail }, {
      reportProgress: true,
      observe: 'events'   
    })
      .pipe(catchError(this.handleError));
  }

  // --- promotions end---

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
