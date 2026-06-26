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
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  cargando = false;
  mensajeError = '';

  formulario = this.formBuilder.nonNullable.group({
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
        Validators.required
      ]
    ]
  });

  iniciarSesion(): void {
    this.mensajeError = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService.login(this.formulario.getRawValue())
      .subscribe({
        next: (respuesta) => {
          this.authService.guardarSesion(respuesta);
          this.cargando = false;

          if (respuesta.usuario.rol === 'Administrador') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/productos']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false;

          if (error.status === 401) {
            this.mensajeError =
              'El correo o la contraseña son incorrectos.';
            return;
          }

          if (error.status === 0) {
            this.mensajeError =
              'No fue posible conectarse con el servidor.';
            return;
          }

          this.mensajeError =
            error.error?.mensaje ??
            'Ocurrió un error al iniciar sesión.';
        }
      });
  }
}