import { Component } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { NotificationsService } from './services/notifications.service';
import { Platform } from '@ionic/angular';
import { AwesomeCordovaNativePlugin } from '@awesome-cordova-plugins/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token} from '@capacitor/push-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
// import { Plugins} from '@capacitor/core';
// import { StatusBarStyle } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  admin = false;

  constructor( private platform: Platform,
    private firebaseauthService: FirebaseauthService,
    private notificationsService: NotificationsService
    ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      SplashScreen.hide();
      StatusBar.setBackgroundColor({color: '#ffffff'});
      StatusBar.setStyle({
        style: Style.Light
      });

      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.getUid();
    });
    // this.getUid();
  }

  getUid() {
    this.firebaseauthService.stateAuth().subscribe( res => {
      console.log('adminnnnnnnnn')
          if (res !== null) {
              if (res.uid === 'mVo5o2VIc9RYHF8SELCknwSdfAt2')  { 
                  this.admin = true;
              } else {
                 this.admin = false;
              }
          } else {
            this.admin = false;
          }
    });
}
}
