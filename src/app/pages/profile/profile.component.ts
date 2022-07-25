import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GooglemapsComponent } from 'src/app/googlemaps/googlemaps.component';
import { Client } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  client: Client={
    uid:'',
    name:'',
    email: '',
    cellPhone:'',
    image: '',
    reference:'',
    location: null
  };
  newFile: any;
  uid= '';
  suscriberUserInfo: Subscription;
  enableLog= false;

  constructor(public menucontroller: MenuController, public firebaseauthService: FirebaseauthService,
            public firestorageService: FirestorageService, public firestoreService: FirestoreService, private modalController: ModalController) {

    this.firebaseauthService.stateAuth().subscribe(res =>{
    console.log(res);
      if(res !==null){
        this.uid= res.uid;
        this.getUserInfo(this.uid);
      }
      else{
        this.initClient();
      }
    });
  }

  async ngOnInit() {
    const uid= await this.firebaseauthService.getUid();
    console.log(uid);
  }

  initClient(){
    this.uid='';
    this.client={
        uid:'',
        name:'',
         email: '',
         cellPhone:'',
         image: '',
         reference:'',
         location: null
    };
    console.log(this.client);
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  async newImage(event: any){
    console.log(event);
    if(event.target.files && event.target.files[0]){
      this.newFile= event.target.files[0];
      const reader = new FileReader();
      reader.onload= ((image) =>{
        this.client.image= image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
   // this.saveProduct();
 }

 async register(){
    const credentials={
      email: this.client.email,
      password: this.client.cellPhone
    };
    const resp= await this.firebaseauthService.register(credentials.email, credentials.password).catch(error=>{
        console.log('error: '+ error);
    });
    const uid= await this.firebaseauthService.getUid();
    this.client.uid= uid;
    this.saveUser();
 }

 async signOut(){
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
 }

 async saveUser(){
    const path= 'Clients';
    const name= this.client.name;

    if(this.newFile !== undefined){
      const res= await this.firestorageService.uploadImage(this.newFile, path, name);
      this.client.image= res;
    }
    this.firestoreService.createDoc(this.client, path, this.client.uid).then(res =>{
        console.log('guardado con exito');
    }).catch(error =>{
      console.log('error saveuser');
    });
    console.log('guardado');
  }

  getUserInfo(uid: string){
     const path= 'Clients';
     this.suscriberUserInfo= this.firestoreService.getDoc<Client>(path,uid).subscribe(res =>{
        // this.client= res as Client;
        if(res!==undefined)
          {this.client= res;}
     });
  }

  logIn(){
    const credentials={
      email: this.client.email,
      password: this.client.cellPhone
    };
    this.firebaseauthService.login(credentials.email, credentials.password).then(res =>{
      console.log('ingreso con exito');
    });
  }

  async addDirection(){
    const location= this.client.location;
    let positionInput={
      lat: 21.87960105,
      lng: -102.303282256171
    };
    if(location!==null){
      positionInput=location;
    }
    const modalAdd= await this.modalController.create({
      component: GooglemapsComponent,
      mode: 'ios',
      canDismiss: true,
      componentProps: {position: positionInput}
    });
    await modalAdd.present();
    const {data}= await modalAdd.onWillDismiss();
   console.log('data', data);
    if(data){
      console.log('data ', data);
      this.client.location= data.pos;
      console.log('cliente; ', this.client);
    }
  }
}
