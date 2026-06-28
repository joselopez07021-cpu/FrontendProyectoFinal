import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Producto } from '../models/producto';
import { CrearProducto } from '../models/crear-producto-request';

interface ProductosResponse {
  $values?: Producto[];
  items?: Producto[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Productos`;

  obtenerProductos(): Observable<Producto[]> {
    return this.http
      .get<Producto[] | ProductosResponse>(this.apiUrl)
      .pipe(
        map((respuesta) => {
          if (Array.isArray(respuesta)) {
            return respuesta;
          }

          if (Array.isArray(respuesta.$values)) {
            return respuesta.$values;
          }

          if (Array.isArray(respuesta.items)) {
            return respuesta.items;
          }

          return [];
        })
      );
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: CrearProducto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(
    id: number,
    producto: CrearProducto
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  crearProductoConImagen(producto: {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  imagen?: File | null;
}) {
  const formData = new FormData();

  formData.append('nombre', producto.nombre);
  formData.append('descripcion', producto.descripcion);
  formData.append('precio', producto.precio.toString());
  formData.append('stock', producto.stock.toString());
  formData.append('categoriaId', producto.categoriaId.toString());

  if (producto.imagen) {
    formData.append('imagen', producto.imagen);
  }

  return this.http.post<Producto>(
    `${this.apiUrl}/con-imagen`,
    formData
  );
}
}
