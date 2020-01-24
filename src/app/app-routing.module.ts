import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full'
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'news-edit/:id',
    loadChildren: () => import('./news-edit/news-edit.module').then( m => m.NewsEditPageModule)
  },
  {
    path: 'news-edit',
    loadChildren: () => import('./news-edit/news-edit.module').then( m => m.NewsEditPageModule)
  },
  {
    path: 'promotions',
    loadChildren: () => import('./promotions/promotions.module').then( m => m.PromotionsPageModule)
  },
  {
    path: 'promotion-edit',
    loadChildren: () => import('./promotion-edit/promotion-edit.module').then( m => m.PromotionEditPageModule)
  },
  {
    path: 'promotion-edit/:id',
    loadChildren: () => import('./promotion-edit/promotion-edit.module').then( m => m.PromotionEditPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
