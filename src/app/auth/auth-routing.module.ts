import { LoginComponent } from './login/login.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { canActivate, redirectUnauthorizedTo }from '@angular/fire/auth-guard' ;
import { DashboardComponent } from '../pages/dashboard/dashboard.component';

const routes:Routes =[
  {path:'',pathMatch:'full', redirectTo:'/login'},
  {path:'login', component:LoginComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:['/login']}
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  
  ]
})
export class AuthRoutingModule { }
