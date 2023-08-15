import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  validacionUsuario:FormGroup;
  usuarios:any[]=[];
  userExistente :boolean=true;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
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
    Password: ['', Validators.required],
    perfil: ['', Validators.required],
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

  // addUser(){
  //   const validacionUsuario:any ={
  //     nombre: this.validacionUsuario.value.nombre,
  //     usuario: this.validacionUsuario.value.nuevoCodigo,
  //     Password: this.validacionUsuario.value.Password,
  //     nuevoCodigo: this.validacionUsuario.value.nuevoCodigo,
  //     perfil: this.validacionUsuario.value. perfil,
     
  //   }
  // }

  getUser() {
    this.usuarioService.getUser().subscribe((data) => {
      this.usuarios = [];
      data.forEach((element: any) => {
       
        this.userExistente = true;
        
        this.usuarios.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      // console.log(this.productos)
    });
  }


  deleteUser(id: string) {

    let  usuario = this.usuarios.find(item => item.id == id);
    Swal.fire({
      title: 'Esta seguro?',
      text:  `¿Esta seguro de eliminar el usuario ${usuario? usuario.nombre: ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
    if (result.isConfirmed) {
    this.usuarioService.deleteUser(id)
      
        Swal.fire( 'Usuario eliminada',
        'El usuario ha sido eliminado con exito',
        'success');
      }
    });
  }


  
  editarUser(id: string) {
    this.usuarioService.editarUser(id).subscribe(
      (data) => {
        this.userExistente = true;
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }
}
