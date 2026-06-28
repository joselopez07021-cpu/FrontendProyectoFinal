import { Injectable } from '@angular/core';

import { Producto } from '../models/producto';
import { ItemCarrito } from '../models/carrito-item';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly storageKey = 'carrito';

  obtenerCarrito(): ItemCarrito[] {
    const carritoGuardado = localStorage.getItem(this.storageKey);

    if (!carritoGuardado) {
      return [];
    }

    try {
      return JSON.parse(carritoGuardado) as ItemCarrito[];
    } catch {
      this.vaciarCarrito();
      return [];
    }
  }

  agregarProducto(producto: Producto): void {
    const carrito = this.obtenerCarrito();

    const itemExistente = carrito.find(
      (item) => item.producto.id === producto.id
    );

    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        itemExistente.cantidad++;
      }
    } else {
      carrito.push({
        producto,
        cantidad: 1
      });
    }

    this.guardarCarrito(carrito);
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    const carrito = this.obtenerCarrito();

    const item = carrito.find(
      (item) => item.producto.id === productoId
    );

    if (!item) {
      return;
    }

    if (cantidad <= 0) {
      this.eliminarProducto(productoId);
      return;
    }

    if (cantidad > item.producto.stock) {
      item.cantidad = item.producto.stock;
    } else {
      item.cantidad = cantidad;
    }

    this.guardarCarrito(carrito);
  }

  eliminarProducto(productoId: number): void {
    const carrito = this.obtenerCarrito().filter(
      (item) => item.producto.id !== productoId
    );

    this.guardarCarrito(carrito);
  }

  vaciarCarrito(): void {
    localStorage.removeItem(this.storageKey);
  }

  obtenerTotal(): number {
    return this.obtenerCarrito().reduce(
      (total, item) =>
        total + item.producto.precio * item.cantidad,
      0
    );
  }

  obtenerCantidadTotal(): number {
    return this.obtenerCarrito().reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  private guardarCarrito(carrito: ItemCarrito[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(carrito)
    );
  }
}
