import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Categoria,
  CrearCategoriaRequest
} from '../models/categoria';

interface CategoriasResponse {
  $values?: Categoria[];
  items?: Categoria[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Categorias`;

  obtenerCategorias(): Observable<Categoria[]> {
    return this.http
      .get<Categoria[] | CategoriasResponse>(this.apiUrl)
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

  crearCategoria(
    categoria: CrearCategoriaRequest
  ): Observable<Categoria> {
    return this.http.post<Categoria>(
      this.apiUrl,
      categoria
    );
  }

  actualizarCategoria(
    id: number,
    categoria: CrearCategoriaRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      categoria
    );
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
