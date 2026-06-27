import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CarritoService } from '../../services/carrito';
import { PedidoService } from '../../services/pedido';
import { Auth } from '../../services/auth';

import { CarritoItem } from '../../models/carrito-item';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private readonly carritoService = inject(CarritoService);
  private readonly pedidoService = inject(PedidoService);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  items: CarritoItem[] = [];
  total = 0;
  cargandoPedido = false;
  mensajeError = '';

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.items = this.carritoService.obtenerCarrito();
    this.total = this.carritoService.obtenerTotal();
  }

  aumentarCantidad(item: CarritoItem): void {
    this.carritoService.actualizarCantidad(
      item.producto.id,
      item.cantidad + 1
    );

    this.cargarCarrito();
  }

  disminuirCantidad(item: CarritoItem): void {
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
        this.cargandoPedido = false;

        alert('Pedido creado correctamente.');

        this.router.navigate(['/mis-pedidos']);
      },
      error: (error) => {
        console.error(error);

        this.cargandoPedido = false;

        this.mensajeError =
          error.error ??
          error.error?.mensaje ??
          'No fue posible crear el pedido.';
      }
    });
}
}