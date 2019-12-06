import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationStart } from "@angular/router";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Event as NavigationEvent } from "@angular/router";
import { filter, take, finalize, switchMap, tap } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { NgForm } from '@angular/forms';
import { NewsItem } from '../models/news.item';
import { NewsItemDetail } from '../models/news.item.detail';
import { HttpEventType } from '@angular/common/http';
import { LocalFilesService } from '../services/localFiles.service';
import { concat, throwError, Observable, Subscriber } from 'rxjs';

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
    this.newsId = this.route.snapshot.paramMap.get('id');
  }

  ionViewWillEnter(){
    this.loadNewsData();
  }

  async loadNewsData(){
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

  async onSave(){  
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


    //TODO: save news item details
    this.saveNewsItem()
    .pipe(
      finalize(() => saving.dismiss())
    )
    .subscribe( res => {
      saveToast.present();
      this.editMode = false;
    });

  }

  private onCancel(){
    this.editMode = false;
  }

  async presentSaveConfirm(form: NgForm) {
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
      header: 'Cancel changes?',
      message: 'Without saving <strong>all changes will be lost</strong> <strong><i> forever </i></strong>.',
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


    //TODO: manual file uploading, put it into own component
    fileUploadProgress: string = null;
    newsItemSavedId: string;
  
   
  onFileLoaded(fileInput: any) {
    const fileData = <File>fileInput.target.files[0];
    this.localFileService.blobToBase64(fileData).pipe(take(1))
      .subscribe((img: { data: string, type: string }) => {
        console.log(`Loaded img: ${img.type}`);
        this.newsItem.overviewImageBase64 = img.data;
      });
  }
    
  saveNewsItem() {
    this.fileUploadProgress = '0%';

    //TODO: handle creation failure
    //TODO: handle new entity/ update entity
    if (this.newsItem._id) {
      console.log(`Updating newsItem with id ${this.newsItem._id}`);
    } else {
      console.log(`Creating newsItem`);
    }

    return this.dataService.createNewsItemManually(this.newsItem)
      .pipe(
        tap((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.fileUploadProgress = Math.round(res.loaded / res.total * 100) + '%';
            console.log(this.fileUploadProgress);
          } else if (res.type === HttpEventType.Response) {
            this.fileUploadProgress = '';
            this.newsItemSavedId = res.body._id;
            console.log(res);
          }
        })
      );
  }
  
    //end of manual file uploading
  
     //TODO: manual file uploading, put it into own component
     detailFileData: File = null;
     detailPreviewUrl:any = null;
     detailFileUploadProgress: string = null;
     uploadedDetailFilePath: string = null;
     detailImageReady : boolean = false;
  
     selectedNewsId: string;
   
     newsDetailItemSavedId: string;
   
    
     detailProgress(fileInput: any) {
           this.detailFileData = <File>fileInput.target.files[0];
           this.detailPreview();
     }
    
     detailPreview() {
         // Show preview 
         var mimeType = this.detailFileData.type;
         if (mimeType.match(/image\/*/) == null) {
           return;
         }
     
         var reader = new FileReader();      
         reader.readAsDataURL(this.detailFileData); 
         reader.onload = (_event) => { 
           this.detailPreviewUrl = reader.result; 
           this.detailImageReady = true;
         }
     }
     
     //TODO temporar solution, should be refactored
     onSubmitDetail() {
         const formData = new FormData();
           formData.append('file', this.detailFileData);
           // this.dataService.post('url/to/your/api', formData)
           //   .subscribe(res => {
           //     console.log(res);
           //     this.uploadedFilePath = res.data.filePath;
           //     alert('SUCCESS !!');
           //   })
   
           this.detailFileUploadProgress = '0%';
   
           let newsItemDetail = {
             _id: this.selectedNewsId,
             description:"some optional details description",  
             imageBase64: this.detailPreviewUrl,   //added when picture is loaded
            // testArray: new Array(20000000)  //to simulate high payload, so that progress is visible
           };
   
           //TODO: handle creation failure
           console.log(`Creating newsItemDetail ${newsItemDetail}`);
           this.dataService.createNewsItemDetails(newsItemDetail).subscribe((res) => {
             if(res.type === HttpEventType.UploadProgress) {
               this.detailFileUploadProgress = Math.round(res.loaded / res.total * 100) + '%';
               this.newsDetailItemSavedId = '';
               console.log(this.detailFileUploadProgress);
             } else if (res.type === HttpEventType.Response) {
               this.detailFileUploadProgress = '';
               this.newsDetailItemSavedId = res.body._id;
               console.log(res);      
               alert('NewsDetail succesfully saved!');
             }
           
           });
   
           this.detailImageReady = false;
     }
   
     //end of manual file uploading
   

}
