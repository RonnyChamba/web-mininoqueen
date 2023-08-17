import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, tap, Subject } from 'rxjs';
import { TokenService } from './token.service';
@Injectable({
  providedIn: 'root',
})
export class ClientesService {

  private refresh = new Subject<void>();
  
  isAdmin = false;
  
  constructor(
    private afs: AngularFirestore,
    private tokenService: TokenService) {
      this.isAdmin = this.tokenService.isLoggedAdmin();
    }

    get getRefresh() {
      return this.refresh;
    }

    
  addClient(clientes: any): Promise<any> {
    return this.afs.collection('clientes').add(clientes);
  }


  addClientWithUid(clientes: any) {
   
    return this.afs.doc(`clientes/${clientes.uid}`).set(clientes, { merge: true });
  }

  getClient(codeIntermediario?: any): Observable<any> {


    if (this.isAdmin) {
    return this.afs
    .collection('clientes')
    .snapshotChanges()
    .pipe(
      tap(() => {
        this.refresh.next();
      })
    );
    }else  {

      
    return this.afs
    .collection('clientes',
    (ref) => ref.where('intermediario', '==', codeIntermediario))
    .snapshotChanges()
    .pipe(
      tap(() => {
        this.refresh.next();
      })
    );
    }



  }

  deleteClient(id: string): Promise<any> {
    return this.afs.collection('clientes').doc(id).delete();
  }


  
  editarCliente(id: string):Observable<any>{
    return this.afs.collection('clientes').doc(id).snapshotChanges();
  }
}
