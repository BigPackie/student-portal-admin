import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionEditPage } from './promotion-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PromotionEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionEditPageRoutingModule {}
