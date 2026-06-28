export interface CrearDetallePedido {
  productoId: number;
  cantidad: number;
}

export interface CrearPedido {
  usuarioId: number;
  detalles: CrearDetallePedido[];
}
