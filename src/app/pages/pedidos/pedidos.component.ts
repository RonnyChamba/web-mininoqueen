import { PedidosService } from './../../services/pedidos.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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
}
