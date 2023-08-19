import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, tap } from 'rxjs';

const COLLECTION_NAME = 'usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private refresh = new Subject<void>();
  get getRefresh() {
    return this.refresh;
  }
  constructor(private afs: AngularFirestore) {}

  addUser(usuario: any): Promise<any> {
    return this.afs.collection('usuarios').add(usuario);
  }

  getUser(): Observable<any> {
    return this.afs
      .collection('usuarios', (ref) => ref.orderBy('fecha', 'desc'))
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  deleteUser(id: string): Promise<any> {
    return this.afs.collection('usuarios').doc(id).delete();
  }

  
  editarUser(id: string){
    return this.afs.collection('usuarios').doc(id).snapshotChanges();
  }

  saveUserData(user: any) {
    return this.afs.doc(`${COLLECTION_NAME}/${user.uid}`).set(user, {
      merge: true
    });
  }

  updateUserData(uid:string,  user: any) {
    return this.afs.doc(`${COLLECTION_NAME}/${uid}`).update({
      nombre: user.nombre,
      foto: user.foto,
    });
  }

  getUserById(uid: string) {
    return this.afs.collection(COLLECTION_NAME).doc(uid).get();
  }

}
