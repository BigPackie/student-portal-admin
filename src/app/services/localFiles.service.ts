import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subscriber, throwError } from 'rxjs'
import { map, mergeMap, concatMap } from 'rxjs/operators'
import { DomSanitizer } from '@angular/platform-browser';
import { ReadVarExpr } from '@angular/compiler';
 
@Injectable({
  providedIn: 'root'
})
export class LocalFilesService {

  private readonly allowedImageTypes = ['image/png', 'image/jpg', 'image/gif', 'image/svg+xml']

    private readonly localPath: string = 'assets';

  constructor(private http: HttpClient, private sanitizer : DomSanitizer) { 

  }

  getImage(path: string = this.localPath, imageName?: string): Observable<{data: string, type: string}> {
    if (imageName) {
      return this.http.get(path + '/' + imageName, { responseType: 'blob' })
        .pipe(
          concatMap(blob => this.blobToBase64(blob))
        );
    } else {
      return this.http.get(path, { responseType: 'blob' })
        .pipe(
          concatMap(blob => this.blobToBase64(blob))
        );
    }
  }

  blobToBase64(blob : Blob): Observable<{data: string, type: string}>{
    console.log(`blob size: ${blob.size} bytes`);
    console.log(`blob type: ${blob.type}`);

    if(!this.allowedImageTypes.includes(blob.type)){
      console.error(`Not valid data type. Please upload image of type ${this.allowedImageTypes}`);
      throwError(`Not valid data type. Please upload image of type ${this.allowedImageTypes}`);
    }

    const fileReader = new FileReader();

    return Observable.create((observer: Subscriber<any>) => {
      //success
      fileReader.onload = (ev: ProgressEvent): void => {

        let convertedString = fileReader.result;
        let base64DataPrefix = this.getBase64DataPrefix(blob.type);

        if(!this.isBase64ImageValid(convertedString, base64DataPrefix)){
          observer.error(`Not valid base64 image.`);
        }

        console.log(`Convertion to base64 successful: ${convertedString}`);

        observer.next({data: convertedString, type: blob.type});
        //observer.next({data: this.removeBase64DataPrefix(convertedString as string), type: blob.type});

        observer.complete();
      }

      //error
      fileReader.onerror = (error) => {
        console.warn("Covertion to base64 failed:", error);
        observer.error(error);
      }

      fileReader.readAsDataURL(blob);
    })
  }

  removeBase64DataPrefix(base64: string): string {
    return base64.split(',')[1];
  }

  getBase64DataPrefix(imgDataType: string): string {
    return `data:${imgDataType};base64,`;
  }

  isBase64ImageValid( base64Uri: any, base64DataPrefix: string): boolean{
    return  typeof base64Uri == 'string' && base64Uri.includes(base64DataPrefix);
  }
}
