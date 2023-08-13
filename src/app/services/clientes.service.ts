import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private afs: AngularFirestore) { }



  
  addClient(clientes: any): Promise<any> {
    return this.afs.collection('clientes').add(clientes);
  }

  getClient():Observable<any> {
    return this.afs.collection('clientes').snapshotChanges();
  }
  
  deleteClient(id: string):Promise<any>{
    return this.afs.collection('clientes').doc(id).delete();
  }
}
