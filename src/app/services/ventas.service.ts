import { Observable, Subject, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private refresh = new Subject<void>();
  get getRefresh() {
    return this.refresh;
  }
  constructor(private afs: AngularFirestore) {}

  addVenta(venta: any): Promise<any> {
    return this.afs.collection('ventas').add(venta);
  }

  getVenta(): Observable<any> {
    return this.afs
      .collection('ventas')
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  deleteVenta(id: string): Promise<any> {
    return this.afs.collection('ventas').doc(id).delete();
  }
}
