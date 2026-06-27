export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  productos?: Producto[];
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  imagenPublicId?: string;
  categoriaId: number;
  categoria?: Categoria;
}