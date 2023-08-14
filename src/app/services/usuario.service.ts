import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, tap } from 'rxjs';

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
      .collection('usuarios', (ref) => ref.orderBy('fecha', 'asc'))
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
}
