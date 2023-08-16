import { PedidosService } from './../../services/pedidos.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent  implements OnInit{

pedidos: any[]=[];
pedidosExistente = true;
constructor(
  private pedidosService: PedidosService,
  private toastr: ToastrService,
  private tokenService: TokenService,
  private router: Router)
  {}
  ngOnInit(): void {
   this.getPedidos();
   
  }
  getPedidos() {

    const usuerCurrent= JSON.parse(this.tokenService.getToken() || '{}');
    this.pedidosService.getPedidos(false, usuerCurrent.uid).subscribe((data) => {
      this.pedidos =[];
      data.forEach((element: any) => {
        this.pedidosExistente = true;
        // console.log(element.payload.doc.id)
        this.pedidos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });

        console.log(this.pedidos)
      });
     console.log(this.pedidos)
    });
  }


  
  deletePedidos(id: string) {

    let  pedidos = this.pedidos.find(item => item.id == id);
    Swal.fire({
      title: 'Esta seguro?',
      text:  `¿Esta seguro de eliminar el usuario ${pedidos? pedidos.nombre: ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
    if (result.isConfirmed) {
    this.pedidosService.deletePedidos(id)
      
        Swal.fire( 'Usuario eliminada',
        'El usuario ha sido eliminado con exito',
        'success');
      }
    });
  }

  
  editarPedidos(id: string) {
    this.pedidosService.editarPedidos(id).subscribe(
      (data) => {
        this.pedidosExistente = true;
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }

  despacharPedido(pedido: any){

    console.log(pedido)
    this.router.navigate(['/dashboard/crear_venta', pedido.id])

  }
}
