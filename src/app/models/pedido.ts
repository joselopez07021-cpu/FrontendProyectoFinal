import { Producto } from './producto';

export interface DetallePedidoRespuesta {
  id: number;
  pedidoId: number;
  productoId: number;
  producto?: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  fechaPedido: string;
  total: number;
  estado: string;
  detallesPedido?: DetallePedidoRespuesta[];
}