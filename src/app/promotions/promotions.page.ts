import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.page.html',
  styleUrls: ['./promotions.page.scss'],
})
export class PromotionsPage implements OnInit {

  queryText = '';
  segmentFilter = 'active';
  promotions: any[];

  constructor(private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.updatePromotions();
  }

  updatePromotions(){
    switch(this.segmentFilter){
      case 'active': {
        this.loadActivePromotions();
        break;
      }
      case 'upcoming': {
        this.loadUpcomingPromotions();
        break;
      }
      case 'recent':
        this.loadRecentlyModified();
        break;
      case 'finished': {
        this.loadFinished();
        break;
      }
      case 'all': {
        this.loadAllPromotions();
        break;
      }
    }
  }

  loadRecentlyModified(){ 
    console.log("loading recently modified promotions (top 5)...");
    this.promotions = undefined;
    this.dataService.getRecentPromotions().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} promotions`)
        this.promotions = res;
      });
  }

  loadFinished(){ 
    console.log("loading finished or deleted promotions...");
    this.promotions = undefined;
    this.dataService.getFinishedPromotions().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} promotions`)
        this.promotions = res;
      });
  }

  loadAllPromotions(){
    console.log("loading all promotions...");
    this.promotions = undefined; //just to show the `Loading promotions spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getPromotions().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} promotions.`)
        this.promotions = res;
      });
  }

  loadUpcomingPromotions(){
    console.log("loading active promotions...");
    this.promotions = undefined; //just to show the `Loading promotions spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getUpcomingPromotions().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} promotions.`)
        this.promotions = res;
      });
  }

  loadActivePromotions(){
    console.log("loading active promotions...");
    this.promotions = undefined; //just to show the `Loading promotions spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getActivePromotions().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} promotions.`)
        this.promotions = res;
      });
  }

  //TODO: change placeholder image to local image from assets
  showPlaceHolderOnError(imgElement) {
    imgElement.src = ErrorPictures.promotionErrorPicture;
  }

  async presentDeleteConfirm(id: string) {
    const alert = await this.alertController.create({
      header: 'Delete?',
      message: 'Are you <strong>sure</strong> you want to delete this promotion?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: () => {
            this.onDelete(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentUndeleteConfirm(id: string) {
    const alert = await this.alertController.create({
      header: 'Delete?',
      message: `Are you <strong>sure</strong> you want to undelete the promotion? It is <strong>going to be visible</strong> to all users if it's date is valid(active)`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Activate',
          handler: () => {
            this.onUndelete(id);
          }
        }
      ]
    });

    await alert.present();
  }

  onUndelete(id){
    this.dataService.undeletePromotion(id).pipe(take(1)).subscribe(() => this.updatePromotions());
  }

  onDelete(id: string){
    this.dataService.deletePromotion(id).pipe(take(1)).subscribe(() => this.updatePromotions());
  }


}
