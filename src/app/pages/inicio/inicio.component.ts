import { InicioService } from './../../services/inicio.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { TokenService } from 'src/app/services/token.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: ChartOptions;
  cantidadProductos: number = 0;
  cantidadClientes: number = 0;
  cantidadCateogirias: number = 0;
  cantidadVentas: number = 0;
  aggRecienteProductos: any[] = [];
  productosMasVendidos: any[] = [];

  constructor(
    private tokenService: TokenService,
    private inicioService: InicioService
  ) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.chartOptions = {
      series: [],

      chart: {
        height: 250,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#fff', 'transparent'],
          opacity: 0.5,
        },
      },
      // xaxis: {
      //   categories: [
      //     0,
      //     1,
      //     2,
      //     3,
      //     4,
      //     5,
      //     6,
      //     7,
      //     8,
      //     9,
      //     10,
      //     11
      //   ],
      // },
      xaxis: {
        categories: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Aug',
          'Sep',
          "Oct",
          "Nov",
          "Dic"
        ],
      },
    };

    this.inicioService
      .getCantidadProductos(user?.codigo)
      .subscribe((productos: any[]) => {
        this.cantidadProductos = productos.length;
      });
    this.inicioService
      .getCantidadClientes(user?.codigo)
      .subscribe((clientes: any[]) => {
        this.cantidadClientes = clientes.length;
      });
    this.inicioService
      .getCantidadCategorias()
      .subscribe((categorias: any[]) => {
        this.cantidadCateogirias = categorias.length;
      });

    this.inicioService
      .getCantidadVentas(user?.uid)
      .subscribe((ventas: any[]) => {
        const totalVentas = ventas
          .map((venta) => venta.total)
          .reduce((a, b) => a + b, 0);

        this.cantidadVentas = totalVentas || 0;
      });

    this.inicioService
      .getProductosRecientes(5) // Obtener los últimos 5 productos
      .subscribe((produc: any[]) => {
        this.aggRecienteProductos = produc;
        // console.log(produc)
      });

    this.inicioService
      .getProductosMasVendidos(5) // Obtener los 5 productos más vendidos
      .subscribe((productosMasVendidos: any[]) => {
        this.productosMasVendidos = productosMasVendidos;
      });

    this.generateGrafico();
  }

  generateGrafico() {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.inicioService
      .getCantidadVentas(user?.uid) 
      .subscribe((ventas: any[]) => {

        const newVentas = ventas.map((venta) => {
          const fechaVenta = venta.fechaVenta.toDate();
          const mes = fechaVenta.getMonth();
          return { ...venta, mes };
        });

        // console.log(newVentas);

        // agrupar por mes
        const ventasPorMes = newVentas.reduce((acc, venta) => {
          const { mes } = venta;
          if (!acc[mes]) {
            acc[mes] = [];
          }
          acc[mes].push(venta);
          return acc;
        }
        , {});

        // console.log(ventasPorMes);


        const valores = [0,0,0,0,0,0,0,0,0,0,0,0];

        // suma el campo total del array de ventas y devuelve un array con los totales, numero de mes
        const ventasTotales = Object.values(ventasPorMes).map((ventas: any) => {

          // console.log("vetnas", ventas);

          const mes = ventas[0]?.mes;

          const totalVentas = ventas
          .map((venta: any) => venta.total)
            .reduce((a: number, b: number) => a + b, 0);

          valores[mes] = totalVentas;

          return totalVentas;
        });
        // console.log(ventasTotales);

      

        // this.chartOptions.series = [{ name: 'Ventas Mensuales', data: ventasTotales }];
        this.chartOptions.series = [{ name: 'Ventas Mensuales', data: valores}];
        // this.chartOptions.xaxis.categories = meses;
      });

      
  }
}
