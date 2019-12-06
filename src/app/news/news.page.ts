import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';
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
  news: any[] = [];
  shownNews: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadNews();
  }

  updateNews(){

  }

  //TODO: load already filtered news based on query
  loadNews(){
    this.dataService.getNews().pipe(take(1))
      .subscribe((res) => {
        this.news = res;
      });
  }

  showPlaceHolderOnError(imgElement) {
    imgElement.src = "https://via.placeholder.com/300/09f/fff.png%20C/O%20https://placeholder.com/";
  }
}
