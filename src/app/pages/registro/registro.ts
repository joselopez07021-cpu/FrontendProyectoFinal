import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class RegistroPagina {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  formulario = this.formBuilder.nonNullable.group({
    nombreUsuario: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],
    correo: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    contrasena: [
      '',
      [
        Validators.required,
        Validators.minLength(4)
      ]
    ]
  });

  registrar(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService.registrar(this.formulario.getRawValue())
      .subscribe({
        next: () => {
          this.cargando = false;
          this.mensajeExito =
            'Usuario registrado correctamente. Ahora puedes iniciar sesión.';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1200);
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false;

          if (error.status === 0) {
            this.mensajeError =
              'No fue posible conectarse con el servidor.';
            return;
          }

          this.mensajeError =
            error.error?.mensaje ??
            error.error ??
            'Ocurrió un error al registrar el usuario.';
        }
      });
  }
}
