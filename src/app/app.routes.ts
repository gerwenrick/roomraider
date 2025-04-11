import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  {
    path: 'plattegrond',
    loadComponent: () =>
      import('./plattegrond/plattegrond.component').then(
        (m) => m.PlattegrondComponent
      ),
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./mqtt/mqtt.component').then((m) => m.MqttComponent),
  },
];
