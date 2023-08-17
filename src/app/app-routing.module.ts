import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { NopageFoundComponent } from './nopage-found/nopage-found.component';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { GuardAccessGuard } from './guards/guard-access.guard';
import { GuardLoginGuard } from './guards/guard-login.guard';

// const routes: Routes=[

// {path:'', redirectTo:'/login', pathMatch:'full'},
// {path:'**', component:NopageFoundComponent},
// ]

const routes: Routes=[
  
  {path:'', redirectTo:'/auth', pathMatch:'full'},

  {
    path: 'auth',
    children: [
      {
        path: '',
        // canActivate: [noAuthGuard],
        loadChildren: () =>
          import('../app/auth/auth.module').then(
            (module) => module.AuthModule
          ),
      },
    ],
    canActivate: [GuardLoginGuard],
  },

  
  {path:'**', component:NopageFoundComponent},

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    // PagesRoutingModule,
    // AuthRoutingModule
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
