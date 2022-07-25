import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})

export class CartComponent implements OnInit, OnDestroy {

  order: Order;
  cartSubscriber: Subscription;
  total: number;
  amount: number;

  constructor(public menucontroller: MenuController, public firestoreService: FirestoreService,
              public cartService: CartService, public firebaseauthservice: FirebaseauthService) {
      this.initCart();
      this.loadOrder();
  }

  ngOnInit() {}

  ngOnDestroy() {
    console.log('cart destroy component  ');
    if(this.cartSubscriber)
      {this.cartSubscriber.unsubscribe();}
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  loadOrder(){
    this.cartSubscriber= this.cartService.getCart().subscribe(res => {
      this.order= res;
      this.getTotal();
      this.getAmount();
    });
  }

  initCart(){
    this.order={
      id: '',
      client: null,
      products: [],
      totalPrice: null,
      status: 'send',
      date: new Date(),
      score: null
    };
  }

  getTotal(){
    this.total=0;
    this.order.products.forEach(product =>{
      this.total+= product.product.discountPrice * product.amount;
    });
    this.total= Number(this.total.toFixed(3));
  }

  getAmount(){
    this.amount=0;
    this.order.products.forEach(product =>{
      this.amount+= product.amount;
    });
  }

  async newOrder(){
    if(!this.order.products.length){
      console.log('añade elementos');
      return;
    }

    this.order.id= this.firestoreService.getId();
    this.order.date= new Date();
    this.order.totalPrice= this.total;
    const uid= await this.firebaseauthservice.getUid();
    const path= 'Clients/'+ uid+ '/orders/';

    console.log(this.order, uid, path);
    this.firestoreService.createDoc(this.order,path, this.order.id).then(()=>{
      console.log('Guardado con exito');
      this.cartService.clearCart();
    });
  }
}
