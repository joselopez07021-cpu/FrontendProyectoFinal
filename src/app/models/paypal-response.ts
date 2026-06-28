export interface CrearOrdenPaypalResponse {
  mensaje: string;
  pagoId: number;
  pedidoId: number;
  ordenPayPalId: string;
  estado: string;
  montoColones: number;
  montoPayPal: number;
  moneda: string;
  urlAprobacion: string;
}

export interface CapturarOrdenPaypalResponse {
  mensaje: string;
  pagoId?: number;
  pedidoId?: number;
  ordenPayPalId?: string;
  estado?: string;
}