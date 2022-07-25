import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Client, Order, Product, ProductOrder } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private order: Order;
  order$= new Subject<Order>();
  path='cart/';
  uid= '';
  client: Client;
  cartSubscriber: Subscription;
  clientSubscriber: Subscription;

  constructor(public firebaseauthService: FirebaseauthService, public firestoreservice: FirestoreService,
              public router: Router) {
      this.initCart();
      firebaseauthService.stateAuth().subscribe(res =>{
        console.log(res);
        if(res !==null){
          this.uid= res.uid;
          this.loadClient();
        }
      });
  }

  loadCart(){
    const path= 'Clients/'+ this.uid + '/cart';
    this.firestoreservice.getDoc<Order>(path, this.uid).subscribe(res => {
        console.log(res);
        if(res){
          this.order= res;
          this.order$.next(this.order);
        }
        else{
          this.initCart();
        }
    });
  }

  initCart(){
    this.order={
      id: this.uid,
      client: this.client,
      products: [],
      totalPrice: null,
      status: 'send',
      date: new Date(),
      score: null
    };
    this.order$.next(this.order);
  }

  loadClient(){
    const path= 'Clients';
    this.firestoreservice.getDoc<Client>(path,this.uid).subscribe(res =>{
        // this.client= res as Client;
        this.client= res;
        this.loadCart();
    });
  }

  getCart(): Observable<Order>{
    setTimeout(() => {
      this.order$.next(this.order);
    }, 100);
    return this.order$.asObservable();
  }

  addProduct(product: Product){
    const path= 'Clients/'+ this.uid + '/'+ this.path;
    if(this.uid.length){
      const elment= this.order.products.find(prod =>(prod.product.id === product.id));
      if(elment !== undefined){
        elment.amount++;
      }
      else{
        const add: ProductOrder = {
          product,
          amount: 1
        };
        this.order.products.push(add);
      }
    }
    else{
      this.router.navigate(['/profile']);
      return;
    }
    // this.order$.next(this.order);
    console.log('addorder: '+ this.order);
    this.firestoreservice.createDoc(this.order, path, this.uid).then(()=>{
      console.log('Añadido con exito');
    });
  }

  removeProduct(product: Product){
    const path= 'Clients/'+ this.uid + '/'+ this.path;
    let position=0;

    if(this.uid.length){
      const elment= this.order.products.find((prod, index) =>{
        position=index;
        return (prod.product.id === product.id);
      });
      if(elment !== undefined){
        elment.amount--;
        if(elment.amount===0){
          this.order.products.splice(position,1);
        }
        console.log('remove product: '+ this.order);
        this.firestoreservice.createDoc(this.order, path, this.uid).then(()=>{
        console.log('eliminado con exito');
        });
      }
    }

  }

  clearCart(){
    const path= 'Clients/'+ this.uid+ '/cart/';
    this.firestoreservice.deleteDoc(path, this.uid).then(()=>{
      this.initCart();
    });
  }
}
