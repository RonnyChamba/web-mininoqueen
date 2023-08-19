import Swal from 'sweetalert2';
import { VentasService } from './../../services/ventas.service';
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import * as ExcelJS from 'exceljs';
// import * as fs from 'file-saver';

@Component({
  selector: 'app-administrar-ventas',
  templateUrl: './administrar-ventas.component.html',
  styleUrls: ['./administrar-ventas.component.scss'],
})
export class AdministrarVentasComponent implements OnInit {
  venta: any[] = [];

  isAdmin = false;

  constructor(
    private ventasService: VentasService,
    private tokenService: TokenService
  ) {
    this.isAdmin = this.tokenService.isLoggedAdmin();
  }

  ngOnInit(): void {
    this.getventa();
  }

  getventa() {
    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');

    this.ventasService.getVenta(userCurrent?.uid).subscribe((data) => {
      this.venta = [];
      data.forEach((element: any) => {
        // console.log(element.payload.doc.id)
        this.venta.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      console.log(this.venta);
    });
  }

  deleteVenta(id: string) {
    let venta = this.venta.find((item) => item.id == id);
    Swal.fire({
      title: 'Esta seguro?',
      text: `¿Esta seguro de eliminar la venta ${
        venta ? venta.idCliente : ''
      }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Eliminar',
      cancelButtonText: 'No, cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.ventasService.deleteVenta(id);

        Swal.fire(
          'Venta eliminada',
          'La venta ha sido eliminado con exito',
          'success'
        );
      }
    });
  }

  exportToExcel(id: any) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet', {
      headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' }
    });

    // Agregar un encabezado personalizado
    sheet.addRow(['Codigo', 'Fecha', 'Cliente', 'Vendedor', 'Productos','Total', 'Estado']);


    // consulta el registro en firebase por su id
    const data = [
      ['John', 30, 'USA'],
      ['Alice', 25, 'Canada'],
      ['Bob', 28, 'UK'],
      ['Bob', 28, 'UK'],
      ['Bob', 28, 'UK'],
      ['Bob', 28, 'UK'],
      ['Bob', 28, 'UK']


    ];

    data.forEach((row) => {
      sheet.addRow(row);
    });

    // workbook.xlsx.writeBuffer().then((buffer) => {
    //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   fs.saveAs(blob, 'example.xlsx');
    // });
  }

  
}
