import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { PagoService } from '../../services/pago';

@Component({
  selector: 'app-pago-exitoso',
  imports: [
    RouterLink
  ],
  templateUrl: './pago-exitoso.html'
})
export class PagoExitoso implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pagoService = inject(PagoService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  cargando = true;
  mensaje = 'Procesando pago...';
  mensajeError = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.cargando = false;
      this.mensajeError =
        'No se recibió el token de PayPal.';
      this.changeDetector.detectChanges();
      return;
    }

    this.pagoService.capturarOrdenPaypal(token)
      .subscribe({
        next: (respuesta) => {
          console.log('Pago capturado:', respuesta);

          this.cargando = false;
          this.mensaje =
            respuesta.mensaje ??
            'Pago realizado correctamente.';

          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error(error);

          this.cargando = false;
          this.mensajeError =
            error.error?.mensaje ??
            error.error ??
            'No fue posible capturar el pago.';

          this.changeDetector.detectChanges();
        }
      });
  }
}
