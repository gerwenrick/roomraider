import { Component } from '@angular/core';
import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttService,
  IPublishOptions,
} from 'ngx-mqtt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IClientSubscribeOptions } from 'mqtt-browser';
import { Subscription } from 'rxjs';

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
import { connection } from '../app.config';
import { CommonModule } from '@angular/common';

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
  constructor(
    private readonly _mqttService: MqttService,
    private readonly _snackBar: MatSnackBar
  ) {
    this.client = this._mqttService;

    this.createConnection();
    this.doSubscribe();
  }

  private curSubscription: Subscription | undefined;

  connection = connection;

  subscription = {
    topic: 'hello/topic',
    qos: 0,
  };
  publish = {
    topic: 'hello/topic',
    qos: 0,
    payload: '{ "msg": "Hello, I am browser." }',
  };
  receiveNews = '';
  qosList = [
    { label: 0, value: 0 },
    // { label: 1, value: 1 },
    // { label: 2, value: 2 },
  ];
  client: MqttService | undefined;
  isConnection = false;
  subscribeSuccess = false;

  createConnection() {
    // Connection string, specifying the connection method through the protocol
    // ws Unencrypted WebSocket connection
    // wss Encrypted WebSocket connection
    // mqtt Unencrypted TCP connection
    // mqtts Encrypted TCP connection
    // wxs WeChat Mini Program connection
    // alis Alipay Mini Program connection
    try {
      this.client?.connect(this.connection as IMqttServiceOptions);
    } catch (error) {
      console.log('mqtt.connect error', error);
    }
    this.client?.onConnect.subscribe(() => {
      this.isConnection = true;
      console.log('Connection succeeded!');
    });
    this.client?.onError.subscribe((error: any) => {
      this.isConnection = false;
      console.log('Connection failed', error);
    });
    this.client?.onMessage.subscribe((packet: any) => {
      this.receiveNews = this.receiveNews.concat(
        [packet.payload.toString(), '\n'].join()
      );
      console.log(
        `Received message ${packet.payload.toString()} from topic ${
          packet.topic
        }`
      );
    });
  }

  doSubscribe() {
    const { topic, qos } = this.subscription;
    if (!this.client) {
      this._snackBar.open('There is no mqtt client available...', 'close');
      return;
    }
    this.curSubscription = this.client
      .observe(topic, { qos } as IClientSubscribeOptions)
      .subscribe((message: IMqttMessage) => {
        this.subscribeSuccess = true;
        const msg = ['Received message: ', message.payload.toString()].join(
          ' '
        );
        this._snackBar.open(msg, 'close');
        console.log(message);
      });
  }

  // Unsubscribe
  doUnSubscribe() {
    this.curSubscription?.unsubscribe();
    this.subscribeSuccess = false;
  }

  // Send message
  doPublish() {
    const { topic, qos, payload } = this.publish;
    console.log(this.publish);
    this.client?.unsafePublish(topic, payload, { qos } as IPublishOptions);
  }

  destroyConnection() {
    try {
      this.client?.disconnect(true);
      this.isConnection = false;
      console.log('Successfully disconnected!');
    } catch (error: any) {
      console.log('Disconnect failed', error.toString());
    }
  }
}
