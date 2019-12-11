import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  // Gets a reference to the list element
  @ViewChild('newsList', { static: true }) newsListElement: IonList;

  queryText = '';
  segmentFilter = 'all';
  news: any[];
  shownNews: any[] = [];

  constructor(private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    this.loadNews();
  }

  updateNews(){

  }

  //TODO: load already filtered news based on query
  loadNews(){
    this.news = undefined; //just to show the `Loading news spinner`, cause it will not show if the array is empty, only if the array is null or undefined
    this.dataService.getNews().pipe(take(1))
      .subscribe((res) => {
        this.news = res;
      });
  }

  showPlaceHolderOnError(imgElement) {
    imgElement.src = "https://via.placeholder.com/300/09f/fff.png%20C/O%20https://placeholder.com/";
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
    this.dataService.undeleteNewsItem(id).pipe(take(1)).subscribe(() => this.loadNews());
  }

  onDelete(id: string){
    this.dataService.deleteNewsItem(id).pipe(take(1)).subscribe(() => this.loadNews());
  }


}
