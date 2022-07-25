import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.scss'],
})
export class MyordersComponent implements OnInit, OnDestroy {

  newSubs: Subscription;
  oldSubs: Subscription;
  orders: Order[]=[];

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
    if(option==='New')
      {this.getNewOrders();}
    if(option==='Delivered')
      {this.getOldOrders();}
  }

  async getNewOrders(){
    const uid= await this.firebaseauthService.getUid();
    const path= 'Clients/'+ uid+ '/orders/';
    this.newSubs= this.firestoreService.getCollectionQuery<Order>(path,'status','==','send').subscribe(res =>{
      if(res.length)
        {this.orders=res;}
    });
  }

  async getOldOrders(){
    const uid= await this.firebaseauthService.getUid();
    const path= 'Clients/'+ uid+ '/orders/';
    this.oldSubs= this.firestoreService.getCollectionQuery<Order>(path,'status','==','delivered').subscribe(res =>{
      if(res.length)
          {this.orders=res;}
    });
  }
}
