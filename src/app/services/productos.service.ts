import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProductosService implements OnInit {
  // Escuchar cambios para actualizar
  private refresh = new Subject<void>();

  isAdmin = false;

  get getRefresh() {
    return this.refresh;
  }
  ngOnInit(): void {}
  constructor(
    private afs: AngularFirestore,
    private tokenService: TokenService
  ) {
    this.isAdmin = this.tokenService.isLoggedAdmin();
  }

  addProduct(productos: any): Promise<any> {
    return this.afs
      .doc('productos/' + productos.uid)
      .set(productos, { merge: true });
  }

  getProducto(codigoIntermedio: any): Observable<any> {
    console.log('codigoIntermedio', codigoIntermedio);
    if (this.isAdmin) {
      console.log('es admin');
      return this.afs
        .collection('productos')
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    } else {
      console.log('no es admin');
      return this.afs
        .collection('productos', (ref) =>
          ref.where('intermediario', '==', codigoIntermedio)
        )
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    }
  }

  delete(id: string): Promise<any> {
    return this.afs.collection('productos').doc(id).delete();
  }

  editarProductos(id: string) {
    return this.afs.collection('productos').doc(id).snapshotChanges();
  }

  /**
   * A este metodo se debera pasar el codigo de intermedio actual, para  filtrar solo los
   * productos que pertenecen a ese usuario, esta pendiente de implementar
   * @returns
   */
  getProductosByUser(codeIntermediario?: any): Observable<any> {
    return this.afs
      .collection('productos',
      (ref) => ref.where('intermediario', '==', codeIntermediario))
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  async updateVentasProducto(uid: string, amount: any) {
    const product = this.afs.collection('productos').doc(uid);

    try {
      await this.afs.firestore.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(product.ref);

        const ventas = (userDoc.get('ventas') || 0) + amount;

        transaction.update(product.ref, { ventas });
      });

      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      return Promise.reject(false);
    }
  }
}
