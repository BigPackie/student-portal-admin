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
