import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { LoginComponent } from './../../auth/login/login.component';
import { Component } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {


  typeUser: string = '';
  isAdmin: boolean = false;

  constructor(
    private loginService: LoginService,
     private router: Router,
     private tokenService: TokenService) {

      const usuerCurrent= JSON.parse(this.tokenService.getToken() || '{}');
      this.typeUser = usuerCurrent.perfil;
      this.isAdmin = this.tokenService.isLoggedAdmin();
     }

  logout() {
    this.loginService
      .logout()
      .then((respuesta) => {
        this.router.navigate(['/login']);
      })
      .catch((error) => console.log(error));
  }
}
