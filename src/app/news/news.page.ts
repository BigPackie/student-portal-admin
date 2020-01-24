import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { take } from 'rxjs/operators';
import { ErrorPictures } from '../services/errorPictures';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  // Gets a reference to the list element
  @ViewChild('newsList', { static: true }) newsListElement: IonList;

  queryText = '';
  segmentFilter = 'active';
  news: any[];

  constructor(private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.updateNews();
  }

  updateNews(){
    switch(this.segmentFilter){
      case 'active': {
        this.loadActiveNews();
        break;
      }
      case 'upcoming': {
        this.loadUpcomingNews();
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
        this.loadAllNews();
        break;
      }
    }

  }

  loadRecentlyModified(){ 
    console.log("loading recently modified news (top 5)...");
    this.news = undefined;
    this.dataService.getRecentNews().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} news`)
        this.news = res;
      });
  }

  loadFinished(){ 
    console.log("loading finished or deleted news...");
    this.news = undefined;
    this.dataService.getFinishedNews().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} news`)
        this.news = res;
      });
  }

  loadAllNews(){
    console.log("loading all news...");
    this.news = undefined; //just to show the `Loading news spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getNews().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} news`)
        this.news = res;
      });
  }

  loadUpcomingNews(){
    console.log("loading upcoming news...");
    this.news = undefined; //just to show the `Loading news spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getUpcomingNews().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} news`)
        this.news = res;
      });
  }

  loadActiveNews(){
    console.log("loading active news...");
    this.news = undefined; //just to show the `Loading news spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getActiveNews().pipe(take(1))
      .subscribe((res) => {
        console.log(`Loaded ${res.length} news`)
        this.news = res;
      });
  }

  showPlaceHolderOnError(imgElement) {
    imgElement.src = ErrorPictures.newsItemErrorPicture;
  }

  async presentDeleteConfirm(id: string) {
    const alert = await this.alertController.create({
      header: 'Delete?',
      message: 'Are you <strong>sure</strong> you want to delete the news?',
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
      message: `Are you <strong>sure</strong> you want to undelete the news? It is <strong>going to be visible</strong> to all users if it's date is valid(active)`,
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
    this.dataService.undeleteNewsItem(id).pipe(take(1)).subscribe(() => this.updateNews());
  }

  onDelete(id: string){
    this.dataService.deleteNewsItem(id).pipe(take(1)).subscribe(() => this.updateNews());
  }


}
