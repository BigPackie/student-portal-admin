import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { map, mergeMap } from "rxjs/operators";
import { DatabaseService } from './database.service';
import { LocalFilesService } from './localFiles.service';
import { TouchSequence } from 'selenium-webdriver';
import { NewsItem } from '../models/news.item';

export enum IMG_SRC_TYPE_PREFIX {
  Base64 = "data:image/jpeg;base64,"
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private databaseService: DatabaseService, private localFilesService: LocalFilesService) { 

   }

  // --- news ---

  createNewsItem(newsItem: any): Observable<any> {
    return this.localFilesService.getImage(undefined, newsItem.overviewImagePath).pipe(
      mergeMap((img: {data: string, type: string}) => {
        console.log(`Loaded img: ${img}`);
        newsItem.overviewImageBase64 = img.data;
        console.log(`newsItem.overviewImageBase64 ${newsItem.overviewImageBase64}`)
        return this.databaseService.saveNewsItem(newsItem);
      })
    )
  }

  saveNewsItemDetails(newsItemDetail: any): Observable<any> {
    return this.databaseService.saveNewsItemDetail(newsItemDetail);
  }

  saveNewsItem(newsItem: any): Observable<any> {
    newsItem.validFrom = this.startOfDay(newsItem.validFrom);
    newsItem.validTo = this.endOfDay(newsItem.validTo);

    return this.databaseService.saveNewsItem(newsItem);
  }

  //TODO: maybe it should continuously receive the data  1 by 1 and not return together as a field.
  getNews(): Observable<any> {
    return this.databaseService.getNews();
  }

  getActiveNews(): Observable<any> {
    return this.databaseService.getActiveNews();
  }

  getUpcomingNews(): Observable<any> {
    return this.databaseService.getUpcomingNews();
  }

  getRecentNews(): Observable<any> {
    return this.databaseService.getRecentNews();
  }

  getFinishedNews(): Observable<any> {
    return this.databaseService.getFinishedNews();
  }

  getNewsItem(id : any): Observable<any> {
    return this.databaseService.getNewsItem(id);
  }

  getNewsItemDetail(id: any): Observable<any> {
    return this.databaseService.getNewsItemDetail(id);
  }

  deleteNewsItem(id: any): Observable<any> {
    return this.databaseService.deleteNews(id);
  }

  undeleteNewsItem(id: any): Observable<any> {
    return this.databaseService.undeleteNews(id);
  }

  // --- end news ---

  // --- promotions ---

  createPromotion(promotion: any): Observable<any> {
    return this.localFilesService.getImage(undefined, promotion.overviewImagePath).pipe(
      mergeMap((img: {data: string, type: string}) => {
        console.log(`Loaded img: ${img}`);
        promotion.overviewImageBase64 = img.data;
        console.log(`promotion.overviewImageBase64 ${promotion.overviewImageBase64}`)
        return this.databaseService.savePromotion(promotion);
      })
    )
  }

  savePromotionDetail(promotionDetail: any): Observable<any> {
    return this.databaseService.savePromotionDetail(promotionDetail);
  }

  savePromotion(promotion: any): Observable<any> {
    promotion.validFrom = this.startOfDay(promotion.validFrom);
    promotion.validTo = this.endOfDay(promotion.validTo);

    return this.databaseService.savePromotion(promotion);
  }

  //TODO: maybe it should continuously receive the data  1 by 1 and not return together as a field.
  getPromotions(): Observable<any> {
    return this.databaseService.getPromotions();
  }

  getActivePromotions(): Observable<any> {
    return this.databaseService.getActivePromotions();
  }

  getUpcomingPromotions(): Observable<any> {
    return this.databaseService.getUpcomingPromotions();
  }

  getRecentPromotions(): Observable<any> {
    return this.databaseService.getRecentPromotions();
  }

  getFinishedPromotions(): Observable<any> {
    return this.databaseService.getFinishedPromotions();
  }

  getPromotion(id : any): Observable<any> {
    return this.databaseService.getPromotion(id);
  }

  getPromotionDetail(id: any): Observable<any> {
    return this.databaseService.getPromotionDetail(id);
  }

  deletePromotion(id: any): Observable<any> {
    return this.databaseService.deletePromotion(id);
  }

  undeletePromotion(id: any): Observable<any> {
    return this.databaseService.undeletePromotion(id);
  }

  // --- end promotions ---


  startOfDay(dateWithTimeZone: string): string {

    if (dateWithTimeZone === null || dateWithTimeZone === undefined || dateWithTimeZone === "") {
      return dateWithTimeZone;
    }

    //if the format is already in UTC ('Z' instead of '+00:00' at the end), it does not gets fixed
    // but that is okay, it means the user of admin app did not modify the date (which by default gets converted to UTC by mongoDB and returned in that format )
    return dateWithTimeZone.replace(/T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}\+/, "T00:00:00.000+");
  }

  endOfDay(dateWithTimeZone: string): string {

    if (dateWithTimeZone === null || dateWithTimeZone === undefined || dateWithTimeZone === "") {
      return dateWithTimeZone;
    }

    //if the format is already in UTC ('Z' instead of '+00:00' at the end), it does not gets fixed
    // but that is okay, it means the user of admin app did not modify the date (which by default gets converted to UTC by mongoDB and returned in that format )
    return dateWithTimeZone.replace(/T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}\+/, "T23:59:59.000+");
  }

}
