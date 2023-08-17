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
import { GuardAccessGuard } from '../guards/guard-access.guard';
import { GuardLoginGuard } from '../guards/guard-login.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'usuario', component: UsuarioComponent, 
      canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin'] } },
      { path: 'productos', component: ProductosComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'categoria', component: CategoriaComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'clientes', component: ClientesComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'pedidos', component: PedidosComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'inicio', component: InicioComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'admin_ventas', component: AdministrarVentasComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'reporte', component: ReporteDeVentasComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'crear_venta', component: CrearVentaComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
      { path: 'crear_venta/:idePedido', component: CrearVentaComponent, canActivate: [GuardAccessGuard],
      data: { expectedRol: ['admin', 'user'] } },
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
