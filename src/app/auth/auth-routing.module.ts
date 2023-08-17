import { LoginComponent } from './login/login.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { GuardLoginGuard } from '../guards/guard-login.guard';

const routes: Routes = [
  { path: '', component: LoginComponent},
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AuthRoutingModule {}
