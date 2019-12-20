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
  segmentFilter = 'all';
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
      case 'recent':
      case 'changed':
      case 'finished': {
        this.loadOtherPromotions();
        break;
      }
      default: {
        this.loadAllPromotions();
        break;
      }
    }

  }

  loadOtherPromotions(){
    this.promotions = undefined;
    console.warn('Not yet implemented!');
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
