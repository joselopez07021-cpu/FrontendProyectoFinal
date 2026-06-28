import { Routes } from '@angular/router';

import {
  authGuard
} from './guards/auth-guard';

import {
  adminGuard
} from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home')
        .then((m) => m.Home),
    title: 'Inicio | DermaHous'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then((m) => m.Login),
    title: 'Iniciar sesión | DermaHous'
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro')
        .then((m) => m.RegistroPagina),
    title: 'Registro | DermaHous'
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/productos/productos')
        .then((m) => m.ProductosPagina),
    title: 'Productos | DermaHous'
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito')
        .then((m) => m.CarritoPagina),
    canActivate: [authGuard],
    title: 'Carrito | DermaHous'
  },
  {
    path: 'mis-pedidos',
    loadComponent: () =>
      import('./pages/mis-pedidos/mis-pedidos')
        .then((m) => m.MisPedidosPagina),
    canActivate: [authGuard],
    title: 'Mis pedidos | DermaHous'
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin')
        .then((m) => m.Admin),
    canActivate: [
      authGuard,
      adminGuard
    ],
    title: 'Administración | DermaHous'
  },
  {
  path: 'pago-exitoso',
  loadComponent: () =>
    import('./pages/pago-exitoso/pago-exitoso')
      .then((m) => m.PagoExitoso),
  title: 'Pago exitoso | DermaHous'
},
  {
    path: '**',
    redirectTo: ''
  }
];
