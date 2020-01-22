import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationStart } from "@angular/router";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Event as NavigationEvent } from "@angular/router";
import { filter, take, finalize, switchMap, tap, catchError, concatMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { NgForm } from '@angular/forms';
import { NewsItem } from '../models/news.item';
import { NewsItemDetail } from "../models/news.item.detail";
import { HttpEventType } from '@angular/common/http';
import { LocalFilesService } from '../services/localFiles.service';
import { concat, throwError, Observable, Subscriber, of } from 'rxjs';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.page.html',
  styleUrls: ['./news-edit.page.scss'],
})
export class NewsEditPage implements OnInit {

  newsId: any;

  editMode: boolean = false;

  newsDataLoaded : boolean = false;

  newsItem: NewsItem = new NewsItem();

  newsItemDetail: NewsItemDetail = new NewsItemDetail();

  submitted = false;

  newsItemDetailUploadProgress: number = 0;
  newsItemUploadProgress: number = 0;
  newsItemSavedId: string;

  today;

  constructor(private route: ActivatedRoute,
              private alertController: AlertController, 
              private router:Router,
              private dataService : DataService,
              private localFileService : LocalFilesService,
              private loadingController: LoadingController,
              private toastController: ToastController) { 

    //TODO: need to prevent back button if confirm alert is visible or if in edit mode.
  }

  ngOnInit() {
    this.setMinDate();
    this.newsId = this.route.snapshot.paramMap.get('id');

    //we are adding new news item
    if(!this.newsId){
      this.editMode = true;
    }
  }

  ionViewWillEnter(){
    this.loadNewsData();
  }

  setMinDate(){
    this.today = new Date().toISOString();
  }

  async loadNewsData(){

    //we are adding new news item
    if(!this.newsId){
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Getting news data',
    });

    await loading.present();

    // console.log(`Getting data for news item ${this.newsId}`);
    // this.dataService.getNewsItem(this.newsId)
    //   .pipe(
    //     take(1),
    //     finalize(() => loading.dismiss()))
    //   .subscribe(res => {
    //     console.log(`Title ${res.name}`)
    //     this.newsItem = { ...res };
    //     console.log(`Getting data for news detail ${this.newsId}`);
    //     this.dataService.getNewsItemDetail(this.newsId).pipe(take(1)).subscribe(res => {
    //       this.newsItemDetail = { ...res };
    //       this.newsDataLoaded = true;
    //     });
    //   });

