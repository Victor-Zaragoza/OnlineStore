import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { Client, Order, Product, ProductOrder } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private order: Order;
  path='cart/';
  uid= '';
  client: Client;

  constructor(public firebaseauthService: FirebaseauthService, public firestoreservice: FirestoreService,
              public router:Router) { 
    firebaseauthService.stateAuth().subscribe(res =>{
      console.log(res);
      if(res !==null){
        this.uid= res.uid;
        this.loadClient();
      }
      else{
      }
    });
    
  }

  loadCart(){
    const path= 'Clients/'+ this.uid + '/cart';
    this.firestoreservice.getDoc<Order>(path, this.uid).subscribe(res => {
        console.log(res);
        if(res){
          this.order= res;
        }
        else{
          this.initCart();
        }

    }); 
  }

  initCart(){
    this.order={
      uid: this.uid,
      client: this.client,
      products: [],
      totalPrice: null,
      status: 'send',
      fecha: new Date(),
      score: null
    }
  }

  loadClient(){
    const path= 'Clients';
    this.firestoreservice.getDoc<Client>(path,this.uid).subscribe(res =>{
        // this.client= res as Client;
        this.client= res;
        this.loadCart();
    });
  }

  getCart(){
    return this.order;
  }

  addProduct(product: Product){
    const path= 'Clients/'+ this.uid + '/'+ this.path;
    if(this.uid.length){
      const elment= this.order.products.find(prod =>{
        return (prod.product.id === product.id);
      })
      if(elment !== undefined){
        elment.amount++;
      }
      else{
        const add: ProductOrder = {
          product: product,
          amount: 1
        }

        this.order.products.push(add);
      }
    }
    else{
      this.router.navigate(['/profile']);
      return;
    }
    console.log('addorder: '+ this.order);
    this.firestoreservice.createDoc(this.order, path, this.uid).then(()=>{
      console.log("Añadido con exito");
    });
  }

  removeProduct(product:Product){

  }

  doOrder(){

  }

  clearCart(){

  }
}
