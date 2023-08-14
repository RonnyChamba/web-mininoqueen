import { PedidosService } from './../../services/pedidos.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent  implements OnInit{

pedidos: any[]=[];
constructor(private pedidosService: PedidosService,
  private toastr: ToastrService){}
  ngOnInit(): void {
   this.getPedidos();
  }




  
  getPedidos() {
    this.pedidosService.getPedidos().subscribe((data) => {
      this.pedidos =[];
      data.forEach((element: any) => {
        // console.log(element.payload.doc.id)
        this.pedidos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
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
}