    concat(
      this.dataService.getNewsItem(this.newsId)
        .pipe(
          take(1),
          tap((newsItem: NewsItem) => {
            if (!newsItem) {
              throw new Error(`NewsItem with id '${this.newsId}' does not exist`);
            }
            console.log(`Got newsItem.`);
            this.newsItem = { ...newsItem };
          })
        ),
      this.dataService.getNewsItemDetail(this.newsId)
        .pipe(
          take(1),
          tap((newsItemDetail: NewsItemDetail) => {
            console.log(`Got newsItemDetail.`);
            this.newsItemDetail = { ...newsItemDetail }
          })
        )
    ).pipe(
      finalize(() => {
        loading.dismiss();
        console.log(`Getting news data ended`);
      })
    ).subscribe();
  }


  onEdit(){
    this.editMode = true;
  }

  async onSave() {
    //console.log(`valid form, do stuff`);

    const saving = await this.loadingController.create({
      message: 'Saving news data',
    });

    await saving.present();

    const saveToast = await this.toastController.create({
      header: 'News saved',
      message: 'News successfully saved to database',
      position: 'top',
      duration: 3000
    });

    // concat(
    //   this.saveNewsItem(),
    //   this.saveNewsItemDetail()
    // ).pipe(
    //   catchError(this.savingFailed),
    //   finalize(() => saving.dismiss())
    // ).subscribe(res => {
    //   saveToast.present();
    //   this.editMode = false;
    //   if(!this.newsId){
    //     this.redirectOnAdding();
    //   }
    // });

    //TODO: needs refactoring (looks ugly, error catching is duplicate),
    // note returning http progress of uploading makes the observables fire more time
    //should wait for first observable to fnish completely (don't emit any more)
    this.saveNewsItem()
      .pipe(
        catchError((err) => this.savingFailed(`Saving of news item failed.`, saving))
      ).subscribe(res => {
        if(res.type === HttpEventType.Response){
          console.log(`Saving news fnished sucessfully, going to save details...`);
          this.saveNewsItemDetail()
          .pipe(
            catchError((err) => this.savingFailed(`Saving of news item detail failed.`, saving)),
            finalize(() => saving.dismiss())
          ).subscribe(res => {
            if(res.type === HttpEventType.Response){
              saveToast.present();
              this.editMode = false;
              if (!this.newsId) {
                this.redirectOnAdding();
              }
            }
          })
        }
      });

    // of()
    // .pipe(
    //   concatMap(() => this.saveNewsItem().pipe(take(1))),
    //   concatMap(() => this.saveNewsItemDetail().pipe(take(1))),
    //   catchError(this.savingFailed),
    //   finalize(() => saving.dismiss()),
    // )
    // .subscribe(res => {
    //   saveToast.present();
    //   this.editMode = false;
    //   if(!this.newsId){
    //     this.redirectOnAdding();
    //   }
    // });
  }

  redirectOnAdding(){
    this.router.navigate(['/news-edit/' + this.newsItem._id]);
  }

  async savingFailed(error: any, savingLoading: HTMLIonLoadingElement) {
    console.log('Saving failed:' + error);

    savingLoading.dismiss();
    
    const savingFailedToast = await this.toastController.create({
      header: 'Saving failed',
      message: error,
      position: 'top',
      showCloseButton : true
    });

    savingFailedToast.present();
  }

  private onCancel(){
    this.editMode = false;
  }

  async presentSaveConfirm() {
    const alert = await this.alertController.create({
      header: 'Save?',
      message: 'Are you <strong>sure</strong> you want to save changes?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.onSave();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentCancelConfirm() {
    const alert = await this.alertController.create({
      header: 'Exit edit mode?',
      message: 'Changes are temporarily visible but without saving they will disapper on page reload. <br><strong>Exit edit mode?</strong>',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.onCancel();
          }
        }
      ]
    });

    await alert.present();
  }
  
   
  onFileLoaded(fileInput: any, detail = false) {
    const fileData = <File>fileInput.target.files[0];
    this.localFileService.blobToBase64(fileData).pipe(take(1))
      .subscribe((img: { data: string, type: string }) => {
        console.log(`Loaded img: ${img.type}`);
        if (detail) {
          this.newsItemDetail.imageBase64 = img.data;
        } else {
          this.newsItem.overviewImageBase64 = img.data;
        }
      });
  }
    
  saveNewsItem() {
    this.newsItemUploadProgress = 0.01;

    //TODO: handle creation failure
    if (this.newsItem._id) {
      console.log(`Updating newsItem with id ${this.newsItem._id}`);
    } else {
      console.log(`Creating newsItem`);
    }

    return this.dataService.saveNewsItem(this.newsItem)
      .pipe(
        tap((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.newsItemUploadProgress = Number((res.loaded / res.total).toFixed(2));
            console.log('Uploading news item: ' + this.newsItemUploadProgress);
          } else if (res.type === HttpEventType.Response) {
            this.newsItemUploadProgress = 0;
            this.newsItem = res.body;
            console.log('News item succesfully saved');
          }
        })
      );
  }
  
  saveNewsItemDetail() {
    this.newsItemDetailUploadProgress = 0.01;

    //TODO: handle creation failure
    if (this.newsItemDetail._id) {
      console.log(`Updating newsItemDetails with id ${this.newsItemDetail._id}`);
    } else {
      console.log(`Creating newsItemDetails`);
    }

    this.newsItemDetail._id = this.newsItem._id; //id of those object should be same

    return this.dataService.saveNewsItemDetails(this.newsItemDetail)
      .pipe(
        tap((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.newsItemDetailUploadProgress = Number((res.loaded / res.total).toFixed(2));
            console.log('Uplaoding news item detail: ' + this.newsItemDetailUploadProgress);
          } else if (res.type === HttpEventType.Response) {
            this.newsItemDetailUploadProgress = 0;
            this.newsItemDetail = res.body;
            console.log('News item detail succesfully saved');
          }
        })
      );
  }

  removeDetailImage(){
    this.newsItemDetail.imageBase64 = "";
  }

  showNewsItemErrorPicture(imgElement) {
    console.warn("Picture loading failed, probably corrupted data in the database.");
    imgElement.src = ErrorPictures.newsItemErrorPicture;
  }

  showNewsItemDetailErrorPicture(imgElement) {
    console.warn("Detail picture loading failed, probably corrupted data in the database.");
    imgElement.src = ErrorPictures.newsItemHalfDetailErrorPicture;
  }
}
