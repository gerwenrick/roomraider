import { Component, inject } from '@angular/core';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MqttService } from 'ngx-mqtt';
import { MqttHackService } from '../services/mqtt/mqtt.service';

@Component({
  selector: 'app-mqtt',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './mqtt.component.html',
  styleUrl: './mqtt.component.css',
})
export class MqttComponent {
  mqttService: MqttHackService = inject(MqttHackService);

  connection = this.mqttService.connection;
  isConnection: boolean = this.mqttService.isConnection;
  subscription = this.mqttService.subscription;
  subscribeSuccess: boolean = this.mqttService.subscribeSuccess;
  publish = this.mqttService.publish;

  receiveNews = this.mqttService.receiveNews;

  qosList = this.mqttService.qosList;

  createConnection(): void {
    this.mqttService.createConnection();
  }

  doSubscribe(): void {
    this.mqttService.doSubscribe();
  }
  doPublish(): void {
    this.mqttService.doPublish();
  }

  doUnSubscribe(): void {
    this.mqttService.doUnSubscribe();
  }

  destroyConnection(): void {
    this.mqttService.destroyConnection();
  }
}
