import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent {
  constructor(private fb: FormBuilder) {}

  public validacionProductos = this.fb.group({
    nuevoCodigo: ['', [Validators.required]],
    nuevaDescripcion: ['', [Validators.required]],
    nuevaCategoria: ['', [Validators.required]],
    nuevoStock: ['', [Validators.required]],
    nuevoPrecioCompra: ['', [Validators.required]],
    nuevoPrecioVenta: ['', [Validators.required]],
   
  });

  user_validation_messages = {
    nuevoCodigo: [
      {
        type: 'required',
        message: 'Campo obligatorio.',
      }
     
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
  get  nuevoCodigoValido() {
    return (
      this.validacionProductos.get(' nuevoCodigo')?.dirty &&
      this.validacionProductos.get(' nuevoCodigo')?.touched
    );
  }

  get  nuevoCodigoNoValido() {
    return (
      this.validacionProductos.get(' nuevoCodigo')?.invalid &&
      this.validacionProductos.get(' nuevoCodigo')?.touched
    );
  }
  get  nuevaCategoriaValido() {
    return (
      this.validacionProductos.get(' nuevaCategoria')?.dirty &&
      this.validacionProductos.get(' nuevaCategoria')?.touched
    );
  }

  get  nuevaCategoriaNoValido() {
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
  get  nuevoPrecioVentaValido() {
    return (
      this.validacionProductos.get(' nuevoPrecioVenta')?.dirty &&
      this.validacionProductos.get(' nuevoPrecioVenta')?.touched
    );
  }

  get  nuevoPrecioVentaNoValido() {
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
}
