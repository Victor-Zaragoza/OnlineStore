// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: '',
    authDomain: 'grocerystoree.firebaseapp.com',
    projectId: 'grocerystoree',
    storageBucket: 'grocerystoree.appspot.com',
    messagingSenderId: '928379031923',
    appId: '1:928379031923:web:50fb93a982d6bab5107506',
    measurementId: 'G-5TYSZ4N2PX'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
