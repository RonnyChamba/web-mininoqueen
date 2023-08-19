
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  constructor( 
    
    private afs: AngularFirestore,
    private tokenService: TokenService)
    { }



  getCantidadProductos(codeIntermediario?: string){

    if (this.tokenService.isLoggedAdmin()){
      return this.afs.collection('productos').valueChanges();
    }

    return this.afs.collection('productos', (ref) => ref.where("intermediario", "==", codeIntermediario)  ).valueChanges();
  }
  getCantidadClientes(codeIntermediario?: string){

    if (this.tokenService.isLoggedAdmin()){
      return this.afs.collection('clientes').valueChanges();
    }

    return this.afs.collection('clientes', (ref) => ref.where("intermediario", "==", codeIntermediario)).valueChanges();

  }

  getCantidadCategorias(){
    return this.afs.collection('categorias').valueChanges();
  }

  getCantidadVentas(uidUsuario?: string){


    if (this.tokenService.isLoggedAdmin()){
      return this.afs.collection('ventas').valueChanges();
    }
    return this.afs.collection('ventas', (ref) => ref.where("idVendedor.uid", "==", uidUsuario)).valueChanges();
  }

  getProductosRecientes(limit: number) { 
    // return this.afs.collection('productos').valueChanges();
    
      return this.afs.collection('productos', ref =>
      ref.orderBy('fecha', 'desc').limit(limit)).valueChanges();
  }
  getProductosMasVendidos(limit: number) {

    // return this.afs.collection('productos').valueChanges();

    return this.afs.collection('productos', ref =>
    ref.orderBy('ventas', 'desc').limit(limit)).valueChanges();
  }
}
