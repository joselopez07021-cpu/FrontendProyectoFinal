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
    title: 'Inicio | GlowSkin'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then((m) => m.Login),
    title: 'Iniciar sesión | GlowSkin'
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/register/register')
        .then((m) => m.Register),
    title: 'Registro | GlowSkin'
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/products/products')
        .then((m) => m.Products),
    title: 'Productos | GlowSkin'
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/cart/cart')
        .then((m) => m.Cart),
    canActivate: [authGuard],
    title: 'Carrito | GlowSkin'
  },
  {
    path: 'mis-pedidos',
    loadComponent: () =>
      import('./pages/my-orders/my-orders')
        .then((m) => m.MyOrders),
    canActivate: [authGuard],
    title: 'Mis pedidos | GlowSkin'
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
    title: 'Administración | GlowSkin'
  },
  {
    path: '**',
    redirectTo: ''
  }
];