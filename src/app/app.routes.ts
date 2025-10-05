import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { adminGuard } from './guards/authRoleAdmin';
import { Dashbord } from './pages/admin/dashbord/dashbord';

import { Home } from './pages/user/home/home';
import { userGuard } from './guards/authRoleUser';
import { Profile } from './pages/user/profile/profile';
import { Profileadmin } from './pages/admin/profileadmin/profileadmin';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'home', component: Home, canActivate: [userGuard] },
  { path: 'profile', component: Profile, canActivate: [userGuard] },

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  //admin
  { path: 'admin', component: Dashbord, canActivate: [adminGuard] },
  { path: 'profileadmin', component: Profileadmin, canActivate: [adminGuard] },

  //   {
  //  path: 'home',
  //     loadChildren: () => import('./pages/user/home/home').then((c) => c.Home),
  //   },
];
