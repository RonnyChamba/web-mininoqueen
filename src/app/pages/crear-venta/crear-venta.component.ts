import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
import { catchError, of, tap } from 'rxjs';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductosService } from 'src/app/services/productos.service';
import { TokenService } from 'src/app/services/token.service';
import { VentasService } from 'src/app/services/ventas.service';
import { generaCadenaAleatoria } from 'src/app/util/dataUtil';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.scss'],
})
export class CrearVentaComponent implements OnInit {
  idePedido: any;

  // solo llega un pedido
  pedidoCurrent: any = [];

  // productos del pedido
  productosPedido: any = [];

  // productos de la tabla
  productoTabla: any = [];

  public formVenta: FormGroup;

  metodoPagoList = [
    {
      id: '',
      nombre: 'Seleccione un metodo de pago',
    },
    {
      id: 'Efectivo',
      nombre: 'Efectivo',
    },
    {
      id: 'Tarjeta',
      nombre: 'Tarjeta',
    },
    {
      id: 'Transferencia',
      nombre: 'Transferencia',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private activePath: ActivatedRoute,
    private pedidosService: PedidosService,
    private productoService: ProductosService,
    private ventaService: VentasService,
    private toaster: ToastrService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.idePedido = this.activePath.snapshot.paramMap.get('idePedido');
    console.log(this.idePedido);
    this.createFormVenta();
    this.onChangeStatus();
    this.populateDataPedido();
    this.getProductos();
  }

  createFormVenta() {
    this.formVenta = this.fb.group({
      cliente: ['', [Validators.required]],
      documento: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
        ],
      ],
      neto: [0, [Validators.required]],
      total: [0, [Validators.required]],
      metodoPago: ['', [Validators.required]],
      impuesto: [0, []],
      codigoTransaccion: ['', []],
      valorImpuesto: [0, []],
      productos: [[], []],
    });
  }

  onChangeStatus() {
    this.formVenta.get('impuesto')?.valueChanges.subscribe((resp) => {
      const impuesto = this.pedidoCurrent.total * (resp / 100);

      this.formVenta
        .get('valorImpuesto')
        ?.setValue(impuesto, { emitEvent: false });

      console.log(impuesto);

      this.formVenta.patchValue(
        {
          total: this.pedidoCurrent.total + impuesto,
        },
        { emitEvent: false }
      );
    });
  }

  public validacionClientes = this.fb.group({
    nuevoCliente: ['', [Validators.required]],
    nuevoDocumentoId: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(13)],
    ],
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
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
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

  populateDataPedido() {
    this.pedidosService
      .getPedidosByIde(false, this.idePedido)
      .pipe(
        tap((resp) => {
          console.log(resp);

          if (!resp?.empty) {
            resp.forEach((element: any) => {
              this.pedidoCurrent = element.data();

              this.productosPedido = this.pedidoCurrent.producto;
              console.log(this.formVenta.value);

              this.formVenta.patchValue(
                {
                  cliente: this.pedidoCurrent.idCliente.nombre,
                  documento: this.pedidoCurrent.idCliente.documento,
                  total: this.pedidoCurrent.total,
                  neto: this.pedidoCurrent.total,
                  codigoTransaccion: generaCadenaAleatoria(15),
                },
                { emitEvent: false }
              );

              console.log(this.pedidoCurrent);
            });
          }
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      )
      .subscribe();
  }

  deleteProduct(item: any) {
    console.log(item);

    alert('Funcion pendiende de eliminar');
  }

  async saveVenta() {

    /**
     * Copiamos el documento del pedido y lo guardamos en la venta, sobreescribimos algunos valores y agregamos otros
     */


    // Crear venta
    const ventaSave = this.pedidoCurrent;
    ventaSave.estado = true;
    ventaSave.total = this.formVenta.get('total')?.value;
    ventaSave.neto = this.formVenta.get('neto')?.value;
    ventaSave.impuesto = this.formVenta.get('impuesto')?.value;
    ventaSave.valorImpuesto = this.formVenta.get('valorImpuesto')?.value;
    ventaSave.fechaVenta = new Date();
    ventaSave.metodoPago = this.formVenta.get('metodoPago')?.value;
    ventaSave.codigoTransaccion = this.formVenta.get('codigoTransaccion')?.value;


    try {
     
      await this.ventaService.saveVenta(ventaSave);
      // Actualizar el estado del pedido
      await this.pedidosService.updateEstadoPedido(this.idePedido, true);

      // actulizar el campo ventas del producto, esto sirve para saber cuantas veces se ha vendido un producto


      for (let index = 0; index < this.productosPedido.length; index++) {
        
        const element = this.productosPedido[index];

        const uid = element.uid;
        const cantidad = element.cantidad;
        await this.productoService.updateVentasProducto(uid, cantidad);
      }

    
      this.toaster.success('Venta guardada correctamente', 'Exito');

      this.router.navigate(['/dashboard/pedidos']);

    }catch(err) {
      console.log(err);

      this.toaster.error('Error al guardar la venta', 'Error');
    }
  }

  getProductos() {

    const userCurrent = JSON.parse(this.tokenService.getToken() || '{}');
    this.productoService.getProductosByUser(userCurrent?.codigo).subscribe((resp) => {
      // console.log(resp);

      this.productoTabla = [];

      resp.forEach((element: any) => {
  
        this.productoTabla.push(element.payload.doc.data());
      });

      console.log(this.productoTabla);
    });
  }
}
