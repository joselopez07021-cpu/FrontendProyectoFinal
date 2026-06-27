export interface CrearDetallePedidoRequest {
  productoId: number;
  cantidad: number;
}

export interface CrearPedidoRequest {
  usuarioId: number;
  detalles: CrearDetallePedidoRequest[];
}