import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent {
  constructor(private fb: FormBuilder) {}

  public validacionClientes = this.fb.group({
    nuevoCliente: ['', [Validators.required]],
    nuevoDocumentoId: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(13)]],
    nuevoEmail: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
        ),
      ],
    ],
    nuevoTelefono: [
      '',
      [Validators.required, Validators.minLength(10),
        Validators.maxLength(10),]
       
    ],
    nuevaDireccion: ['', [Validators.required]],
  });

  user_validation_messages = {
    nuevoCliente: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    nuevoDocumentoId: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'minlength', message: 'Maximo 10 characters.' },
    ],
    nuevoEmail: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'pattern', message: 'Ejemplo (desarrollandoideas@gmail.com)' },
    ],

    nuevoTelefono: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'minlength', message: 'Maximo 10 characters.' },
     
    ],
    nuevaDireccion: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };
  get nuevoClienteValido() {
    return (
      this.validacionClientes.get('nuevoCliente')?.dirty &&
      this.validacionClientes.get('nuevoCliente')?.touched
    );
  }

  get nuevoClienteNoValido() {
    return (
      this.validacionClientes.get('nuevoCliente')?.invalid &&
      this.validacionClientes.get('inuevoCliente')?.touched
    );
  }
  get nuevoDocumentoIdValido() {
    return (
      this.validacionClientes.get('nuevoDocumentoId')?.dirty &&
      this.validacionClientes.get('nuevoDocumentoId')?.touched
    );
  }

  get nuevoDocumentoIdNoValido() {
    return (
      this.validacionClientes.get('nuevoDocumentoId')?.invalid &&
      this.validacionClientes.get('nuevoDocumentoId')?.touched
    );
  }
  get nuevoEmailValido() {
    return (
      this.validacionClientes.get('nuevoEmail')?.dirty &&
      this.validacionClientes.get('nuevoEmail')?.touched
    );
  }

  get nuevoEmailNoValido() {
    return (
      this.validacionClientes.get('nuevoEmail')?.invalid &&
      this.validacionClientes.get('nuevoEmail')?.touched
    );
  }
  get nuevoTelefonoValido() {
    return (
      this.validacionClientes.get(' nuevoTelefono')?.dirty &&
      this.validacionClientes.get(' nuevoTelefono')?.touched
    );
  }

  get nuevoTelefonoNoValido() {
    return (
      this.validacionClientes.get(' nuevoTelefono')?.invalid &&
      this.validacionClientes.get(' nuevoTelefono')?.touched
    );
  }
  get nuevaDireccionValido() {
    return (
      this.validacionClientes.get('nuevaDireccion')?.dirty &&
      this.validacionClientes.get('nuevaDireccion')?.touched
    );
  }

  get nuevaDireccionNoValido() {
    return (
      this.validacionClientes.get('nuevaDireccion')?.invalid &&
      this.validacionClientes.get('nuevaDireccion')?.touched
    );
  }
}
