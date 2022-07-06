import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
   @Input() product: Product;
   
  constructor(public cartService: CartService) { }

  ngOnInit() {
    // console.log('El producto es: '+ this.product);
  }

  addCart(){
    this.cartService.addProduct(this.product);
  }

}
