import { Observable, Subject, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private refresh = new Subject<void>();

  constructor(
    private afs: AngularFirestore,
    private tokenService: TokenService
  ) {}

  get getRefresh() {
    return this.refresh;
  }

  addVenta(venta: any): Promise<any> {
    return this.afs.collection('ventas').add(venta);
  }

  getVenta(uidIntermediario?: string): Observable<any> {
    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');

    if (this.tokenService.isLoggedAdmin()) {
      return this.afs
        .collection('ventas', (ref) => ref.orderBy('fechaVenta', 'desc'))
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    }else {
      return this.afs
        .collection('ventas', 
        (ref) => ref.where('idVendedor.uid', '==', userCurrent.uid)
        .orderBy('fechaVenta', 'desc'))
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    }
  }

  deleteVenta(id: string): Promise<any> {
    return this.afs.collection('ventas').doc(id).delete();
  }

  saveVenta(venta: any) {
    return this.afs.doc(`ventas/${venta.uid}`).set(venta, {
      merge: true,
    });
  }
}
