import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private refresh = new Subject<void>();

  isAdmin: boolean = false;

  get getRefresh() {
    return this.refresh;
  }
  constructor(
    private afs: AngularFirestore,
    private tokenService: TokenService
  ) {}

  getPedidos(estado: boolean, uidIntermediario: string): Observable<any> {
    this.isAdmin = this.tokenService.isLoggedAdmin();
    if (this.isAdmin) {
      return this.afs
        .collection('pedidos', (ref) =>
          ref
            .where('estado', '==', estado)
          
        )
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    }else {

      return this.afs
      .collection('pedidos', (ref) =>
        ref
          .where('estado', '==', estado)
          .where('idVendedor.uid', '==', uidIntermediario)
      )
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );

    }
  }

  getPedidosByIde(estado: boolean, uid: string) {
    return this.afs
      .collection('pedidos', (ref) =>
        ref.where('estado', '==', estado).where('uid', '==', uid)
      )
      .get();
  }

  deletePedidos(id: string): Promise<any> {
    return this.afs.collection('pedidos').doc(id).delete();
  }

  editarPedidos(id: string): Observable<any> {
    return this.afs.collection('pedidos').doc(id).snapshotChanges();
  }

  updateEstadoPedido(uid: string, estado: boolean): Promise<any> {
    return this.afs.collection('pedidos').doc(uid).update({ estado: estado });
  }
}
