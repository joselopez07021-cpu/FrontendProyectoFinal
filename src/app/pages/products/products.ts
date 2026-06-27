import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { finalize, timeout } from 'rxjs';

import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly carritoService = inject(CarritoService);

  productos: Producto[] = [];
  cargando = false;
  mensajeError = '';

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.productoService.obtenerProductos()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.cargando = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (productos) => {
          console.log('Productos recibidos:', productos);

          this.productos = productos;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(error);

          this.mensajeError =
            'No fue posible cargar los productos. Revisa que el backend est\u00e9 encendido y respondiendo en localhost.';
          this.cdr.markForCheck();
        }
      });
  }

  agregarAlCarrito(producto: Producto): void {
  this.carritoService.agregarProducto(producto);
  alert('Producto agregado al carrito');
}
}
