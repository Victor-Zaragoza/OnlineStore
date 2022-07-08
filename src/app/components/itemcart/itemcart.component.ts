import { Component, Input, OnInit } from '@angular/core';
import { ProductOrder } from 'src/app/models';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-itemcart',
  templateUrl: './itemcart.component.html',
  styleUrls: ['./itemcart.component.scss'],
})
export class ItemcartComponent implements OnInit {

  @Input() productOrder: ProductOrder;
  @Input() buttons= true;
  
  constructor(public cartService: CartService) { }

  ngOnInit() {}

  addCart(){
    this.cartService.addProduct(this.productOrder.product);
  }

  removeCart(){
    this.cartService.removeProduct(this.productOrder.product); 
  }
}
