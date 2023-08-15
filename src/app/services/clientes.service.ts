import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, tap, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private refresh = new Subject<void>();
  get getRefresh() {
    return this.refresh;
  }

  constructor(private afs: AngularFirestore) {}

  addClient(clientes: any): Promise<any> {
    return this.afs.collection('clientes').add(clientes);
  }

  getClient(): Observable<any> {
    return this.afs
      .collection('clientes')
      .snapshotChanges()
      .pipe(
        tap(() => {
          this.refresh.next();
        })
      );
  }

  deleteClient(id: string): Promise<any> {
    return this.afs.collection('clientes').doc(id).delete();
  }


  
  editarCliente(id: string):Observable<any>{
    return this.afs.collection('clientes').doc(id).snapshotChanges();
  }
}
