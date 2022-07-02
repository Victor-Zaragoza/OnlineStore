import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models';
import { FirestoreService } from 'src/app/sevices/firestore.service';

@Component({
  selector: 'app-set-products',
  templateUrl: './set-products.component.html',
  styleUrls: ['./set-products.component.scss'],
})
export class SetProductsComponent implements OnInit {
 
 newProduct: Product;

 products: Product[]= [];

 enableNewProduct= false;

 loading:any;
 
 private path= 'Products/';

  constructor(public menucontroller: MenuController, public firestoreService: FirestoreService,
             public loadingController: LoadingController, public toastController: ToastController,
             public alertController: AlertController) { }

  ngOnInit() {
    this.getProducts();
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  saveProduct(){
    this.presentLoading();
    this.firestoreService.createDoc(this.newProduct, this.path, this.newProduct.id).then(res =>{
        this.loading.dismiss();
        this.presentToast("Product Saved", 'success');
    }).catch(error =>{
      this.presentToast("Can't Saved the product", 'danger');
    });
    console.log("guardado");
  }

  getProducts(){
    this.firestoreService.getCollection<Product>(this.path).subscribe( res => {
       this.products= res;
    });
  }

  async deleteProduct(product: Product){
      const alert = await this.alertController.create({
        cssClass: 'regular',
        header: 'Confirm',
        message: 'Do you want to <strong>delete</strong> this product?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {  

            }
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
                this.firestoreService.deleteDoc(this.path, product.id).then(res =>{
                  this.presentToast("Product Deleted",'danger');
                  this.alertController.dismiss();
              }).catch(error =>{
                this.presentToast("Can't Delete this product", 'danger');
              });;
             }
          }
        ]
      });
  
      await alert.present();   
  }

  createProduct(){
    this.enableNewProduct= true;
    this.newProduct ={
      id: this.firestoreService.getId(),
      name: '',
      regularPrice: null,
      discountPrice: null,
      image: '',
      date: new Date()
   };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'regular',
      message: 'Saving...'  
    });
    
    await this.loading.present(); 
  }

  async presentToast(msg: string, color) {
    const toast = await this.toastController.create({
      cssClass: '',
      message: msg,
      duration: 2000,
      color: color
    });
    toast.present();
  }

}
