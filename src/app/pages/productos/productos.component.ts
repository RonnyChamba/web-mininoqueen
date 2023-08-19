import { ProductosService } from './../../services/productos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MensajesServiceService } from 'src/app/services/mensajes-service.service';
import { TokenService } from 'src/app/services/token.service';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { generaCadenaAleatoria } from 'src/app/util/dataUtil';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  validacionProductos: FormGroup;
  productos: any[] = [];
  productoExistente = false;
  categorias: any[] = [];
  subCategorias: any[] = [];
  files: any;

  productEdit: any;
  isAdmin = false;

  constructor(
    private fb: FormBuilder,
    private ProductosService: ProductosService,
    private toastr: ToastrService,
    private categoriaService: CategoriaService,
    private uploadFile: UploadFileService,
    private messageServvice: MensajesServiceService,
    private tokenService: TokenService
  ) {
    this.isAdmin = this.tokenService.isLoggedAdmin();

    this.createForm();
  }
  ngOnInit(): void {
    this.onChangeValues();
    this.getProduct();
    this.getCategorias();
    this.clearOrSetValidator();
  }

  clearOrSetValidator() {
    if (!this.isAdmin) {
      this.validacionProductos
        .get('categoria')
        ?.removeValidators([Validators.required]);
    }
  }

  createForm() {
    this.validacionProductos = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      detalles: [''],
      categoria: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      precioCompra: ['', [Validators.required]],
      precioVenta: ['', [Validators.required]],
      imagen: [''],
      subCategoria: [''],
      productoAnterior: [''],
      detallesAnterior: [''],
      productoSiguiente: [''],
      detallesSiguiente: [''],
      porcentaje: [''],
    });
  }

  onChangeValues() {
    this.validacionProductos
      .get('categoria')
      ?.valueChanges.subscribe((data) => {
        console.log(data);

        if (data == '') {
          this.subCategorias = [
            {
              uid: '',
              nombre: 'Seleccione una subcategoria',
            },
          ];
          this.validacionProductos
            .get('subCategoria')
            ?.setValue('', { emitEvent: false });
          return;
        } else {
          this.subCategorias = this.categorias.find(
            (item) => item.uid == data
          )?.subcategorias;

          if (this.subCategorias.length < 1) {
            this.subCategorias = [
              {
                uid: '',
                nombre: 'Seleccione una subcategoria',
              },
            ];
            this.validacionProductos
              .get('subCategoria')
              ?.setValue('', { emitEvent: false });
          }
        }
      });
  }

  user_validation_messages = {
    codigo: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],

    descripcion: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    categoria: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    stock: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    precioCompra: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    precioVenta: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };
  get codigoValido() {
    return (
      this.validacionProductos.get('codigo')?.dirty &&
      this.validacionProductos.get('codigo')?.touched
    );
  }

  get codigoNoValido() {
    return (
      this.validacionProductos.get('codigo')?.invalid &&
      this.validacionProductos.get('codigo')?.touched
    );
  }
  get categoriaValido() {
    return (
      this.validacionProductos.get('categoria')?.dirty &&
      this.validacionProductos.get('categoria')?.touched
    );
  }

  get categoriaNoValido() {
    return (
      this.validacionProductos.get('categoria')?.invalid &&
      this.validacionProductos.get('categoria')?.touched
    );
  }
  get stockValido() {
    return (
      this.validacionProductos.get('stock')?.dirty &&
      this.validacionProductos.get('stock')?.touched
    );
  }

  get stockNoValido() {
    return (
      this.validacionProductos.get('stock')?.invalid &&
      this.validacionProductos.get('stock')?.touched
    );
  }
  get precioCompraValido() {
    return (
      this.validacionProductos.get('precioCompra')?.dirty &&
      this.validacionProductos.get('precioCompra')?.touched
    );
  }

  get precioCompraNoValido() {
    return (
      this.validacionProductos.get('precioCompra')?.invalid &&
      this.validacionProductos.get('precioCompra')?.touched
    );
  }
  get precioVentaValido() {
    return (
      this.validacionProductos.get('precioVenta')?.dirty &&
      this.validacionProductos.get('precioVenta')?.touched
    );
  }

  get precioVentaNoValido() {
    return (
      this.validacionProductos.get('precioVenta')?.invalid &&
      this.validacionProductos.get('precioVenta')?.touched
    );
  }
  get descripcionValido() {
    return (
      this.validacionProductos.get('descripcion')?.dirty &&
      this.validacionProductos.get('descripcion')?.touched
    );
  }

  get descripcionNoValido() {
    return (
      this.validacionProductos.get('descripcion')?.invalid &&
      this.validacionProductos.get('descripcion')?.touched
    );
  }

  newProducto() {
    this.productoExistente = false;
    this.validacionProductos.get('codigo')?.enable();
    this.validacionProductos.patchValue(
      {
        codigo: '',
        descripcion: '',
        categoria: '',
        stock: '',
        precioCompra: '',
        detalles: '',
        precioVenta: '',
        imagen: '',
        subCategoria: '',
        productoAnterior: '',
        detallesAnterior: '',
        productoSiguiente: '',
        detallesSiguiente: '',
        porcentaje: '',
      },
      { emitEvent: false }
    );
  }

  async addProductos() {
    // console.log(this.validacionProductos);
    // console.log(this.validacionProductos.value);

    // return;

    let message = this.productoExistente
      ? 'Actualizando producto ....'
      : 'Registrando producto ....';

    this.messageServvice.loading(true, message);

    if (!this.productoExistente) {
      setTimeout(async () => {
        try {
          try {
            if (this.files) {
              const resources = await this.uploadFile.uploadFile(this.files);
              // this. = resources.url;
              this.validacionProductos.value.imagen = resources.url;
              console.log(resources);
            }

            // cuando es editar y no se carga una imagen
            if (!this.files && this.productoExistente) {
              this.validacionProductos.value.imagen = this.productEdit.imagen;
            }
          } catch (error) {
            console.log('Error al carga imagen del usuario', error);

            this.validacionProductos.value.imagen = '';
          }

          let categoriaPro = {};
          let productoSugeridos = [];

          if (this.isAdmin) {
            // obtener la categoria
            let itemCategoria = this.categorias.find(
              (item) => item.id == this.validacionProductos.value.categoria
            );

            categoriaPro = {
              categoria: itemCategoria.categoria,
              subCategoria: this.validacionProductos.value.subCategoria,
              uid: itemCategoria.uid,
            };

            if (this.validacionProductos.value.productoAnterior) {
              productoSugeridos.push(
                this.validacionProductos.value.productoAnterior
              );
            }

            if (this.validacionProductos.value.productoSiguiente) {
              productoSugeridos.push(
                this.validacionProductos.value.productoSiguiente
              );
            }
          }

          const uidGenerado = generaCadenaAleatoria(20);
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const validacionProductos: any = {
            categoria: categoriaPro,
            codigo: this.validacionProductos.value.codigo,
            descripcion: this.validacionProductos.value.descripcion,
            detalles: this.validacionProductos.value.detalles,
            fecha: new Date(),
            imagen: this.validacionProductos.value.imagen,
            intermediario: user.codigo,
            precioCompra: this.validacionProductos.value.precioCompra,
            precioVenta: this.validacionProductos.value.precioVenta,
            productosSugeridos: productoSugeridos,
            stock: this.validacionProductos.value.stock,
            uid: uidGenerado,
            ventas: 0,
          };

          console.log(validacionProductos);

          if (this.productoExistente) {
            validacionProductos.uid = this.productEdit.uid;
            validacionProductos.fecha = this.productEdit.fecha;
            validacionProductos.ventas = this.productEdit.ventas;
          }

          await this.ProductosService.addProduct(validacionProductos);

          this.toastr.success(
            'Producto Registrado',
            'El producto fue registrado con exito!',
            { positionClass: 'toast-bottom-right' }
          );
        } catch (error) {
          console.log(error);
        } finally {
          this.messageServvice.loading(false);
        }
      }, 1100);
    } else this.updateProducto();
  }

  updateProducto() {
    setTimeout(async () => {
      try {
        try {
          if (this.files) {
            const resources = await this.uploadFile.uploadFile(this.files);
            // this. = resources.url;
            this.validacionProductos.value.imagen = resources.url;
            console.log(resources);
          }

          // // cuando es editar y no se carga una imagen
          // if (!this.files && this.productoExistente) {
          //   this.validacionProductos.value.imagen = this.productEdit.imagen;
          // }
        } catch (error) {
          console.log('Error al carga imagen del usuario', error);

          this.validacionProductos.value.imagen = '';
        }

        let categoriaPro = {};
        let productoSugeridos = [];

        if (this.isAdmin) {
          // obtener la categoria
          let itemCategoria = this.categorias.find(
            (item) => item.id == this.validacionProductos.value.categoria
          );

          categoriaPro = {
            categoria: itemCategoria.categoria,
            subCategoria: this.validacionProductos.value.subCategoria,
            uid: itemCategoria.uid,
          };

          if (this.validacionProductos.value.productoAnterior) {

            // buscar el producto anterios

            const productoAnterior = this.productos.find(
              (item) => item?.uid == this.validacionProductos.value.productoAnterior
            );


            if (productoAnterior) {

              productoSugeridos.push(
                {
                   uid: productoAnterior.uid,
                   descripcion: productoAnterior.descripcion,
                   detallesAnterior: this.validacionProductos?.get('detallesAnterior')?.value || '',
                   imagen: productoAnterior.imagen,
                }
               
             );

            }
         
          }

          if (this.validacionProductos.value.productoSiguiente) {

            // buscar el producto siguiente

            const productoSiguiente = this.productos.find(
              (item) => item?.uid == this.validacionProductos.value.productoSiguiente
            );

            if (productoSiguiente) {

              productoSugeridos.push(
            
                {
                  uid: productoSiguiente.uid,
                  descripcion: productoSiguiente.descripcion || '',
                  detallesSiguiente: this.validacionProductos.get('detallesSiguiente')?.value || '',
                  imagen: productoSiguiente.imagen || '',
                }
              );
            }
            
          }
        }

        // const uidGenerado = generaCadenaAleatoria(20);
        // const user = JSON.parse(localStorage.getItem('user') || '{}');


       
        this.productEdit.descripcion = this.validacionProductos.value.descripcion;
        this.productEdit.detalles = this.validacionProductos.value.detalles;
        this.productEdit.imagen = this.validacionProductos.value.imagen;
        this.productEdit.precioCompra = this.validacionProductos.value.precioCompra;
        this.productEdit.precioVenta = this.validacionProductos.value.precioVenta;
        this.productEdit.stock = this.validacionProductos.value.stock;

        if (this.isAdmin) {
          this.productEdit.categoria = categoriaPro;
          this.productEdit.productosSugeridos = productoSugeridos;
        }

        // const validacionProductos: any = {
        //   categoria: categoriaPro,
        //   codigo: this.validacionProductos.value.codigo,
        //   descripcion: this.validacionProductos.value.descripcion,
        //   detalles: this.validacionProductos.value.detalles,
        //   // fecha: new Date(),
        //   imagen: this.validacionProductos.value.imagen,
        //   // intermediario: user.codigo,
        //   precioCompra: this.validacionProductos.value.precioCompra,
        //   precioVenta: this.validacionProductos.value.precioVenta,
        //   productosSugeridos: productoSugeridos,
        //   stock: this.validacionProductos.value.stock,
        //   // uid: uidGenerado,
        //   // ventas: 0,
        // };

        console.log(this.productEdit);

        // if (this.productoExistente) {
        //   validacionProductos.uid = this.productEdit.uid;
        //   validacionProductos.fecha = this.productEdit.fecha;
        //   validacionProductos.ventas = this.productEdit.ventas;
        // }

        await this.ProductosService.updateProduct(this.productEdit);

        this.toastr.success(
          'Producto Actualizado',
          'El producto fue actualizado con exito!',
          { positionClass: 'toast-bottom-right' }
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.messageServvice.loading(false);
      }
    }, 1100);
  }

  getProduct() {
    const userCurrent = JSON.parse(localStorage.getItem('user') || '{}');

    this.ProductosService.getProducto(userCurrent?.codigo).subscribe((data) => {
      this.productos = [];
      data.forEach((element: any) => {
        // console.log(element.payload.doc.id)
        this.productoExistente = true;
        this.productos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      console.log(this.productos);
    });
  }

  delete(id: string) {
    let categoria = this.productos.find((item) => item.id == id);
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
        this.ProductosService.delete(id);

        Swal.fire(
          'Producto eliminado',
          'El productos ha sido eliminado con exito',
          'success'
        );
      }
    });
  }

  editarProducto(id: string) {
    console.log(id);

    this.validacionProductos.get('codigo')?.disable();
    this.ProductosService.editarProductos(id).subscribe(
      (data) => {
        this.productEdit = data.payload.data();
        this.productoExistente = true;
        console.log(this.productEdit);
        this.setValueEdit();
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }

  getCategorias() {
    const userCurrent = JSON.parse(localStorage.getItem('user') || '{}');

    this.categoriaService
      .getCategoria(userCurrent?.codigo)
      .subscribe((data) => {
        this.categorias = [];

        this.categorias.push({
          uid: '',
          categoria: 'Seleccione una categoria',
          subcategorias: [
            {
              uid: '',
              nombre: 'Seleccione una subcategoria',
            },
          ],
        });

        data.forEach((element: any) => {
          // console.log(element.payload.doc.id)
          this.categorias.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          });
        });

        console.log(this.categorias);
        // console.log(this.productos)
      });
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

  setValueEdit() {
    /**
     *  codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      precioCompra: ['', [Validators.required]],
      precioVenta: ['', [Validators.required]],
      imagen: [''],
      subCategoria: [''],
      productoAnterior: [''],
      productoSiguiente: [''],
      porcentaje: [''],
     */

    this.validacionProductos.patchValue(
      {
        codigo: this.productEdit.codigo,
        descripcion: this.productEdit.descripcion,
        detalles: this.productEdit?.detalles,
        categoria: this.productEdit.categoria.uid,
        stock: this.productEdit.stock,
        precioCompra: this.productEdit.precioCompra,
        precioVenta: this.productEdit.precioVenta,
        imagen: this.productEdit.imagen,
        subCategoria: this.productEdit.categoria.subCategoria,
        productoAnterior: this.productEdit.productosSugeridos[0]?.uid || '',
        detallesAnterior: this.productEdit.productosSugeridos[0]?.detallesAnterior || '',
        productoSiguiente: this.productEdit.productosSugeridos[1]?.uid || '',
        detallesSiguiente: this.productEdit.productosSugeridos[1]?.detallesSiguiente || '',
      },
      { emitEvent: false }
    );
  }
}
