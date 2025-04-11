import { Component } from '@angular/core';
import { MqttComponent } from './mqtt/mqtt.component';

@Component({
  selector: 'app-root',
  imports: [MqttComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'roomrAIder';
}
