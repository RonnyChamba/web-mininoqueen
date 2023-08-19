import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from './categoria/categoria.component';
import { ClientesComponent } from './clientes/clientes.component';

import { PedidosComponent } from './pedidos/pedidos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InicioComponent } from './inicio/inicio.component';
import { AdministrarVentasComponent } from './administrar-ventas/administrar-ventas.component';
import { CrearVentaComponent } from './crear-venta/crear-venta.component';
import { ReporteDeVentasComponent } from './reporte-de-ventas/reporte-de-ventas.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountUploadPlanification, FormatDatePipe, TrimText } from '../../app/util/format-date.pipe';
import { PagesRoutingModule } from './pages-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
    DashboardComponent,
    ProductosComponent,
    CategoriaComponent,
    ClientesComponent,
    UsuarioComponent,
    PedidosComponent,
    PagesComponent,
    InicioComponent,
    AdministrarVentasComponent,
    CrearVentaComponent,
    ReporteDeVentasComponent,
    FormatDatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    NgApexchartsModule,
  ],
  exports:[
    DashboardComponent,
    ProductosComponent,
    CategoriaComponent,
    ClientesComponent,   
    PedidosComponent,
    FormsModule,
    ReactiveFormsModule
    
  ]

})
export class PagesModule { }
