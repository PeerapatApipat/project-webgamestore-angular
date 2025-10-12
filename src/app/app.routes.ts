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
import { Newgame } from './pages/admin/newgame/newgame';
import { Editgame } from './pages/admin/editgame/editgame';
import { Managegame } from './pages/admin/managegame/managegame';
import { Searchgame } from './pages/user/searchgame/searchgame';
import { Store } from './pages/user/store/store';
import { Gamedetail } from './pages/user/gamedetail/gamedetail';
import { Wallet } from './pages/user/wallet/wallet';
import { Transactions } from './pages/user/transactions/transactions';
import { AdminTransactions } from './pages/admin/admin-transaction/admin-transaction';

export const routes: Routes = [
  { path: '', component: Login, pathMatch: 'full', canActivate: [loginGuard] },
  { path: 'register', component: Register },
    //user
  { path: 'home', component: Home, canActivate: [userGuard] },
  { path: 'login', component: Login /*canActivate: [loginGuard]*/ },
  { path: 'profile', component: Profile, canActivate: [userGuard] },
   { path: 'store', component: Store, canActivate: [userGuard] },
   { path: 'searchgame', component: Searchgame, canActivate: [userGuard] },
   { path: 'detailgame/:id', component: Gamedetail, canActivate: [userGuard] },
  { path: 'topup', component: Wallet, canActivate: [userGuard] },
  { path: 'transactions', component: Transactions, canActivate: [userGuard] },

  //admin
  { path: 'admin', component: Dashbord, canActivate: [adminGuard] },
  { path: 'newgame', component: Newgame, canActivate: [adminGuard] },
  { path: 'editgame/:id', component: Editgame, canActivate: [adminGuard] },
  { path: 'managegame', component: Managegame, canActivate: [adminGuard] },
  { path: 'profileadmin', component: Profileadmin, canActivate: [adminGuard] },
  { path: 'userhistory', component: AdminTransactions, canActivate: [adminGuard] },
];
