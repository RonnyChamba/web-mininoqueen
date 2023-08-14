import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService implements OnInit {
  // Escuchar cambios para actualizar
  private refresh = new Subject<void>();

  get getRefresh() {
    return this.refresh;
  }
  ngOnInit(): void {}
  constructor(private afs: AngularFirestore) {}

  addProduct(productos: any): Promise<any> {
    return this.afs.collection('productos').add(productos);
  }

  getProducto(): Observable<any> {
    return this.afs
      .collection('productos')
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  delete(id: string): Promise<any> {
    return this.afs.collection('productos').doc(id).delete();
  }
}
