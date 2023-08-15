import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ProductosComponent } from './productos/productos.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { ClientesComponent } from './clientes/clientes.component';

import { PedidosComponent } from './pedidos/pedidos.component';
import { InicioComponent } from './inicio/inicio.component';
import { ReporteDeVentasComponent } from './reporte-de-ventas/reporte-de-ventas.component';
import { CrearVentaComponent } from './crear-venta/crear-venta.component';
import { AdministrarVentasComponent } from './administrar-ventas/administrar-ventas.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'categoria', component: CategoriaComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'inicio', component: InicioComponent },
      { path: 'admin_ventas', component: AdministrarVentasComponent },
      { path: 'reporte', component: ReporteDeVentasComponent },
      { path: 'crear_venta', component: CrearVentaComponent },
      { path: 'crear_venta/:idePedido', component: CrearVentaComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule,
  ],
})
export class PagesRoutingModule {}
