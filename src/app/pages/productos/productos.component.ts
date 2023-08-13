import { ProductosService } from './../../services/productos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
      nuevoCodigo: ['', [Validators.required]],
      nuevaDescripcion: ['', [Validators.required]],
      nuevaCategoria: ['', [Validators.required]],
      nuevoStock: ['', [Validators.required]],
      nuevoPrecioCompra: ['', [Validators.required]],
      nuevoPrecioVenta: ['', [Validators.required]],
      //  nuevaImagen:  ['', ],
      nuevasubCategoria: [''],
      productoAnterior: [''],
      porcentaje: [''],
    });
  }
  ngOnInit(): void {
    this.getProduct();
  }

  user_validation_messages = {
    nuevoCodigo: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],

    nuevaDescripcion: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    nuevaCategoria: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    nuevoStock: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    nuevoPrecioCompra: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
    nuevoPrecioVenta: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      },
    ],
  };
  get nuevoCodigoValido() {
    return (
      this.validacionProductos.get(' nuevoCodigo')?.dirty &&
      this.validacionProductos.get(' nuevoCodigo')?.touched
    );
  }

  get nuevoCodigoNoValido() {
    return (
      this.validacionProductos.get(' nuevoCodigo')?.invalid &&
      this.validacionProductos.get(' nuevoCodigo')?.touched
    );
  }
  get nuevaCategoriaValido() {
    return (
      this.validacionProductos.get(' nuevaCategoria')?.dirty &&
      this.validacionProductos.get(' nuevaCategoria')?.touched
    );
  }

  get nuevaCategoriaNoValido() {
    return (
      this.validacionProductos.get(' nuevaCategoria')?.invalid &&
      this.validacionProductos.get(' nuevaCategoria')?.touched
    );
  }
  get nuevoStockValido() {
    return (
      this.validacionProductos.get('nuevoStock')?.dirty &&
      this.validacionProductos.get('nuevoStock')?.touched
    );
  }

  get nuevoStockNoValido() {
    return (
      this.validacionProductos.get('nuevoStock')?.invalid &&
      this.validacionProductos.get('nuevoStock')?.touched
    );
  }
  get nuevoPrecioCompraValido() {
    return (
      this.validacionProductos.get('nuevoPrecioCompra')?.dirty &&
      this.validacionProductos.get('nuevoPrecioCompra')?.touched
    );
  }

  get nuevoPrecioCompraNoValido() {
    return (
      this.validacionProductos.get('nuevoPrecioCompra')?.invalid &&
      this.validacionProductos.get('nuevoPrecioCompra')?.touched
    );
  }
  get nuevoPrecioVentaValido() {
    return (
      this.validacionProductos.get(' nuevoPrecioVenta')?.dirty &&
      this.validacionProductos.get(' nuevoPrecioVenta')?.touched
    );
  }

  get nuevoPrecioVentaNoValido() {
    return (
      this.validacionProductos.get(' nuevoPrecioVenta')?.invalid &&
      this.validacionProductos.get(' nuevoPrecioVenta')?.touched
    );
  }
  get nuevaDescripcionValido() {
    return (
      this.validacionProductos.get('nuevaDescripcion')?.dirty &&
      this.validacionProductos.get('nuevaDescripcion')?.touched
    );
  }

  get nuevaDescripcionNoValido() {
    return (
      this.validacionProductos.get('nuevaDescripcion')?.invalid &&
      this.validacionProductos.get('nuevaDescripcion')?.touched
    );
  }

  addProductos() {
    const validacionProductos: any = {
      nuevoCodigo: this.validacionProductos.value.nuevoCodigo,
      nuevaDescripcion: this.validacionProductos.value.nuevaDescripcion,
      nuevaCategoria: this.validacionProductos.value.nuevaCategoria,
      nuevoStock: this.validacionProductos.value.nuevoStock,
      nuevoPrecioCompra: this.validacionProductos.value.nuevoPrecioCompra,
      nuevoPrecioVenta: this.validacionProductos.value.nuevoPrecioVenta,
      nuevasubCategoria: this.validacionProductos.value.nuevasubCategoria,
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
      this.productos =[];
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

  delete(id: string){
    this.ProductosService.delete(id).then(()=> {
      this.toastr.error(
      
        'Producto Eliminado',  'El producto fue eliminado con exito!',
        { positionClass: 'toast-bottom-right' }
      )
    }).catch(error =>{
      console.log(error)
    })
  }
}
