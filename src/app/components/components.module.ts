import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ItemcartComponent } from './itemcart/itemcart.component';
import { CommentsComponent } from './comments/comments.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ ProductComponent,  ItemcartComponent, CommentsComponent],
  imports: [ CommonModule, IonicModule, RouterModule, FormsModule],
  exports: [ProductComponent,  ItemcartComponent, CommentsComponent]
})
export class ComponentsModule { }
