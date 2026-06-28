import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CrearOrdenPaypalResponse,
  CapturarOrdenPaypalResponse
} from '../models/paypal-response';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Pagos`;

  crearOrdenPaypal(
    pedidoId: number
  ): Observable<CrearOrdenPaypalResponse> {
    return this.http.post<CrearOrdenPaypalResponse>(
      `${this.apiUrl}/paypal/crear/${pedidoId}`,
      {}
    );
  }

  capturarOrdenPaypal(
    ordenId: string
  ): Observable<CapturarOrdenPaypalResponse> {
    return this.http.post<CapturarOrdenPaypalResponse>(
      `${this.apiUrl}/paypal/capturar/${ordenId}`,
      {}
    );
  }
}