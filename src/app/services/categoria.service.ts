import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private refresh = new Subject<void>();

  get getRefresh() {
    return this.refresh;
  }

  constructor(private afs: AngularFirestore) {}

  addCategoria(categorias: any, uid?: any): Promise<any> {

    console.log(categorias);
    if (uid){
      return this.afs.collection('categorias').doc(uid)
      .update( {
        categoria: categorias.categoria,
      });
    }

    return this.afs.collection('categorias').add(categorias);
  }

  getCategoria(): Observable<any> {
    return this.afs
      .collection('categorias')
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  deleteCategoria(id: string): Promise<any> {
    return this.afs.collection('categorias').doc(id).delete();
  }


  editarCategoria(id: string):Observable<any>{
    return this.afs.collection('categorias').doc(id).get();
  }
}
