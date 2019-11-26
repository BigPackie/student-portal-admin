import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { map, mergeMap } from "rxjs/operators";
import { DatabaseService } from './database.service';
import { LocalFilesService } from './localFiles.service';

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

  createNewsItemManually(newsItem: any): Observable<any> {
    return this.databaseService.createNewsItem(newsItem);
  }

}
