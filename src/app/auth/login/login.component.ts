import { Component } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private fb: FormBuilder) {}

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
      }
     
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
}
