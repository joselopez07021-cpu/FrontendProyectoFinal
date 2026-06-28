import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { ProductoService } from '../../services/producto';
import { CategoriaService } from '../../services/categoria';

import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';

import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosPagina implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly carritoService = inject(CarritoService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];

  categoriaSeleccionadaId = 0;

  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias()
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.productoService.obtenerProductos()
      .subscribe({
        next: (productos) => {
          this.productos = productos;
          this.productosFiltrados = productos;
          this.cargando = false;
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error(error);

          this.mensajeError =
            'No fue posible cargar los productos.';

          this.cargando = false;
          this.changeDetector.detectChanges();
        }
      });
  }

  filtrarPorCategoria(categoriaId: number): void {
    this.categoriaSeleccionadaId = categoriaId;

    if (categoriaId === 0) {
      this.productosFiltrados = this.productos;
      return;
    }

    this.productosFiltrados = this.productos.filter(
      (producto) => producto.categoriaId === categoriaId
    );
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);

    this.mensajeExito =
      `${producto.nombre} agregado al carrito.`;

    setTimeout(() => {
      this.mensajeExito = '';
      this.changeDetector.detectChanges();
    }, 2000);
  }
}
