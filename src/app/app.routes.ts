import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'board',
    loadComponent: () => import('./pages/board/board.page').then((m) => m.BoardPage),
  },
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'listado',
    loadComponent: () => import('./pages/listado/listado.page').then( m => m.ListadoPage)
  },
];
