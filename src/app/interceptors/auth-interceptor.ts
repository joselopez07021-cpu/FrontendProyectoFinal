import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  const authService = inject(Auth);
  const token = authService.obtenerToken();

  if (!token) {
    return next(request);
  }

  const requestConToken = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(requestConToken);
};