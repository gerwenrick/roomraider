import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./mqtt/mqtt.component').then((m) => m.MqttComponent),
  },
];
