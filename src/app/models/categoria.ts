export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CrearCategoriaRequest {
  nombre: string;
  descripcion: string;
}