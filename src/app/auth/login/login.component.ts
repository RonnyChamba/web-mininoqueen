import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MensajesServiceService } from 'src/app/services/mensajes-service.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UsuarioService,
    private messageService: MensajesServiceService
  ) {}

  public validacion = this.fb.group({
    ingUsuario: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
        ),
      ],
    ],
    ingPassword: ['', [Validators.required]],
  });

  user_validation_messages = {
    ingUsuario: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'pattern', message: 'Ejemplo (desarrollandoideas@gmail.com)' },
    ],

    ingPassword: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };
  get ingUsuarioValido() {
    return (
      this.validacion.get('ingUsuario')?.dirty &&
      this.validacion.get('ingUsuario')?.touched
    );
  }

  get ingUsuarioNoValido() {
    return (
      this.validacion.get('ingUsuario')?.invalid &&
      this.validacion.get('ingUsuario')?.touched
    );
  }
  get ingPasswordValido() {
    return (
      this.validacion.get('ingPassword')?.dirty &&
      this.validacion.get('ingPassword')?.touched
    );
  }

  get ingPasswordNoValido() {
    return (
      this.validacion.get('ingPassword')?.invalid &&
      this.validacion.get('ingPassword')?.touched
    );
  }

  async onSubmit() {
    this.messageService.loading(true, 'Iniciando sesión.....');

    setTimeout(async () => {
      try {
        const authResp = await this.loginService.login(this.validacion.value);
        const userSelect = await this.saveUserLogedInLocalStorage(
          authResp.user
        );
        this.tokenService.setToken(JSON.stringify(userSelect));
        this.router.navigate(['/dashboard/inicio']);
      } catch (error) {
        console.log(error);
      }finally {
        this.messageService.loading(false);
      }
    }, 1200);
  }

  saveUserLogedInLocalStorage(user: any) {
    return new Promise((resolve, reject) => {
      this.userService.getUserById(user.uid).subscribe((res) => {
        if (res.exists) {
          const userCurrent: any = res.data();
          console.log(userCurrent);
          resolve(userCurrent);
        } else {
          console.log('no existe');
          reject(false);
        }
      });
    });
  }
}
