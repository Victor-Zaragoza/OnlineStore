import { Component } from '@angular/core';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  admin = false;

  constructor(private firebaseauthService:FirebaseauthService) {
    this.initializeApp();
  }

  initializeApp() {
      this.getUid();
  }

  getUid() {
    this.firebaseauthService.stateAuth().subscribe( res => {
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
