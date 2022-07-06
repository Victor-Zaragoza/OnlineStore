import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Order, Product } from 'src/app/models';
import { CartService } from 'src/app/services/cart.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  order: Order;
  constructor(public menucontroller: MenuController, public firestoreService: FirestoreService,
              public cartService: CartService) {
      this.loadOrder();
   }

  ngOnInit() {}

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  loadOrder(){
    this.order= this.cartService.getCart();
  }

}
