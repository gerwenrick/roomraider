import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';

export const connection: IMqttServiceOptions = {
  hostname: '10.50.0.181',
  port: 9001,
  path: '/',
  clean: true,
  connectTimeout: 1000,
  reconnectPeriod: 1000,
  clientId: 'custom_roomraiders',
  // username: '',
  // password: '',
  protocol: 'ws',
  connectOnCreate: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MqttModule.forRoot(connection)),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
