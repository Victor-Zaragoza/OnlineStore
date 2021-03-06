import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Product } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  private path= 'Products/';
  products: Product[]=[];

  constructor(public menucontroller: MenuController, public firestoreService: FirestoreService,
              public notificationService: NotificationsService) {
    this.loadProducts();
   }

  ngOnInit() {}

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  loadProducts(){
    this.firestoreService.getCollection<Product>(this.path).subscribe(res =>{
      // console.log(res);
      this.products= res;
    });
  }

  sendNotification(){
    this.notificationService.newNotification();
  }

}
