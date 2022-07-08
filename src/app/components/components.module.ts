import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ItemcartComponent } from './itemcart/itemcart.component';



@NgModule({
  declarations: [ ProductComponent,  ItemcartComponent],
  imports: [ CommonModule, IonicModule, RouterModule],
  exports: [ProductComponent,  ItemcartComponent]
})
export class ComponentsModule { }
