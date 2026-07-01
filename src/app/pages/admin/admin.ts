import { PedidoService } from '../../services/pedido';
import { Pedido } from '../../models/pedido';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize, timeout } from 'rxjs';

import { CategoriaService } from '../../services/categoria';
import {
  Categoria,
  CrearCategoriaRequest
} from '../../models/categoria';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto';
import { CrearProducto } from '../../models/crear-producto-request';

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin.html'
})
export class Admin implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly productoService = inject(ProductoService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly pedidoService = inject(PedidoService);

  categorias: Categoria[] = [];
  productos: Producto[] = [];
  pedidos: Pedido[] = [];
  cargandoPedidos = false;
  mensajeErrorPedidos = '';
  mensajeExitoPedidos = '';

  cargando = false;
  guardando = false;
  mensajeError = '';
  mensajeExito = '';
  categoriaEditandoId: number | null = null;

  cargandoProductos = false;
  guardandoProducto = false;
  mensajeErrorProducto = '';
  mensajeExitoProducto = '';
  productoEditandoId: number | null = null;
  productoImagenPublicId = '';
  imagenSeleccionada: File | null = null;
  modalConfirmacionAbierto = false;
  modalConfirmacionTitulo = 'Confirmar accion';
  modalConfirmacionMensaje = '';
  modalConfirmacionAccion = '';
  private accionConfirmada: (() => void) | null = null;

  formulario = this.formBuilder.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(5)
      ]
    ]
  });

  formularioProducto = this.formBuilder.nonNullable.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(1)
      ]
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(1)
      ]
    ],
    precio: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    stock: [
      0,
      [
        Validators.required,
        Validators.min(0)
      ]
    ],
    imagenUrl: [''],
    categoriaId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
    this.cargarPedidos();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.categoriaService.obtenerCategorias()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.cargando = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
        },
        error: (error) => {
          console.error(error);
          this.mensajeError = this.obtenerMensajeError(
            error,
            'No fue posible cargar las categorias.'
          );
        }
      });
  }

  guardarCategoria(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.changeDetector.markForCheck();
      return;
    }

    this.guardando = true;
    this.changeDetector.markForCheck();

    const categoria = this.construirPayloadCategoria();

    if (this.categoriaEditandoId) {
      this.categoriaService
        .actualizarCategoria(
          this.categoriaEditandoId,
          categoria
        )
        .pipe(
          finalize(() => {
            this.guardando = false;
            this.changeDetector.markForCheck();
          })
        )
        .subscribe({
          next: () => {
            this.mensajeExito =
              'Categoria actualizada correctamente.';
            this.cancelarEdicion();
            this.cargarCategorias();
          },
          error: (error) => {
            console.error(error);
            this.mensajeError = this.obtenerMensajeError(
              error,
              'No fue posible actualizar la categoria.'
            );
          }
        });

      return;
    }

    this.categoriaService.crearCategoria(categoria)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.mensajeExito =
            'Categoria creada correctamente.';
          this.formulario.reset({
            nombre: '',
            descripcion: ''
          });
          this.cargarCategorias();
        },
        error: (error) => {
          console.error(error);
          this.mensajeError = this.obtenerMensajeError(
            error,
            'No fue posible crear la categoria.'
          );
        }
      });
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditandoId = categoria.id;
    this.formulario.setValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    });
    this.mensajeError = '';
    this.mensajeExito = '';
    this.changeDetector.markForCheck();
  }

  cancelarEdicion(): void {
    this.categoriaEditandoId = null;
    this.formulario.reset({
      nombre: '',
      descripcion: ''
    });
    this.changeDetector.markForCheck();
  }

  eliminarCategoria(id: number): void {
    this.abrirModalConfirmacion(
      'Eliminar categoria',
      'Seguro que deseas eliminar esta categoria?',
      'Eliminar',
      () => {
        this.categoriaService.eliminarCategoria(id)
          .subscribe({
            next: () => {
              this.mensajeExito =
                'Categoria eliminada correctamente.';
              this.cargarCategorias();
            },
            error: (error) => {
              console.error(error);
              this.mensajeError = this.obtenerMensajeError(
                error,
                'No fue posible eliminar la categoria. Puede que tenga productos asociados.'
              );
              this.changeDetector.markForCheck();
            }
          });
      }
    );
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.mensajeErrorProducto = '';

    this.productoService.obtenerProductos()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.cargandoProductos = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: (productos) => {
          this.productos = productos;
        },
        error: (error) => {
          console.error(error);
          this.mensajeErrorProducto = this.obtenerMensajeError(
            error,
            'No fue posible cargar los productos.'
          );
        }
      });
  }

  guardarProducto(): void {
  this.mensajeErrorProducto = '';
  this.mensajeExitoProducto = '';

  if (this.formularioProducto.invalid) {
    this.formularioProducto.markAllAsTouched();
    this.changeDetector.markForCheck();
    return;
  }

  this.guardandoProducto = true;
  this.changeDetector.markForCheck();

  const producto = this.construirPayloadProducto();

  if (this.productoEditandoId) {
    this.productoService
      .actualizarProducto(
        this.productoEditandoId,
        producto
      )
      .pipe(
        finalize(() => {
          this.guardandoProducto = false;
          this.changeDetector.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.mensajeExitoProducto =
            'Producto actualizado correctamente.';

          this.cancelarEdicionProducto();
          this.cargarProductos();
        },
        error: (error) => {
          console.error(error);

          this.mensajeErrorProducto =
            this.obtenerMensajeError(
              error,
              'No fue posible actualizar el producto.'
            );
        }
      });

    return;
  }

  this.productoService.crearProductoConImagen({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    categoriaId: producto.categoriaId,
    imagen: this.imagenSeleccionada
  })
    .pipe(
      finalize(() => {
        this.guardandoProducto = false;
        this.changeDetector.markForCheck();
      })
    )
    .subscribe({
      next: () => {
        this.mensajeExitoProducto =
          'Producto creado correctamente.';

        this.imagenSeleccionada = null;

        this.formularioProducto.reset({
          nombre: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          imagenUrl: '',
          categoriaId: 0
        });

        this.productoEditandoId = null;
        this.cargarProductos();
      },
      error: (error) => {
        console.error(error);

        this.mensajeErrorProducto =
          this.obtenerMensajeError(
            error,
            'No fue posible crear el producto.'
          );
      }
    });
}

  editarProducto(producto: Producto): void {
    this.productoEditandoId = producto.id;
    this.formularioProducto.setValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagenUrl: producto.imagenUrl ?? '',
      categoriaId: producto.categoriaId
    });
    this.productoImagenPublicId =
      producto.imagenPublicId ?? '';
    this.mensajeErrorProducto = '';
    this.mensajeExitoProducto = '';
    this.changeDetector.markForCheck();
  }

  cancelarEdicionProducto(): void {
    this.productoEditandoId = null;
    this.formularioProducto.reset({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagenUrl: '',
      categoriaId: 0
    });
    this.productoImagenPublicId = '';
    this.imagenSeleccionada = null;
    this.changeDetector.markForCheck();
  }

  eliminarProducto(id: number): void {
    this.abrirModalConfirmacion(
      'Eliminar producto',
      'Seguro que deseas eliminar este producto?',
      'Eliminar',
      () => {
        this.productoService.eliminarProducto(id)
          .subscribe({
            next: () => {
              this.mensajeExitoProducto =
                'Producto eliminado correctamente.';
              this.cargarProductos();
            },
            error: (error) => {
              console.error(error);
              this.mensajeErrorProducto = this.obtenerMensajeError(
                error,
                'No fue posible eliminar el producto. Puede que este asociado a un pedido.'
              );
              this.changeDetector.markForCheck();
            }
          });
      }
    );
  }

  private obtenerMensajeError(
    error: unknown,
    mensajePorDefecto: string
  ): string {
    if (!(error instanceof HttpErrorResponse)) {
      return mensajePorDefecto;
    }

    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (
      error.error &&
      typeof error.error === 'object' &&
      'title' in error.error &&
      typeof error.error.title === 'string'
    ) {
      return error.error.title;
    }

    if (error.status === 401 || error.status === 403) {
      return 'Tu sesion no tiene permisos de administrador. Vuelve a iniciar sesion.';
    }

    return mensajePorDefecto;
  }

  private construirPayloadCategoria(): CrearCategoriaRequest {
    const datosFormulario = this.formulario.getRawValue();

    return {
      id: this.categoriaEditandoId ?? undefined,
      nombre: datosFormulario.nombre.trim(),
      descripcion: datosFormulario.descripcion.trim()
    };
  }

  private construirPayloadProducto(): CrearProducto {
    const datosFormulario =
      this.formularioProducto.getRawValue();

    return {
      id: this.productoEditandoId ?? undefined,
      nombre: datosFormulario.nombre.trim(),
      descripcion: datosFormulario.descripcion.trim(),
      precio: Number(datosFormulario.precio),
      stock: Number(datosFormulario.stock),
      imagenUrl: datosFormulario.imagenUrl?.trim() ?? '',
      imagenPublicId: this.productoImagenPublicId,
      categoriaId: Number(datosFormulario.categoriaId)
    };
  }

  cargarPedidos(): void {
    this.cargandoPedidos = true;
    this.mensajeErrorPedidos = '';

    this.pedidoService.obtenerPedidos()
      .subscribe({
        next: (pedidos) => {
          console.log('Pedidos admin:', pedidos);

          this.pedidos = pedidos;
          this.cargandoPedidos = false;
          this.changeDetector.detectChanges();
        },
        error: (error) => {
          console.error(error);

          this.mensajeErrorPedidos =
            'No fue posible cargar los pedidos.';

          this.cargandoPedidos = false;
          this.changeDetector.detectChanges();
        }
      });
  }

  cambiarEstadoPedido(
    pedido: Pedido,
    nuevoEstado: string
  ): void {
    this.mensajeErrorPedidos = '';
    this.mensajeExitoPedidos = '';

    this.pedidoService.cambiarEstadoPedido(
      pedido.id,
      nuevoEstado
    )
      .subscribe({
        next: () => {
          pedido.estado = nuevoEstado;
          this.mensajeExitoPedidos =
            'Estado del pedido actualizado correctamente.';

          this.changeDetector.detectChanges();
          this.cargarPedidos();
        },
        error: (error) => {
          console.error(error);

          this.mensajeErrorPedidos =
            this.obtenerMensajeError(
              error,
              'No fue posible cambiar el estado del pedido.'
            );

          this.changeDetector.detectChanges();
        }
      });
  }

  eliminarPedido(id: number): void {
    this.abrirModalConfirmacion(
      'Eliminar pedido',
      'Seguro que deseas eliminar este pedido?',
      'Eliminar',
      () => {
        this.mensajeErrorPedidos = '';
        this.mensajeExitoPedidos = '';

        this.pedidoService.eliminarPedido(id)
          .subscribe({
            next: () => {
              this.mensajeExitoPedidos =
                'Pedido eliminado correctamente.';
              this.cargarPedidos();
            },
            error: (error) => {
              console.error(error);

              this.mensajeErrorPedidos =
                this.obtenerMensajeError(
                  error,
                  'No fue posible eliminar el pedido.'
                );

              this.changeDetector.detectChanges();
            }
          });
      }
    );
  }

  cerrarModalConfirmacion(): void {
    this.modalConfirmacionAbierto = false;
    this.modalConfirmacionTitulo = 'Confirmar accion';
    this.modalConfirmacionMensaje = '';
    this.modalConfirmacionAccion = '';
    this.accionConfirmada = null;
    this.changeDetector.markForCheck();
  }

  confirmarModalConfirmacion(): void {
    const accion = this.accionConfirmada;

    this.cerrarModalConfirmacion();
    accion?.();
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.imagenSeleccionada = null;
      return;
    }

    this.imagenSeleccionada = input.files[0];
  }

  private abrirModalConfirmacion(
    titulo: string,
    mensaje: string,
    accion: string,
    onConfirmar: () => void
  ): void {
    this.modalConfirmacionTitulo = titulo;
    this.modalConfirmacionMensaje = mensaje;
    this.modalConfirmacionAccion = accion;
    this.accionConfirmada = onConfirmar;
    this.modalConfirmacionAbierto = true;
    this.changeDetector.markForCheck();
  }
}
