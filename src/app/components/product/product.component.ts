import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/models';
import { CartService } from 'src/app/services/cart.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
   @Input() product: Product;
   
  constructor(public cartService: CartService, public modalController:ModalController) { }

  ngOnInit() {
    // console.log('El producto es: '+ this.product);
  }

  addCart(){
    this.cartService.addProduct(this.product);
  }

  async openModal(){
    const modal= await this.modalController.create({
      component: CommentsComponent,
      componentProps: {product: this.product}
    });
    return await modal.present();
  }

}
