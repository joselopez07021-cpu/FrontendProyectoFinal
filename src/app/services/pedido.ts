import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Pedido } from '../models/pedido';
import { CrearPedido } from '../models/crear-pedido-request';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Pedidos`;

  crearPedido(pedido: CrearPedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  obtenerMisPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(
      `${this.apiUrl}/mis-pedidos`
    );
  }

  obtenerPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  cambiarEstadoPedido(
    id: number,
    nuevoEstado: string
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/estado`,
      JSON.stringify(nuevoEstado),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
