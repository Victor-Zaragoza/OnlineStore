import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from './firestore.service';
import {HttpClient} from '@angular/common/http'
// import {http} from '';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public platform: Platform, public firebaseauthservice: FirebaseauthService, public firestoreservice: FirestoreService,
              private router: Router, private http: HttpClient) {
                this.stateUser();
              }

  stateUser(){
    this.firebaseauthservice.stateAuth().subscribe(res=>{
      console.log(res);
      if(res!== null)
        {this.initialize();}

    });

  }

  initialize(){
    if(this.platform.is('capacitor')){
      PushNotifications.requestPermissions().then(result =>{
        console.log('PushNotifications.requestPermission()_____>>>>>>');
        if(result.receive === 'granted'){
          PushNotifications.register();
          this.addListeners();
        }
        else{

        }
      });
    }
    else{
      console.log('PushNotifications.requestPermission() no es celular');
    }
  }

  addListeners(){
    LocalNotifications.schedule({
      title: 'notification local',
      text: 'otification.body',
      id:1,
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.saveToken(token.value);
      alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received 1 plano: ' + JSON.stringify(notification));

        LocalNotifications.schedule({
            title: 'notification local',
            text: notification.body,
            id:1,
            data: notification.data

        });
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
        
        this.router.navigate([notification.notification.data.link]);
      },
    );

  }

  async saveToken(token: any){
    const Uid= await this.firebaseauthservice.getUid();
    if(Uid){
      console.log('save token firebase ->', Uid);
      const path= '/Clients';
      const userUpdate={
        token,
      };
      this.firestoreservice.updateDoc(userUpdate,path, Uid);
      console.log('guardar todken firebase ', userUpdate, path, Uid);
    }
  }

  newNotification(){
    const receptor='mVo5o2VIc9RYHF8SELCknwSdfAt2';
    const path='Clients/';
    this.firestoreservice.getDoc<any>(path,receptor).subscribe(res=>{
      if(res){
        const token= res.token
        const dataNotification={
          link:'/my-orders'
        }
        const notification={
          title: 'Messaje send madjf',
          body: 'Hola'
        };
        const data: INotificaon={
          data: dataNotification,
          tokens: [token],
          notification,
        }
        const url='https://us-central1-grocerystoree.cloudfunctions.net/newNotification';
        return this.http.post<Res>(url,{data}).subscribe(res=>{
          console.log('response newnotification-> ', res.response);
        });
      }
    })
  }
}

interface Res{
  response: string;
}

interface INotificaon{
  data: any;
  tokens:string[];
  notification:any;
}