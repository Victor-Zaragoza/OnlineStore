import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetProductsComponent } from './backend/set-products/set-products.component';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { MyordersComponent } from './pages/myorders/myorders.component';
import { ProfileComponent } from './pages/profile/profile.component';
// import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { map } from 'rxjs/operators';
import { canActivate, hasCustomClaim } from '@angular/fire/auth-guard';
import { OrdersComponent } from './pages/orders/orders.component';

// const isAdmin = (next: any) => map( (user: any) => !!user && 'mVo5o2VIc9RYHF8SELCknwSdfAt2' === user.uid);
const isAdmin = (next) => map(user => !!user && next.params.userId === 'mVo5o2VIc9RYHF8SELCknwSdfAt2');
const adminOnly = () => hasCustomClaim('admin');

const routes: Routes = [
  {path: 'home', component: HomeComponent},
{path: 'set-products', component: SetProductsComponent, /*...canActivate(adminOnly)*/},
  {path: 'orders', component: OrdersComponent,  /*...canActivate(isAdmin)*/},
  {path: 'profile', component: ProfileComponent},
  {path: 'cart', component: CartComponent},
  {path: 'my-orders', component: MyordersComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
