import {Component, inject} from '@angular/core';
import {MqttHackService} from '../services/mqtt/mqtt.service';

@Component({
  selector: 'app-plattegrond',
  imports: [],
  templateUrl: './plattegrond.component.html',
  styleUrl: './plattegrond.component.css',
})
export class PlattegrondComponent {
  mqttHackService: MqttHackService = inject(MqttHackService);
  public plattegrond = this.mqttHackService.roomAvailability;
}
