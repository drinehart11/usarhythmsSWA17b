import { Routes } from '@angular/router';
import { LoginComponent} from "./login/login.component";
import { authGuardGuard } from './auth-guard.guard';

export const routes: Routes = [
  { path: '', //default route: //default route: https://{BASEURL}/login
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login',
    component: LoginComponent
  },
  { path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuardGuard] //pwd-protect this route
  },
  // Wildcard route [to avoid 404]
  { path: '**', redirectTo: '' } // Redirect to main page
];
