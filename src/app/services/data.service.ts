import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { map, mergeMap } from "rxjs/operators";
import { DatabaseService } from './database.service';
import { LocalFilesService } from './localFiles.service';
import { TouchSequence } from 'selenium-webdriver';

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
        return this.databaseService.createNewsItem(newsItem);
      })
    )
  }

  createNewsItemDetails(newsItemDetail: any): Observable<any> {
    return this.databaseService.createNewsItemDetail(newsItemDetail);
  }

  createNewsItemManually(newsItem: any): Observable<any> {
    return this.databaseService.createNewsItem(newsItem);
  }

  //TODO: maybe it should continuously receive the data  1 by 1 and not return together as a field.
  getNews(): Observable<any> {
    return this.databaseService.getNews();
  }

}
