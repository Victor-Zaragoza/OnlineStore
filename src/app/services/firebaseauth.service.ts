import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Client } from '../models';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  dataClient: Client;

  constructor(public auth: AngularFireAuth, public firestoreService: FirestoreService) {
    this.stateUser();
    this.getUid();

   }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  register(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email,password);
  }

  async getUid(){
    const user= await this.auth.currentUser;
    if(user===null)
      {return null;}
    else
      {return user.uid;}
  }

  stateAuth(){
    return this.auth.authState;
  }

  stateUser(){
    this.stateAuth().subscribe(res=>{
      console.log(res);
      if(res!==null){
        this.getInfoUser();
      }
      else{

      }
    });
  }

  async getInfoUser(){
    const uid= await this.getUid();
    const path='Clients';
    this.firestoreService.getDoc<Client>(path,uid).subscribe(res =>{
      if(res!==undefined){
        this.dataClient= res;
        console.log(this.dataClient);
      }
    });
  }
}
