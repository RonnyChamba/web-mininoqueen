import { ProductosService } from './../../services/productos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  validacionProductos: FormGroup;
  productos: any[] = [];
  constructor(
    private fb: FormBuilder,
    private ProductosService: ProductosService,
    private toastr: ToastrService
  ) {
    this.validacionProductos = this.fb.group({
      codigo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      precioCompra: ['', [Validators.required]],
      precioVenta: ['', [Validators.required]],
      //  nuevaImagen:  ['', ],
      subCategoria: [''],
      productoAnterior: [''],
      porcentaje: [''],
    });
  }
  ngOnInit(): void {
    this.getProduct();
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

  addProductos() {
    const validacionProductos: any = {
      codigo: this.validacionProductos.value.codigo,
      descripcion: this.validacionProductos.value.descripcion,
      categoria: this.validacionProductos.value.categoria,
      stock: this.validacionProductos.value.stock,
      precioCompra: this.validacionProductos.value.precioCompra,
      precioVenta: this.validacionProductos.value.precioVenta,
      subCategoria: this.validacionProductos.value.subCategoria,
      productoAnterior: this.validacionProductos.value.productoAnterior,
      porcentaje: this.validacionProductos.value.porcentaje,
      // nuevaImagen: this.validacionProductos.value.nuevaImage,
    };
    this.ProductosService.addProduct(validacionProductos)

      .then(() =>
        this.toastr.success(
          'Producto Registrado',
          'El producto fue registrado con exito!',
          { positionClass: 'toast-bottom-right' }
        )
      )
      .catch((error) => console.log(error));
  }

  getProduct() {
    this.ProductosService.getProducto().subscribe((data) => {
      this.productos = [];
      data.forEach((element: any) => {
        // console.log(element.payload.doc.id)
        this.productos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      // console.log(this.productos)
    });
  }

  delete(id: string) {
   
    let  categoria = this.productos.find(item => item.id == id);
    Swal.fire({
      title: 'Esta seguro?',
      text:  `¿Esta seguro de eliminar la categoria ${categoria? categoria.categoria: ''}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
    if (result.isConfirmed) {
    this.ProductosService.delete(id)
      
        Swal.fire( 'Categoria eliminada',
        'La categoria ha sido eliminado con exito',
        'success');
      }
    });
  }
}
