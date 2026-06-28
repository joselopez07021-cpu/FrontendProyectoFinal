import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CarritoService } from '../../services/carrito';
import { PedidoService } from '../../services/pedido';
import { Auth } from '../../services/auth';

import { ItemCarrito } from '../../models/carrito-item';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink
  ],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoPagina implements OnInit {
  private readonly carritoService = inject(CarritoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  items: ItemCarrito[] = [];
  total = 0;
  cargandoPedido = false;
  mensajeError = '';
  modalPedidoExitosoAbierto = false;
  pedidoCreadoId: number | null = null;

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.items = this.carritoService.obtenerCarrito();
    this.total = this.carritoService.obtenerTotal();
  }

  aumentarCantidad(item: ItemCarrito): void {
    this.carritoService.actualizarCantidad(
      item.producto.id,
      item.cantidad + 1
    );

    this.cargarCarrito();
  }

  disminuirCantidad(item: ItemCarrito): void {
    this.carritoService.actualizarCantidad(
      item.producto.id,
      item.cantidad - 1
    );

    this.cargarCarrito();
  }

  eliminarProducto(productoId: number): void {
    this.carritoService.eliminarProducto(productoId);
    this.cargarCarrito();
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.cargarCarrito();
  }

 crearPedido(): void {
  this.mensajeError = '';

  if (this.items.length === 0) {
    this.mensajeError = 'El carrito está vacío.';
    return;
  }

  const usuario = this.authService.obtenerUsuario();

  if (!usuario) {
    this.router.navigate(['/login']);
    return;
  }

  this.cargandoPedido = true;

  const pedido = {
    usuarioId: usuario.id,
    detalles: this.items.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad
    }))
  };

  console.log('Pedido enviado:', pedido);

  this.pedidoService.crearPedido(pedido)
    .subscribe({
      next: (pedidoCreado) => {
        console.log('Pedido creado:', pedidoCreado);

        this.carritoService.vaciarCarrito();
        this.cargarCarrito();
        this.cargandoPedido = false;
        this.pedidoCreadoId = pedidoCreado.id ?? null;
        this.modalPedidoExitosoAbierto = true;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error(error);

        this.cargandoPedido = false;

        this.mensajeError =
          error.error ??
          error.error?.mensaje ??
          'No fue posible crear el pedido.';

        this.changeDetector.detectChanges();
      }
    });
}

  cerrarModalPedidoExitoso(): void {
    this.modalPedidoExitosoAbierto = false;
    this.pedidoCreadoId = null;
    this.router.navigate(['/mis-pedidos']);
  }
}
