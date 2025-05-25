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
];
