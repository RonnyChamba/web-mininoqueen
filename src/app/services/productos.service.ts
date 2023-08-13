import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService implements OnInit {
  ngOnInit(): void {}
  constructor(private afs: AngularFirestore) {}

  addProduct(productos: any): Promise<any> {
    return this.afs.collection('productos').add(productos);
  }

  getProducto():Observable<any> {
    return this.afs.collection('productos').snapshotChanges();
  }

  delete(id: string):Promise<any>{
    return this.afs.collection('productos').doc(id).delete();
  }
}
