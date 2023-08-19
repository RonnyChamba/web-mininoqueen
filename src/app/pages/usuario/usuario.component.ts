import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

// import * as firebase from 'firebase';
import { AngularFireModule } from '@angular/fire/compat';
import { timestamp } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { MensajesServiceService } from 'src/app/services/mensajes-service.service';
import { TokenService } from 'src/app/services/token.service';
import { generaCadenaAleatoriaNumber } from 'src/app/util/dataUtil';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  validacionUsuario: FormGroup;
  usuarios: any[] = [];
  userExistente: boolean = false;
  userEdit: any;
  
  files: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private firestore: AngularFirestore,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private uploadFile: UploadFileService,
    private messageServvice: MensajesServiceService,
    private tokenService: TokenService
  ) {
    this.validacionUsuario = this.fb.group({
      nombre: ['', Validators.required],
      usuario: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'
          ),
        ],
      ],
      password: ['', Validators.required],
      perfil: ['INTERMEDIARIO', Validators.required],
      estado: [true, Validators.required],
      foto: [''],
    });
  }
  ngOnInit(): void {
    this.getUser();
  }

  user_validation_messages = {
    nombre: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],

    usuario: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
      { type: 'pattern', message: 'Ejemplo (desarrollandoideas@gmail.com)' },
    ],
    Password: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    perfil: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
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
      this.validacionUsuario.get('password')?.dirty &&
      this.validacionUsuario.get('password')?.touched
    );
  }

  get PasswordNoValido() {
    return (
      this.validacionUsuario.get('password')?.invalid &&
      this.validacionUsuario.get('password')?.touched
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

  async onSubmitForm() {
    let message = this.userExistente
      ? 'Actualizando usuario ....'
      : 'Registrando usuario ....';

    this.messageServvice.loading(true, message);

    setTimeout(async () => {
      // this.messageServvice.loading(false, '');

      try {
        if (this.userExistente) {
          await this.updateDataUser();
        } else {
          const dataUser = this.validacionUsuario.value;
          dataUser.codigo = generaCadenaAleatoriaNumber(5);
          dataUser.fecha = new Date();

          const result = await this.loginService.register({
            email: dataUser.usuario,
            password: dataUser.password,
          });

          console.log(result);

          if (result) {
            // cargar imagen

            try {
              if (this.files) {
                const resources = await this.uploadFile.uploadFile(this.files);
                dataUser.foto = resources.url;

                console.log(resources);
              }
            } catch (error) {
              console.log('Error al carga imagen del usuario', error);
            }

            dataUser.uid = result.user?.uid;
            dataUser.ultimoLogin = new Date();
            dataUser.password = null;

            await this.usuarioService.saveUserData(dataUser);

            this.toastr.success('Usuario creado con exito', 'Usuario creado');
          }
        }
      } catch (error) {
        console.log(error);
        this.toastr.error('Error al crear usuario', 'Error');
      } finally {
        this.messageServvice.loading(false);
      }
    }, 1200);
  }

  public generaCadenaAleatoria(n: number): string {
    let result = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < n; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  getUser() {
    this.usuarioService.getUser().subscribe((data) => {
      this.usuarios = [];
      data.forEach((element: any) => {
        // this.userExistente = true;

        const data = element.payload.doc.data();
        data.id = element.payload.doc.id;

        const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');
        if (data.uid != userCurrent.uid) {
          this.usuarios.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          });
        }

        // console.log(this.usuarios);
      });
      // console.log(this.productos)
    });
  }

  deleteUser(id: string) {
    let usuario = this.usuarios.find((item) => item.id == id);
    Swal.fire({
      title: 'Esta seguro?',
      text: `¿Esta seguro de eliminar el usuario ${
        usuario ? usuario.nombre : ''
      }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUser(id);

        Swal.fire(
          'Usuario eliminada',
          'El usuario ha sido eliminado con exito',
          'success'
        );
      }
    });
  }

  editarUser(id: string) {
    this.usuarioService.editarUser(id).subscribe(
      (data) => {
        this.userExistente = true;

        // console.log(data);

        if (data.payload.exists) {
          this.userEdit = data.payload.data();
          this.userEdit.id = data.payload.id;

          this.validacionUsuario.patchValue({
            nombre: this.userEdit.nombre,
            usuario: this.userEdit.usuario,
            password: this.userEdit.password,
          });
        }
        console.log(this.userEdit);

        this.validacionUsuario.get('usuario')?.disable();

        // remove validators

        this.validacionUsuario.get('password')?.clearValidators();
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }

  // función para seleccionar un archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];

    console.log(file);
    if (file && file.size > 0) {
      this.files = file;
    } else {
      this.files = null;
    }
  }

  resetForm() {
    this.validacionUsuario.patchValue(
      {
        nombre: '',
        usuario: '',
        password: '',
      },
      { emitEvent: false }
    );

    this.files = null;
    this.userExistente = false;

    this.validacionUsuario.get('usuario')?.enable();

    // add validators again to password

    this.validacionUsuario.get('password')?.setValidators(Validators.required);
  }

  async updateDataUser() {
    // verificar si la imagen se actualizara

    if (this.files) {
      // cargar imagen

      try {
        if (this.files) {
          const resources = await this.uploadFile.uploadFile(this.files);
          this.userEdit.foto = resources.url;
          console.log(resources);
        }
      } catch (error) {
        console.log('Error al carga imagen del usuario', error);
      }
    }
    this.userEdit.nombre = this.validacionUsuario.value.nombre;
    // await this.usuarioService.saveUserData(dataUser);

    await this.usuarioService.updateUserData(this.userEdit.uid, this.userEdit);

    this.toastr.success('Usuario actulizado con exito', '');
  }
}
