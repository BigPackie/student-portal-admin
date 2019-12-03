import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';

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
  news: any[] = [
    {
      _id: "594df4998df9",
      name: "Something funny happened...",
      validFrom: "1.1.2018",
      validTo: "1.1.2028",
      overviewImageBase64: "base64",
      deleted: false
    },
    {
      _id: "5119988956ff",
      name: "And the hero arrived in the last minute to save the day",
      validFrom: "1.1.2020",
      validTo: "1.1.2022",
      overviewImageBase64: "base64",
      deleted: false
    }
  ];
  shownNews: any[] = [];

  constructor() { }

  ngOnInit() {
    console.log(this.news)
  }

  updateNews(){

  }

}
