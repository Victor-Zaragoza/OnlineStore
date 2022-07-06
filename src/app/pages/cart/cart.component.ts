import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order, Product } from 'src/app/models';
import { CartService } from 'src/app/services/cart.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {

  order: Order;
  cartSubscriber: Subscription;

  constructor(public menucontroller: MenuController, public firestoreService: FirestoreService,
              public cartService: CartService) {
      this.initCart();          
      this.loadOrder();
   }

  ngOnInit() {}

  ngOnDestroy() {
    console.log("cart destroy component  ");
    if(this.cartSubscriber){
      this.cartSubscriber.unsubscribe();
    }
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  loadOrder(){
    this.cartSubscriber= this.cartService.getCart().subscribe(res => {
      this.order= res;
    });
  }

  initCart(){
    this.order={
      uid: '',
      client: null,
      products: [],
      totalPrice: null,
      status: 'send',
      fecha: new Date(),
      score: null
    }
  }

}
