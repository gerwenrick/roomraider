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
  port: 1883,
  path: '/',
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 4000,
  clientId: 'custom_roomraiders',
  // username: '',
  // password: '',
  protocol: 'mqtt' as any,
  connectOnCreate: false,
};

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MqttModule.forRoot(connection)),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
