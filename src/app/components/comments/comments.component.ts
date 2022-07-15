import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Client, Product } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() product: Product;
  varcomment= '';
  comments: Comment[]=[];
  suscriber: Subscription;
  suscriberUserInfo: Subscription;

  constructor(public modalController:ModalController, public menucontroller:MenuController,
              public firestoreService:FirestoreService, public firebaseauthService:FirebaseauthService) { }

  ngOnInit() {
    console.log('product', this.product);
    this.loadComments();
  }

  ngOnDestroy(){
    if(this.suscriber){
      console.log("se desuscribe");
      this.suscriber.unsubscribe();
    }
  }

  openMenu(){
    console.log("entra")
    this.menucontroller.toggle('principal');
  }
  closeModal(){
    this.modalController.dismiss();
  }

  loadComments(){
    let startAt=null;
    if(this.comments.length){
      startAt= this.comments[this.comments.length-1].date;
    }
    
    const path = 'Products/' +  this.product.id + '/comments';
    console.log('si', path)
    this.suscriber=this.firestoreService.getCollectionParts<Comment>(path,2,startAt).subscribe(res=>{
      if(res.length){
        res.forEach(comm=>{
          const exist=this.comments.find(commentExist=>{
            commentExist.id===comm.id
          });
          if(exist ===undefined)
            this.comments.push(comm);
        });
      }

    })

  }

  async comment(){
    const newcomment= this.varcomment;
    const path= 'Products/'+ this.product.id+ '/comments';
    const data : Comment={
        id: this.firestoreService.getId(),
        author: this.firebaseauthService.dataClient.name,
        comment: newcomment,
        date: new Date()
    }
          
    this.firestoreService.createDoc(data, path, data.id).then(()=>{
      console.log('comment send');
      this.varcomment='';
    })
       
  
  }


  

}

interface Comment{
    id: string,
    author: string;
    comment: string;
    date: any;

}
