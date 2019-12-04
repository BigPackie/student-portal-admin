import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationStart } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { Event as NavigationEvent } from "@angular/router";
import { filter, take } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { NgForm } from '@angular/forms';
import { NewsItem } from '../models/news.item';
import { NewsItemDetail } from '../models/news.item.detail';

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.page.html',
  styleUrls: ['./news-edit.page.scss'],
})
export class NewsEditPage implements OnInit {

  newsId: any;

  editMode: boolean = false;

  newsItem: NewsItem = new NewsItem();

  newsItemDetail: NewsItemDetail = new NewsItemDetail();

  submitted = false;

  constructor(private route: ActivatedRoute,
              private alertController: AlertController, 
              private router:Router,
              private dataService : DataService) { 

    //TODO: need to prevent back button if confirm alert is visible or if in edit mode.
    
    // router.events
    //         .pipe(
    //             // The "events" stream contains all the navigation events. For this demo,
    //             // though, we only care about the NavigationStart event as it contains
    //             // information about what initiated the navigation sequence.
    //             filter(
    //                 ( event: NavigationEvent ) => {
 
    //                     return( event instanceof NavigationStart );
 
    //                 }
    //             )
    //         )
    //         .subscribe(
    //             ( event: NavigationStart ) => {
 
    //                 console.group( "NavigationStart Event" );
    //                 // Every navigation sequence is given a unique ID. Even "popstate"
    //                 // navigations are really just "roll forward" navigations that get
    //                 // a new, unique ID.
    //                 console.log( "navigation id:", event.id );
    //                 console.log( "route:", event.url );
    //                 // The "navigationTrigger" will be one of:
    //                 // --
    //                 // - imperative (ie, user clicked a link).
    //                 // - popstate (ie, browser controlled change such as Back button).
    //                 // - hashchange
    //                 // --
    //                 // NOTE: I am not sure what triggers the "hashchange" type.
    //                 console.log( "trigger:", event.navigationTrigger );
 
    //                 // This "restoredState" property is defined when the navigation
    //                 // event is triggered by a "popstate" event (ex, back / forward
    //                 // buttons). It will contain the ID of the earlier navigation event
    //                 // to which the browser is returning.
    //                 // --
    //                 // CAUTION: This ID may not be part of the current page rendering.
    //                 // This value is pulled out of the browser; and, may exist across
    //                 // page refreshes.
    //                 if ( event.restoredState ) {
 
    //                     console.warn(
    //                         "restoring navigation id:",
    //                         event.restoredState.navigationId
    //                     );
 
    //                 }
 
    //                 console.groupEnd();
 
    //             }
    //         )
    //     ;
  }

  ngOnInit() {
    this.newsId = this.route.snapshot.paramMap.get('id');
  }

  ionViewWillEnter(){
    this.loadNewsData();
  }

  //TODO: while data loading, prevend edit mode
  loadNewsData(){
    console.log(`Getting data for news item ${this.newsId}`);
    this.dataService.getNewsItem(this.newsId).pipe(take(1)).subscribe(res => {
      console.log(`Title ${res.name}`)
      this.newsItem = { ...res };
    });

    console.log(`Getting data for news detail ${this.newsId}`);
     this.dataService.getNewsItemDetail(this.newsId).pipe(take(1)).subscribe(res => {
      this.newsItemDetail = { ...res };
    });
  }


  onEdit(){
    this.editMode = true;
  }

  private onSave(form: NgForm){
    if (form.valid){
      console.log(`valid form, do stuff`);
      this.editMode = false;
    }
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
            this.onSave(form);
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


}
