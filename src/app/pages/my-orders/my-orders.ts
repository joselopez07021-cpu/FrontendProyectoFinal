
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { PedidoService } from '../../services/pedido';
import { Pedido } from '../../models/pedido';

@Component({
  selector: 'app-my-orders',
  imports: [
    RouterLink
  ],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  pedidos: Pedido[] = [];
  cargando = false;
  mensajeError = '';

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
}