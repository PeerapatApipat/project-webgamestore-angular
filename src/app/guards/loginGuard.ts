import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/user';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const user = authService.getUser();

    if (user?.role === 'admin') {
      router.navigate(['/admin']);
    } else if (user?.role === 'user') {
      router.navigate(['/home']);
    }

    return false;
  }

  return true;
};
