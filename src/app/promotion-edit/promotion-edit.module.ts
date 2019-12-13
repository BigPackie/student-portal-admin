import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotionEditPageRoutingModule } from './promotion-edit-routing.module';

import { PromotionEditPage } from './promotion-edit.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotionEditPageRoutingModule,
    QuillModule.forRoot({
      format: 'html',
      placeholder: 'Add detailed description of the promotion (will be shown under the promotion detail image, taking up half of the screen)...',
      theme: 'snow'
    })
  ],
  declarations: [PromotionEditPage]
})
export class PromotionEditPageModule {}
