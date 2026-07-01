
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { PedidoService } from '../../services/pedido';
import { Pedido } from '../../models/pedido';
import { PagoService } from '../../services/pago';

@Component({
  selector: 'app-my-orders',
  imports: [
    RouterLink
  ],
  templateUrl: './mis-pedidos.html'
})
export class MisPedidosPagina implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly pagoService = inject(PagoService);

  pedidos: Pedido[] = [];
  cargando = false;
  mensajeError = '';

  pedidoPagandoId: number | null = null;
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.pedidoService.obtenerMisPedidos()
      .subscribe({
        next: (pedidos) => {
          console.log('Mis pedidos:', pedidos);

          this.pedidos = pedidos;
          this.cargando = false;

          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error(error);

          this.mensajeError =
            'No fue posible cargar tus pedidos.';

          this.cargando = false;

          this.changeDetector.detectChanges();
        }
      });
  }
  pagarPedido(pedidoId: number): void {
  this.mensajeError = '';
  this.mensajeExito = '';
  this.pedidoPagandoId = pedidoId;

  this.pagoService.crearOrdenPaypal(pedidoId)
    .subscribe({
      next: (respuesta) => {
        console.log('Orden PayPal creada:', respuesta);

        if (!respuesta.urlAprobacion) {
          this.pedidoPagandoId = null;
          this.mensajeError =
            'No se recibió la URL de aprobación de PayPal.';
          this.changeDetector.detectChanges();
          return;
        }

        window.location.href = respuesta.urlAprobacion;
      },
      error: (error) => {
        console.error(error);

        this.pedidoPagandoId = null;
        this.mensajeError =
          error.error?.mensaje ??
          error.error ??
          'No fue posible iniciar el pago con PayPal.';

        this.changeDetector.detectChanges();
      }
    });
}
}
