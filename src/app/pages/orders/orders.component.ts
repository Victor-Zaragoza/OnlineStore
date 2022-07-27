import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order, StatusOrder } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  newSubs: Subscription;
  oldSubs: Subscription;
  ordersO: Order[]=[];
  ordersN: Order[]=[];
  news= true;
  status: StatusOrder[]= ['delivered','on route','read','send'];

  constructor(public menucontroller: MenuController,
              public firestorageService: FirestorageService,
              public firebaseauthService: FirebaseauthService, public firestoreService: FirestoreService) { }

  ngOnInit() {
    this.getNewOrders();
  }

  ngOnDestroy(){
    if (this.newSubs)
      {this.newSubs.unsubscribe();}
    if(this.oldSubs)
      {this.oldSubs.unsubscribe();}
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  changeSegment(event: any){
    const option= event.detail.value;
    if(option==='New'){
      this.getNewOrders();
      this.news=true;
    }

    if(option==='Delivered'){
      this.getOldOrders();
      this.news=false;
    }

  }

  async getNewOrders(){
    console.log('nu');
    const path= 'orders';
    let startAt= null;
    if(this.ordersN.length){
      startAt= this.ordersN[this.ordersN.length-1].date;
    }
    this.newSubs= this.firestoreService.getCollectionAll<Order>(path,'status','==','send', startAt).subscribe(res =>{
      if(res.length){
        res.forEach(order => {
          this.ordersN.push(order);
        });
      }
    });
  }

  async getOldOrders(){
    console.log('olds');
    const path= 'orders';
    let startAt= null;
    if(this.ordersO.length){
      startAt= this.ordersO[this.ordersO.length-1].date;
    }
    this.newSubs= this.firestoreService.getCollectionAll<Order>(path,'status','==','delivered', startAt).subscribe(res =>{
      if(res.length){
        res.forEach(order => {
          this.ordersO.push(order);
        });
      }
    });
  }

  loadMore(){
    if(this.news)
      {this.getNewOrders();}
    if(this.news==false)
      {this.getOldOrders();}

  }

  changeStatus(order: Order, event: any){
    console.log('cambia estado', order);
    console.log('event-> ', event.detail.value);

    const status= event.detail.value;
    console.log('evennn', status);
    const path='Clients/'+order.client.uid+'/orders/';
    const newDoc= {
      status
    };
    const id=order.id;
    this.firestoreService.updateDoc(newDoc,path,id).then(()=>{
      console.log('update success')
    });

  }

}
