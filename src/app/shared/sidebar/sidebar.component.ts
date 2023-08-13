import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { LoginComponent } from './../../auth/login/login.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(private loginService: LoginService, private router: Router) {}

  logout() {
    this.loginService
      .logout()
      .then((respuesta) => {
        this.router.navigate(['/login']);
      })
      .catch((error) => console.log(error));
  }
}
