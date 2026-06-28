export interface UsuarioSesion {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: string;
}

export interface LoginRespuesta {
  mensaje: string;
  token: string;
  usuario: UsuarioSesion;
}
