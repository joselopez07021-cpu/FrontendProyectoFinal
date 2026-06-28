export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CrearCategoriaRequest {
  id?: number;
  nombre: string;
  descripcion: string;
}
