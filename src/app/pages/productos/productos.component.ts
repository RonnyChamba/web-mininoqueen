import { ProductosService } from './../../services/productos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  validacionProductos: FormGroup;
  productos: any[] = [];
  productoExistente = true;

  categorias: any[] = [];
  subCategorias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ProductosService: ProductosService,
    private toastr: ToastrService,
    private categoriaService: CategoriaService
  ) {
  

    this.createForm();
  }
  ngOnInit(): void {
    this.onChangeValues();
    this.getProduct();
    this.getCategorias();
  }

  createForm() {
    
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



  onChangeValues(){

    this.validacionProductos.get("categoria")?.valueChanges.subscribe((data) => {
      
      console.log(data);

      if(data == ""){
        this.subCategorias = [ {
          uid: "",
          nombre: "Seleccione una subcategoria",
        } ];
        this.validacionProductos.get("subCategoria")?.setValue("", {emitEvent: false});
        return;
      }else{
        this.subCategorias = this.categorias.find(item => item.uid == data)?.subcategorias;

        if (this.subCategorias.length <1  ){

          this.subCategorias = [ {
            uid: "",
            nombre: "Seleccione una subcategoria",
          } ];
          this.validacionProductos.get("subCategoria")?.setValue("", {emitEvent: false});
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

  addProductos() {

    console.log(this.validacionProductos.value);
    
    return;
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
        this.productoExistente = true;
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

  editarProducto(id: string) {
    this.ProductosService.editarProductos(id).subscribe(
      (data) => {
        this.productoExistente = true;
      },
      (error) => {
        console.log(error.error);
        Swal.fire('Mensaje del Sistema', '' + error.error.message, 'error');
      }
    );
  }


  getCategorias(){


    this.categoriaService.getCategoria().subscribe((data) => {
      this.categorias = [];

      this.categorias.push({
        uid: "",
        categoria: "Seleccione una categoria",
        subcategorias: [{
          uid: "",
          nombre: "Seleccione una subcategoria",
        }]
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
    }
    );


  }
}
