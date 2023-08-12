import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent {
  constructor(private fb: FormBuilder) {}

  public validacionUsuario = this.fb.group({
    nombre: ['', Validators.required],
    usuario: ['',[
      Validators.required,
      Validators.pattern(
        '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
      ),
    ],],
    Password: ['', Validators.required],
    perfil: ['', Validators.required],
     
  });

  
  user_validation_messages = {
    nombre: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      }
    ],

    usuario:[{
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'pattern', message: 'Ejemplo (desarrollandoideas@gmail.com)' },
    ],
    Password: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      }
    ],
    perfil: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      }
    ],
    


  };
  get nombreValido() {
    return (
      this.validacionUsuario.get('nombre')?.dirty &&
      this.validacionUsuario.get('nombre')?.touched
    );
  }

  get nombreNoValido() {
    return (
      this.validacionUsuario.get('nombre')?.invalid &&
      this.validacionUsuario.get('nombre')?.touched
    );
  }
  get perfilValido() {
    return (
      this.validacionUsuario.get('perfil')?.dirty &&
      this.validacionUsuario.get('perfil')?.touched
    );
  }

  get perfilNoValido() {
    return (
      this.validacionUsuario.get('perfil')?.invalid &&
      this.validacionUsuario.get('perfil')?.touched
    );
  }
  get PasswordValido() {
    return (
      this.validacionUsuario.get('Password')?.dirty &&
      this.validacionUsuario.get('Password')?.touched
    );
  }

  get PasswordNoValido() {
    return (
      this.validacionUsuario.get('Password')?.invalid &&
      this.validacionUsuario.get('Password')?.touched
    );
  }
  get usuarioValido() {
    return (
      this.validacionUsuario.get('usuario')?.dirty &&
      this.validacionUsuario.get('usuario')?.touched
    );
  }

  get usuarioNoValido() {
    return (
      this.validacionUsuario.get('usuario')?.invalid &&
      this.validacionUsuario.get('usuario')?.touched
    );
  }
  
  
}

