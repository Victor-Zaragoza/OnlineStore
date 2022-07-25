import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const uidAdmin= 'mVo5o2VIc9RYHF8SELCknwSdfAt2';
const cors= require('cors')({
    origin: true,
});

admin.initializeApp();
const firestore= admin.firestore();

exports.newOrder= functions.firestore
    .document('/Clients/{userId}/orders/{orderId}')
    .onCreate(async (event)=>{
        const order= event.data();
        console.log('newOrder Done....'); 
    
        const path= '/Clients/'+ uidAdmin;
        const docInfo= await firestore.doc(path).get();
        const dataUser= docInfo.data() as any;
        const token= dataUser.token;
        const registrationTokens= [token];
        const dataFcm ={
            link: '/orders',
        }

        const notification: INotification ={
            data: dataFcm,
            tokens: registrationTokens,
            notification:{
                title: order.client.name, 
                body: 'new Order: '+' Price: '+ order.totalPrice,
            }
        }
        return sendNotification(notification);
    });

exports.eventOrder= functions.firestore
    .document('/Clients/{userId}/orders/{orderId}')
    .onUpdate( async (event,eventContext)=>{

        const userUid= eventContext.params.userId;
        const order= event.after.data();
        const dataFcm={
            link:'/my-orders',
        }

        const path= '/Clients/'+ userUid;
        const docInfo= await firestore.doc(path).get();
        const dataUser= docInfo.data() as any;
        const token= dataUser.token;
        const registrationTokens= [token];

        const notification: INotification={
            data: dataFcm,
            tokens: registrationTokens,
            notification:{
                title: 'Following your  order',
                body: 'Order: '+order.status,
            }
        }
        return sendNotification(notification);
    })     

export const newNotification= functions.https.onRequest((request,response)=>{
    cors(request,response, async ()=>{
        if(request.body.data){
            const notification= request.body.data as INotification;
            await sendNotification(notification)
            const res: Res ={
                response: 'success'
            };
            response.status(200).send(res);
        }
        else{
            const res={
                response: 'error'
            };
            response.status(200).send(res);
        }
    });
});


exports.every5Minutes = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
    console.log('This will be run every 5 minutes!');
    return null;
  });

interface Res{
    response: string;
}

const sendNotification= (notification: INotification) =>{
    return new Promise((resolve) =>{
        const message: admin.messaging.MulticastMessage={
            data: notification.data,
            tokens:notification.tokens,
            notification: notification.notification,
            android:{
                notification:{
                    icon: 'ic_stat_name',
                    color: '#EB9234',
                }
            },
            apns:{
                payload:{
                    aps:{
                        sound:{
                            critical: true,
                            name: 'default',
                            volume:1,
                        }
                    }
                }
            }
        }
        console.log('List of tokens send ', notification.tokens);

        admin.messaging().sendMulticast(message)
        .then((response)=>{
            if(response.failureCount>0){
                const failedTokens: any[]= [];
                response.responses.forEach((resp,idx)=>{
                    if(!resp.success){
                        failedTokens.push(notification.tokens[idx]);
                    }
                });
                console.log('List of tokes that caused failures: '+ failedTokens);
            }
        }).catch(error=>{
            console.log('send fcm faild -> ', error);
            resolve(false);
            return;
        })
    })
}

interface INotification{
    data: any,
    tokens:string[],
    notification: admin.messaging.Notification;
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
