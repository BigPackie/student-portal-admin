import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsEditPageRoutingModule } from './news-edit-routing.module';

import { NewsEditPage } from './news-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsEditPageRoutingModule
  ],
  declarations: [NewsEditPage]
})
export class NewsEditPageModule {}
