import { Observable, Subject, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TokenService } from './token.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private refresh = new Subject<void>();

  constructor(
    private afs: AngularFirestore,
    private tokenService: TokenService
  ) {}

  get getRefresh() {
    return this.refresh;
  }

  addVenta(venta: any): Promise<any> {
    return this.afs.collection('ventas').add(venta);
  }

  getVenta(uidIntermediario?: string): Observable<any> {
    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');

    if (this.tokenService.isLoggedAdmin()) {
      return this.afs
        .collection('ventas', (ref) => ref.orderBy('fechaVenta', 'desc'))
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    } else {
      return this.afs
        .collection('ventas', (ref) =>
          ref
            .where('idVendedor.uid', '==', userCurrent.uid)
            .orderBy('fechaVenta', 'desc')
        )
        .snapshotChanges()
        .pipe(
          tap(() => {
            this.refresh.next();
          })
        );
    }
  }

  deleteVenta(id: string): Promise<any> {
    return this.afs.collection('ventas').doc(id).delete();
  }

  saveVenta(venta: any) {
    return this.afs.doc(`ventas/${venta.uid}`).set(venta, {
      merge: true,
    });
  }

  async generatePDF(id?: string) {
    if (id) {
      const ventasSnapshot = await this.afs
        .collection('ventas')
        .doc(id)
        .get()
        .toPromise();
      const venta: any = ventasSnapshot.data();

      const pdfFInal: any = {
        pageSize: {
          width: 475, // Ancho en puntos
          height: 400, // Alto en puntos
        },
      
        content: [
        	{
            text: 'FACTURA DE VENTA',
            style: 'header',
            alignment: 'center'
          },
          
          {
            style: 'tableExample',
            table: {
              body: [
                [
                  
                   { colSpan: 7, ronSpan: 7,
                   text:  '--------------------------------------------------------------------------------------------------------------------\ '   + 'Cliente:\ '+ venta.idCliente.nombre + '\nCedula Cliente:\ ' +venta.idCliente.documento  +  '\n Telefono:\ '+ venta.idCliente?.telefono || '' ,
                   fillColor: '#eeeeee',
                  } ,
                
                
                   
                  
                   '',
                   '',
                   '',
                   '',
                   '',
                   '',
                 ],
              
              ]
            }
          },
         

          {
            style: 'tableExample',
            table: {
              widths: [35,'*',50, 50],
              body: [
                ['CANT', 'DESCRIPCION','V. UNIT', 'V.TOTAL'],
                 [  venta.producto.map((producto: any) => producto.cantidad).join('\n '),
                 venta.producto.map((producto: any) => producto.descripcion).join('\n '),
                 venta.producto.map((producto: any) => producto.precio).join('\n '),
                    venta.producto.map((producto: any) => producto.total).join('\n ') ,]
              ]
            }
          },

          {
            style: 'tableExample',
            table: {
              widths: [ '*', 50],
              body: [
                ['VALOR TOTAL A PAGAR', venta.total],
               
              ]
            }
          },


         

         
        ],
      };
      pdfFInal.content.push(
      
      );
      const pdf = pdfMake.createPdf(pdfFInal);
      pdf.open();
    } else {
      const ventasSnapshot = await this.afs
        .collection('ventas')
        .get()
        .toPromise();

      const ventas = ventasSnapshot.docs.map((doc) => doc.data());

      const pdfFInal: any = {
        content: [
         
          {
            text: 'REPORTE DE VENTAS',
            style: 'header',
            alignment: 'center'
          },
          {
            style: 'tableExample',
            table: {
              widths: [50, 75, 75, '*', '*', 50, 50],
              body: [
                [
                  'Codigo',
                  'Cliente',
                  'Vendedor',
                  'Producto',
                  'Metodo De Pago',
                  'Neto',
                  'Total',
                ],
              ],
            },
          },
        ],
      };
      ventas.forEach((venta: any) => {
        console.log(ventas);

        pdfFInal.content.push({
          style: 'tableExample',
          table: {
            widths: [50, 75, 75, '*', '*', 50, 50],
            body: [
              [
                venta.codigo,
                venta.idCliente.nombre,
                venta.idVendedor.nombre,
                venta.producto.map((producto: any) => producto.descripcion).join('\n '),
                venta.metodoPago,
                venta.neto,
                venta.total ,
              ],
            ],
          },
        });
      });
      const pdf = pdfMake.createPdf(pdfFInal);
      pdf.open();
    }
  }
  catch(error) {
// dsfdsf


    console.error('Error generating PDF:', error);
  }
}
