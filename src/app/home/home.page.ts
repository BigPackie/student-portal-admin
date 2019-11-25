import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { DataService } from '../services/data.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  addeItemId;

  testNewsItem = {
    validFrom: new Date(),
    validTo: new Date("1.1.2222"),
    //overviewImageBase64: Buffer   //added when picture is loaded and transformed
    overviewImagePath: "icon/favicon.png",
    detailText:""
  };

  constructor(private dataService : DataService) {  

  }

  ngOnInit(){
  }

  onSimulate(){
    this.dataService.createNewsItem(this.testNewsItem).subscribe((res) => {
      //TODO: handle creation failure
      this.addeItemId = res._id
      console.log(res);
    });
  }

}
