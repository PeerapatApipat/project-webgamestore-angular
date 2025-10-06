import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { adminGuard } from './guards/authRoleAdmin';
import { Dashbord } from './pages/admin/dashbord/dashbord';
import { loginGuard } from './guards/loginGuard';

import { Home } from './pages/user/home/home';
import { userGuard } from './guards/authRoleAdmin';
import { Profileadmin } from './pages/admin/profileadmin/profileadmin';
import { Profile } from './pages/user/profile/profile';
export const routes: Routes = [
  { path: '', component: Login, pathMatch: 'full', canActivate: [loginGuard] },
  { path: 'home', component: Home, canActivate: [userGuard] },
  { path: 'login', component: Login /*canActivate: [loginGuard]*/ },
  { path: 'profile', component: Profile, canActivate: [userGuard] },
  { path: 'register', component: Register },

  //admin
  { path: 'admin', component: Dashbord, canActivate: [adminGuard] },
  { path: 'profileadmin', component: Profileadmin, canActivate: [adminGuard] },
];
