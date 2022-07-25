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

  updateDoc(data: any, path: string, id: string){
    const collection= this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getId(){
    return this.database.createId();
  }

  getCollection<type>(path: string){
    const collection= this.database.collection<type>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<type>(path: string, param1: string, condition: any, param2: string){
    const collection= this.database.collection<type>(path, ref =>
      ref.where(param1, condition ,param2));
    return collection.valueChanges();
  }

  getCollectionAll<type>(path, parameter: string, condition: any, search: string, startAt: any){

    if(startAt==null){
      startAt= new Date();
    }
    const collection=this.database.collectionGroup<type>(path, ref => ref.where(parameter,condition,search)
              .orderBy('date','desc').limit(2).startAfter(startAt)
    );
    return collection.valueChanges();
  }

  getCollectionParts<type>(path: string, limit: number, startAt: any){
    if (startAt == null) {
      startAt = new Date();
    }
    const collection = this.database.collection<type>(path,
      ref => ref.orderBy('date', 'desc')
                .limit(limit)
                .startAfter(startAt)
      );
    return collection.valueChanges();
  }
}
