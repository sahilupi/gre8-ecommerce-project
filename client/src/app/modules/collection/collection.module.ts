import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections/collections.component';
import { RouterModule, Routes } from '@angular/router';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

const routes: Routes = [
  {
    path: ':id', component: ProductDetailsComponent, data: { title: 'Product details' },
  },
  {
    path: 'collections/:name', component: CollectionsComponent, data: { title: 'Collections' }, title: 'Collections - Gre8'
  }
]

@NgModule({
  declarations: [
    CollectionsComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    GalleryModule.withConfig({
      thumbView: 'contain',
    }),
    LightboxModule,
    CarouselModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'progress' }),
    SharedModule,
    ShareButtonsModule,
    ShareIconsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CollectionModule { }
