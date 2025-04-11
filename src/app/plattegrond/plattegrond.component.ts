import {Component, inject} from '@angular/core';
import {MqttHackService} from '../services/mqtt/mqtt.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-plattegrond',
  imports: [JsonPipe],
  templateUrl: './plattegrond.component.html',
  styleUrl: './plattegrond.component.css',
})
export class PlattegrondComponent {
  mqttHackService: MqttHackService = inject(MqttHackService);
  public data = this.mqttHackService.roomAvailability
}
