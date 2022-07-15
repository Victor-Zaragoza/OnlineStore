import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GooglemapsComponent } from './googlemaps.component';
import { ComponentsModule } from '../components/components.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    GooglemapsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ComponentsModule
  ],
  exports:[
    GooglemapsComponent
  ]
})
export class GooglemapsModule { }
