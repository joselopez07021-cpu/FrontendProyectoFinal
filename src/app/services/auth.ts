import {
  inject,
  Injectable,
  signal
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginPeticion } from '../models/login-request';
import { Registro } from '../models/register-request';
import {
  LoginRespuesta,
  UsuarioSesion
} from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly usuarioSesion = signal<UsuarioSesion | null>(
    this.cargarUsuarioInicial()
  );

  login(datos: LoginPeticion): Observable<LoginRespuesta> {
    return this.http.post<LoginRespuesta>(
      `${this.apiUrl}/login`,
      datos
    );
  }

  registrar(datos: Registro): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/registro`,
    datos
  );
}

  guardarSesion(respuesta: LoginRespuesta): void {
    localStorage.setItem('token', respuesta.token);

    localStorage.setItem(
      'usuario',
      JSON.stringify(respuesta.usuario)
    );

    this.usuarioSesion.set(respuesta.usuario);
  }

  obtenerToken(): string | null {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    if (this.tokenExpirado(token)) {
      this.cerrarSesion();
      return null;
    }

    return token;
  }

  obtenerUsuario(): UsuarioSesion | null {
    return this.obtenerSesionValida();
  }

  estaAutenticado(): boolean {
    return this.obtenerSesionValida() !== null;
  }

  esAdministrador(): boolean {
    return this.obtenerUsuario()?.rol === 'Administrador';
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSesion.set(null);
  }

  private obtenerSesionValida(): UsuarioSesion | null {
    const usuario = this.usuarioSesion();

    if (!usuario) {
      return null;
    }

    if (!this.obtenerToken()) {
      this.usuarioSesion.set(null);
      return null;
    }

    return usuario;
  }

  private cargarUsuarioInicial(): UsuarioSesion | null {
    const token = localStorage.getItem('token');

    if (!token || this.tokenExpirado(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return null;
    }

    const usuarioGuardado = localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado) as UsuarioSesion;
    } catch {
      localStorage.removeItem('usuario');
      return null;
    }
  }

  private tokenExpirado(token: string): boolean {
    try {
      const payload = this.decodificarPayload(token);
      const exp = payload['exp'];

      if (typeof exp !== 'number') {
        return false;
      }

      const ahoraEnSegundos = Math.floor(Date.now() / 1000);
      return exp <= ahoraEnSegundos;
    } catch {
      return true;
    }
  }

  private decodificarPayload(
    token: string
  ): Record<string, unknown> {
    const partes = token.split('.');

    if (partes.length !== 3) {
      throw new Error('Token JWT invalido.');
    }

    const payloadBase64 = partes[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const payloadJson = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((caracter) =>
          `%${caracter.charCodeAt(0).toString(16).padStart(2, '0')}`
        )
        .join('')
    );

    return JSON.parse(payloadJson) as Record<string, unknown>;
  }
}
