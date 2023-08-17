import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from 'src/app/services/categoria.service';
import { TokenService } from 'src/app/services/token.service';
import { generaCadenaAleatoria } from 'src/app/util/dataUtil';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
  validacionCategoria: FormGroup;
  categoria: any[] = [];
  categoriaExistente: boolean = false;

  categotyCurrent: any;
  constructor(
    private fb: FormBuilder,
    private CategoriaService: CategoriaService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) {
    this.validacionCategoria = this.fb.group({
      categoria: ['', [Validators.required]],
      subcategoria: [[], []],
    });
  }
  ngOnInit(): void {
    this.getCategoria();
  }

  user_validation_messages = {
    categoria: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };

  get categoriaValido() {
    return (
      this.validacionCategoria.get('categoria')?.dirty &&
      this.validacionCategoria.get('categoria')?.touched
    );
  }

  get categoriaNoValido() {
    return (
      this.validacionCategoria.get('categoria')?.invalid &&
      this.validacionCategoria.get('categoria')?.touched
    );
  }

  typeAction(status: boolean) {
    this.categoriaExistente = status;

    this.validacionCategoria.reset();
  }
  async addCategoria() {
    if (this.categoriaExistente) {
      await this.updateCategoria();
      return;
    }

    const uid = generaCadenaAleatoria(10);

    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');
    const validacionCategoria: any = {
      categoria: this.validacionCategoria.value.categoria,
      subcategorias: [],
      uid,
      fecha: new Date(),
      productos: [],
      intermediario: userCurrent.codigo,
      
    };

    console.log(validacionCategoria);

    // return;
    this.CategoriaService.saveCategoria(uid, validacionCategoria)

      .then(() => {
        // this.categoriaExistente = true;
        this.toastr.success(
          'Categoria Registrada',
          'La categoria fue registrado con exito!',
          { positionClass: 'toast-bottom-right' }
        );
      })

      .catch((error) => console.log(error));
  }

  getCategoria() {


    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');


    this.CategoriaService.getCategoria(userCurrent.codigo).subscribe((data) => {
      this.categoria = [];
      data.forEach((element: any) => {
        // console.log(element.payload.doc.id)
        this.categoria.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      // console.log(this.categoria)
    });
  }

  deleteCategoria(id: string) {
    let categoria = this.categoria.find((item) => item.id == id);
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
        this.CategoriaService.deleteCategoria(id);

        Swal.fire(
          'Categoria eliminada',
          'La categoria ha sido eliminado con exito',
          'success'
        );
      }
    });
  }

  editarCategoria(id: string) {
    this.CategoriaService.editarCategoria(id).subscribe(
      (data) => {
        this.categoriaExistente = true;

        this.categotyCurrent = data.data();

        console.log(this.categotyCurrent);

        this.validacionCategoria.patchValue({
          categoria: this.categotyCurrent.categoria,
        });
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }

  async updateCategoria() {
    try {
      console.log(this.categotyCurrent);

      const data = {
        categoria: this.validacionCategoria.value.categoria,
      };

      let isSuccess = await this.CategoriaService.updateCategoria(
        this.categotyCurrent.uid,
        data
      );

      if (isSuccess) {
        await this.CategoriaService.updateNombreProductos(
          this.categotyCurrent.uid,
          data
        );
        this.toastr.success(
          'Categoria Actualizada',
          'La categoria fue actualizada con exito!',
          { positionClass: 'toast-bottom-right' }
        );
      }
    } catch (error) {
      console.log(error);
      this.toastr.error('Error al actualizar ', '');
    }
  }
}
