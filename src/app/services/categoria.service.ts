import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private afs: AngularFirestore) { }



  
  getCategoria():Observable<any> {
    return this.afs.collection('categorias').snapshotChanges();
  }
}
