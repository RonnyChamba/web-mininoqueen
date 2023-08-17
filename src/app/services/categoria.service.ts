import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private refresh = new Subject<void>();

  get getRefresh() {
    return this.refresh;
  }

  constructor(
    private afs: AngularFirestore,
    private tokenService: TokenService
  ) {}

  addCategoria(categorias: any, uid?: any): Promise<any> {
    console.log(categorias);
    if (uid) {
      return this.afs.collection('categorias').doc(uid).update({
        categoria: categorias.categoria,
      });
    }

    return this.afs.collection('categorias').add(categorias);
  }

  saveCategoria(uid: string, data: any) {
    return this.afs.doc(`categorias/${uid}`).set(data, { merge: true });
  }

  getCategoria(codeIntemediario?: string): Observable<any> {
    if (this.tokenService.isLoggedAdmin()) {
      return this.afs
        .collection('categorias', (ref) => ref.orderBy('fecha', 'desc'))
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    }else {

      return this.afs
      .collection('categorias', 
      (ref) =>  ref.where('intermediario', '==', codeIntemediario)
      .orderBy('fecha', 'desc'))
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
    }
  }

  deleteCategoria(id: string): Promise<any> {
    return this.afs.collection('categorias').doc(id).delete();
  }

  editarCategoria(id: string): Observable<any> {
    return this.afs.collection('categorias').doc(id).get();
  }

  async updateCategoria(uid: string, data: any) {
    try {
      // const planiDocRef = this.afs.collection(COLLECTION_NAME).doc(planIde);

      const categoriaRef = this.afs.collection('categorias').doc(uid);

      // Use una transacción para asegurarse de que ningún otro proceso modifique el arreglo al mismo tiempo
      await this.afs.firestore.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(categoriaRef.ref);

        // // // Obtener el arreglo actual, se pasa el campo a leer
        // const categoria = userDoc.get('categoria') || {};

        // console.log(categoria);

        // categoria.categoria = data.categoria;

        // //  const items = userDoc.data()?.details_planification || [];

        // // Agregar el nuevo elemento al arreglo
        // items.push(newItem);

        // Actualizar la categoría
        transaction.update(categoriaRef.ref, { categoria: data.categoria });

        // Actulizar en productos la categoria

        // const reporteDocRef = this.afs.collection('productos').ref;
        // const querySnapshot = await reporteDocRef
        //   .where('categoria.uid', '==', uid)
        //   .get();

        // // Actualizar los documentos dentro de la transacción
        // querySnapshot.forEach(async (documentSnapshot) => {
        //   const docRef = reporteDocRef.doc(documentSnapshot.id);

        //   const userDoc = await transaction.get(docRef);

        //   // // Obtener el arreglo actual, se pasa el campo a leer
        //   const categoria = userDoc.get('categoria') || {};
        //   console.log("categoria a actualizar", categoria);

        //   categoria.categoria = data.categoria;

        //   transaction.update(docRef, {
        //     categoria
        //   });
        // });
      });
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Actulizar el nombre de la categoria en los productos
   */
  async updateNombreProductos(uid: string, data: any) {
    try {
      // const reporteDocRef = this.afs.collection("reportes").doc(uidCourse);
      const reporteDocRef = this.afs.collection('productos').ref;
      // const planiDocRef = this.afs.collection(COLLECTION_NAME_REPORT, ref => ref.where("uidPlanification", "==", planIde)).doc();

      // Use una transacción para asegurarse de que ningún otro proceso modifique el arreglo al mismo tiempo
      await this.afs.firestore.runTransaction(async (transaction) => {
        // const userDoc = await transaction.get(reporteDocRef.where("uidCourse", "==", uidCourse));
        const querySnapshot = await reporteDocRef
          .where('categoria.uid', '==', uid)
          .get();

        // Actualizar los documentos dentro de la transacción
        querySnapshot.forEach(async (documentSnapshot) => {
          const docRef = reporteDocRef.doc(documentSnapshot.id);

          const userDoc = await transaction.get(docRef);
          const categoria = userDoc.get('categoria') || {};
          // console.log('categoria a actualizar', categoria);

          categoria.categoria = data.categoria;

          // mediante la referenci al documento se actualiza, con la transaccion no se pudo
          docRef.update({
            categoria,
          });

          // transaction.update(docRef, {
          //  categoria
          // });
        });
      });
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
