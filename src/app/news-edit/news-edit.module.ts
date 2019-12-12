import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill'

import { IonicModule } from '@ionic/angular';

import { NewsEditPageRoutingModule } from './news-edit-routing.module';

import { NewsEditPage } from './news-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsEditPageRoutingModule,
    QuillModule.forRoot({
      format: 'html',
      placeholder: 'Add detailed description of the news (will be shown under the news detail image, taking up half of the screen)...',
      theme: 'snow'
    })
  ],
  declarations: [NewsEditPage]
})
export class NewsEditPageModule {}
