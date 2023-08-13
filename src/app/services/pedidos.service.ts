import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private afs: AngularFirestore) { }


  
  getPedidos():Observable<any> {
    return this.afs.collection('pedidos').snapshotChanges();
  }
}
