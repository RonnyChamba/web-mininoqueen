import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private afs: AngularFirestore) { }



  
  addUser(usuario: any): Promise<any> {
    return this.afs.collection('usuarios').add(usuario);
  }

  getUser():Observable<any> {
    return this.afs.collection('usuarios').snapshotChanges();
  }

  deleteUser(id: string):Promise<any>{
    return this.afs.collection('usuarios').doc(id).delete();
  }
}
