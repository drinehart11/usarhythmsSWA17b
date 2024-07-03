import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';

export const authGuardGuard: CanMatchFn = (route, segments) => {
  const router = inject( Router);
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  if (storageService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']); //send user to login if not logged in
};
