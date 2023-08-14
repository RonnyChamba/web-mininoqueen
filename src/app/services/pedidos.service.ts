import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private refresh = new Subject<void>();

  get getRefresh() {
    return this.refresh;
  }
  constructor(private afs: AngularFirestore) {}

  getPedidos(): Observable<any> {
    return this.afs
      .collection('pedidos')
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  deletePedidos(id: string): Promise<any> {
    return this.afs.collection('pedidos').doc(id).delete();
  }
}
