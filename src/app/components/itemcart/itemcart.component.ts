import { Component, Input, OnInit } from '@angular/core';
import { ProductOrder } from 'src/app/models';

@Component({
  selector: 'app-itemcart',
  templateUrl: './itemcart.component.html',
  styleUrls: ['./itemcart.component.scss'],
})
export class ItemcartComponent implements OnInit {

  @Input() productOrder: ProductOrder;
  
  constructor() { }

  ngOnInit() {}

}
