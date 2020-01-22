import { Component, OnInit } from '@angular/core';
import { Promotion } from '../models/promotion';
import { PromotionDetail } from '../models/promotion.detail';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { LocalFilesService } from '../services/localFiles.service';
import { concat } from 'rxjs';
import { take, tap, finalize, catchError } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-promotion-edit',
  templateUrl: './promotion-edit.page.html',
  styleUrls: ['./promotion-edit.page.scss'],
})
export class PromotionEditPage implements OnInit {

  promotionId: any;

  editMode: boolean = false;

  promotion: Promotion = new Promotion();

  promotionDetail: PromotionDetail = new PromotionDetail();

  promotionDetailUploadProgress: number = 0;
  promotionUploadProgress: number = 0;

  today: any;

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
    this.promotionId = this.route.snapshot.paramMap.get('id');

    //we are adding new promotion
    if(!this.promotionId){
      this.editMode = true;
    }
  }

  ionViewWillEnter(){
    this.loadPromotionData();
  }

  setMinDate(){
    this.today = new Date().toISOString();
  }

  async loadPromotionData() {

    //we are adding new promotion, nothing to load
    if (!this.promotionId) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Getting promotion data',
    });

    await loading.present();

    concat(
      this.dataService.getPromotion(this.promotionId)
        .pipe(
          take(1),
          tap((promotion: Promotion) => {
            if (!promotion) {
              throw new Error(`Promotion with id '${this.promotionId}' does not exist`);
            }
            console.log(`Got promotion.`);
            this.promotion = { ...promotion };
          })
        ),
      this.dataService.getPromotionDetail(this.promotionId)
        .pipe(
          take(1),
          tap((promotionDetail: PromotionDetail) => {
            console.log(`Got promotionDetail.`);
            this.promotionDetail = { ...promotionDetail }
          })
        )
    ).pipe(
      finalize(() => {
        loading.dismiss();
        console.log(`Getting promotion data ended`);
      })
    ).subscribe();
  }


  onEdit(){
    this.editMode = true;
  }

  async onSave() {

    const saving = await this.loadingController.create({
      message: 'Saving promotion data',
    });

    await saving.present();

    const saveToast = await this.toastController.create({
      header: 'Promotion saved',
      message: 'Promotion successfully saved to database',
      position: 'top',
      duration: 3000
    });

    //TODO: needs refactoring (looks ugly, error catching is duplicate),
    // note returning http progress of uploading makes the observables fire more time
    //should wait for first observable to fnish completely (don't emit any more)
    this.savePromotion()
      .pipe(
        catchError((err) => this.savingFailed(`Saving of promotion item failed.`, saving))
      ).subscribe(res => {
        if(res.type === HttpEventType.Response){
          console.log(`Saving promotion fnished sucessfully, going to save details...`);
          this.savePromotionDetail()
          .pipe(
            catchError((err) => this.savingFailed(`Saving of promotion detail failed.`, saving)),
            finalize(() => saving.dismiss())
          ).subscribe(res => {
            if(res.type === HttpEventType.Response){
              saveToast.present();
              this.editMode = false;
              if (!this.promotionId) {
                this.redirectOnAdding();
              }
            }
          })
        }
      });
  }

  redirectOnAdding(){
    this.router.navigate(['/promotion-edit/' + this.promotion._id]);
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
          this.promotionDetail.imageBase64 = img.data;
        } else {
          this.promotion.overviewImageBase64 = img.data;
        }
      });
  }
    
  savePromotion() {
    this.promotionUploadProgress = 0.01;

    //TODO: handle creation failure
    if (this.promotion._id) {
      console.log(`Updating promotion with id ${this.promotion._id}`);
    } else {
      console.log(`Creating promotion`);
    }

    return this.dataService.savePromotion(this.promotion)
      .pipe(
        tap((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.promotionUploadProgress = Number((res.loaded / res.total).toFixed(2));
            console.log('Uploading promotion: ' + this.promotionUploadProgress);
          } else if (res.type === HttpEventType.Response) {
            this.promotionUploadProgress = 0;
            this.promotion = res.body;
            console.log('Promotion succesfully saved');
          }
        })
      );
  }
  
  savePromotionDetail() {
    this.promotionDetailUploadProgress = 0.01;

    //TODO: handle creation failure
    if (this.promotionDetail._id) {
      console.log(`Updating promotionDetail with id ${this.promotionDetail._id}`);
    } else {
      console.log(`Creating promotionDetail`);
    }

    this.promotionDetail._id = this.promotion._id; //id of those object should be same

    return this.dataService.savePromotionDetail(this.promotionDetail)
      .pipe(
        tap((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.promotionDetailUploadProgress = Number((res.loaded / res.total).toFixed(2));
            console.log('Uplaoding promotion detail: ' + this.promotionDetailUploadProgress);
          } else if (res.type === HttpEventType.Response) {
            this.promotionDetailUploadProgress = 0;
            this.promotionDetail = res.body;
            console.log('Promotion detail succesfully saved');
          }
        })
      );
  }

  removeDetailImage(){
    this.promotionDetail.imageBase64 = "";
  }

  showPromotionErrorPicture(imgElement) {
    console.warn("Picture loading failed, probably corrupted data in the database.");
    imgElement.src = ErrorPictures.promotionErrorPicture;
  }

  showPromotionDetailErrorPicture(imgElement) {
    console.warn("Detail picture loading failed, probably corrupted data in the database.");
    imgElement.src = ErrorPictures.promotionHalfDetailErrorPicture;
  }

}
