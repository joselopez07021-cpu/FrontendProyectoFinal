import { Categoria } from './categoria';

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