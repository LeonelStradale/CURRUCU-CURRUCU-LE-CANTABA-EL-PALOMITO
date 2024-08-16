import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'servicios/create',
    loadChildren: () =>
      import('./pages/servicios/create/create.module').then(
        (m) => m.CreatePageModule
      ),
  },
  {
    path: 'servicios',
    loadChildren: () =>
      import('./pages/servicios/index/index.module').then(
        (m) => m.IndexPageModule
      ),
  },
  {
    path: 'servicios/show',
    loadChildren: () =>
      import('./pages/servicios/show/show.module').then(
        (m) => m.ShowPageModule
      ),
  },
  {
    path: 'users/show',
    loadChildren: () =>
      import('./pages/users/show/show.module').then((m) => m.ShowPageModule),
  },
  {
    path: 'reservaciones',
    loadChildren: () =>
      import('./pages/reservaciones/index/index.module').then(
        (m) => m.IndexPageModule
      ),
  },
  {
    path: 'reservaciones/create',
    loadChildren: () =>
      import('./pages/reservaciones/create/create.module').then(
        (m) => m.CreatePageModule
      ),
  },
  {
    path: 'reservaciones/show',
    loadChildren: () =>
      import('./pages/reservaciones/show/show.module').then(
        (m) => m.ShowPageModule
      ),
  },
  {
    path: 'horarios',
    loadChildren: () =>
      import('./pages/horarios/index/index.module').then(
        (m) => m.IndexPageModule
      ),
  },
  {
    path: 'horarios/create',
    loadChildren: () =>
      import('./pages/horarios/create/create.module').then(
        (m) => m.CreatePageModule
      ),
  },
  {
    path: 'horarios/show',
    loadChildren: () =>
      import('./pages/horarios/show/show.module').then((m) => m.ShowPageModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/index/index.module').then((m) => m.IndexPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
