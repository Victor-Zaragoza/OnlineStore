import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore/'; 

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  createDoc(data: any, path: string, id: string){
    const collection= this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<type>(path: string, id: string){
    const collection= this.database.collection<type>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string){
    const collection= this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path:string, id: string){
    const collection= this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getId(){
    return this.database.createId();
  }
  
  getCollection<type>(path:string){
    const collection= this.database.collection<type>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<type>(path:string, param1:string, condition:any, param2:string){
    const collection= this.database.collection<type>(path, ref =>
      ref.where(param1, condition ,param2));
    return collection.valueChanges();
  }
}
