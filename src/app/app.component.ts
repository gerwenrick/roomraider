import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MqttHackService } from './services/mqtt/mqtt.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  mqttService: MqttHackService = inject(MqttHackService);

  connection: any;

  constructor() {
    this.connection = this.mqttService.connection;
    this.mqttService.createConnection();
    this.mqttService.doSubscribe();
  }
}
