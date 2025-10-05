import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/user';

// Guard ทั่วไป - ตรวจสอบว่า login หรือยัง
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

// Admin Guard - ต้องเป็น admin เท่านั้น
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getUser();
  if (user?.role !== 'admin') {
    alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin เท่านั้น)');
    router.navigate(['/home']); // ถ้าไม่ใช่ admin ส่งกลับไปหน้า user
    return false;
  }

  return true;
};

// User Guard - ต้องเป็น user เท่านั้น
export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getUser();
  if (user?.role !== 'user') {
    alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (User เท่านั้น)');
    router.navigate(['/admin']); // ถ้าไม่ใช่ user ส่งกลับไปหน้า admin
    return false;
  }

  return true;
};
