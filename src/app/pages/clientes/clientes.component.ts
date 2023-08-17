import { ClientesService } from './../../services/clientes.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  validacionClientes: FormGroup;
  clientes: any[] = [];
  clienteExistente = true;
  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private loginService: LoginService
  ) {
    this.validacionClientes = this.fb.group({
      nombre: ['', [Validators.required]],
      documento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
          ),
        ],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      fechaNacimiento: [''],
      direccion: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getClient();
  }

  user_validation_messages = {
    nombre: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    documento: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'minlength', message: 'Maximo 10 characters.' },
    ],
    email: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'pattern', message: 'Ejemplo (desarrollandoideas@gmail.com)' },
    ],

    telefono: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'minlength', message: 'Maximo 10 characters.' },
    ],
    direccion: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };
  get nombreValido() {
    return (
      this.validacionClientes.get('nombre')?.dirty &&
      this.validacionClientes.get('nombre')?.touched
    );
  }

  get nombreNoValido() {
    return (
      this.validacionClientes.get('nombre')?.invalid &&
      this.validacionClientes.get('nombre')?.touched
    );
  }
  get documentoValido() {
    return (
      this.validacionClientes.get('documento')?.dirty &&
      this.validacionClientes.get('documento')?.touched
    );
  }

  get documentoNoValido() {
    return (
      this.validacionClientes.get('documento')?.invalid &&
      this.validacionClientes.get('documento')?.touched
    );
  }
  get emailValido() {
    return (
      this.validacionClientes.get('email')?.dirty &&
      this.validacionClientes.get('email')?.touched
    );
  }

  get emailNoValido() {
    return (
      this.validacionClientes.get('email')?.invalid &&
      this.validacionClientes.get('email')?.touched
    );
  }
  get telefonoValido() {
    return (
      this.validacionClientes.get('telefono')?.dirty &&
      this.validacionClientes.get('telefono')?.touched
    );
  }

  get telefonoNoValido() {
    return (
      this.validacionClientes.get('telefono')?.invalid &&
      this.validacionClientes.get('telefono')?.touched
    );
  }
  get direccionValido() {
    return (
      this.validacionClientes.get('direccion')?.dirty &&
      this.validacionClientes.get('direccion')?.touched
    );
  }

  get direccionNoValido() {
    return (
      this.validacionClientes.get('direccion')?.invalid &&
      this.validacionClientes.get('direccion')?.touched
    );
  }

  async addClient() {
    try {
      const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');

      const validacionClientes: any = {
        nombre: this.validacionClientes.value.nombre,
        fecha: new Date(),
        documento: this.validacionClientes.value.documento,
        email: this.validacionClientes.value.email,
        telefono: this.validacionClientes.value.telefono,
        intermediario: userCurrent?.codigo,
        fechaNacimiento: this.validacionClientes.value.fechaNacimiento,
        direccion: this.validacionClientes.value.direccion,
      };

      // save clinte as user

      const result = await this.loginService.register({
        email: `${validacionClientes.documento}@gmail.com`,
        password: '123456',
      });

      if (result) {
        validacionClientes.uid = result.user?.uid;

        const resp = await this.clientesService.addClientWithUid(validacionClientes);

        this.toastr.success(
          'Cliente Registrado',
          'El cliente fue registrado con exito!',
          { positionClass: 'toast-bottom-right' }
        );
      }
    } catch (error) {
      this.toastr.error(
        'Error al registrar cliente',
        '',
        { positionClass: 'toast-bottom-right' }
      );
    }
  }

  getClient() {
    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');
    this.clientesService.getClient(userCurrent?.codigo).subscribe((data) => {
      this.clientes = [];
      data.forEach((element: any) => {
        this.clienteExistente = true;
        // console.log(element.payload.doc.id)
        this.clientes.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      // console.log(this.productos)
    });
  }

  deleteClient(id: string) {
    let categoria = this.clientes.find((item) => item.id == id);
    Swal.fire({
      title: 'Esta seguro?',
      text: `¿Esta seguro de eliminar la categoria ${
        categoria ? categoria.categoria : ''
      }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.deleteClient(id);

        Swal.fire(
          'Categoria eliminada',
          'La categoria ha sido eliminado con exito',
          'success'
        );
      }
    });
  }

  editarCliente(id: string) {
    this.clientesService.editarCliente(id).subscribe(
      (data) => {
        this.clienteExistente = true;
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }
}
