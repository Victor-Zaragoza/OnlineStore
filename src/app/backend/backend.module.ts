import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetProductsComponent } from './set-products/set-products.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    SetProductsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class BackendModule { }
