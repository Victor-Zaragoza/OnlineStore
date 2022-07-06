import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscriber, Subscription } from 'rxjs';
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
  }

  newFile:any;

  uid= '';

  suscriberUserInfo: Subscription;

  enableLog= false;

  constructor(public menucontroller: MenuController, public firebaseauthService:FirebaseauthService, 
            public firestorageService:FirestorageService, public firestoreService: FirestoreService) {
              firebaseauthService.stateAuth().subscribe(res =>{
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
    }
  }

  openMenu(){
    this.menucontroller.toggle('principal');
  }

  async newImage(event:any){
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
    }

    const resp= await this.firebaseauthService.register(credentials.email, credentials.password).catch(error=>{
        console.log("error: "+ error);
    });
    const uid= await this.firebaseauthService.getUid();
    this.client.uid= uid;
    this.saveUser();
 }

 async signOut(){
  // const uid= await this.firebaseauthService.getUid();
    // console.log(uid);
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
        console.log("guardado con exito"); 
         
    }).catch(error =>{
      
    });
    console.log("guardado");
  }

  getUserInfo(uid:string){
     const path= 'Clients';
     this.suscriberUserInfo= this.firestoreService.getDoc<Client>(path,uid).subscribe(res =>{
        // this.client= res as Client;
        this.client= res;
     });
  }

  logIn(){
    const credentials={
      email: this.client.email,
      password: this.client.cellPhone
    };
    this.firebaseauthService.login(credentials.email, credentials.password).then(res =>{
      console.log("ingreso con exito");
    });
  }
}
