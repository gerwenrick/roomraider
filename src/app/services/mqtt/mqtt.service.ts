import { inject, Injectable } from '@angular/core';
import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttService as NgxMqttService,
} from 'ngx-mqtt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IClientSubscribeOptions } from 'mqtt-browser';
import { Subject, Subscription } from 'rxjs';

export const connection: IMqttServiceOptions = {
  hostname: '10.50.0.181',
  port: 9001,
  path: '/',
  clean: true,
  connectTimeout: 2000,
  reconnectPeriod: 2000,
  clientId: 'custom_roomraiders',
  // username: '',
  // password: '',
  protocol: 'ws',
  connectOnCreate: true,
};

@Injectable({
  providedIn: 'root',
})
export class MqttHackService {
  private readonly _mqttService: NgxMqttService = inject(NgxMqttService);
  private readonly _snackBar: MatSnackBar = inject(MatSnackBar);

  private curSubscription: Subscription | undefined;
  private readonly client: NgxMqttService | undefined = this._mqttService;
  public isConnection = false;
  public subscribeSuccess = false;
  public roomAvailability: {room:string, availability:boolean}[] = [
    {
      room: 'lovelace',
      availability: false
    }
  ]

  public subscription = {
    topic: 'europalaan/lovelace',
    qos: 0,
  };

  public qosList = [{ label: 0, value: 0 }];

  get connection(): IMqttServiceOptions {
    return this.client as IMqttServiceOptions;
  }

  createConnection(): void {
    const connectionSubject = new Subject<boolean>();
    const messageSubject = new Subject<{ topic: string; payload: string }>();

    try {
      this.client?.connect(connection);
    } catch (error) {
      console.log('mqtt.connect error', error);
    }

    this.client?.onConnect.subscribe(() => {
      this.isConnection = true;
      connectionSubject.next(true);
      console.log('Connection succeeded!');
    });

    this.client?.onError.subscribe((error: any) => {
      this.isConnection = false;
      connectionSubject.next(false);
      console.log('Connection failed', error);
    });

    this.client?.onMessage.subscribe((packet: any) => {
      const message = {
        topic: packet.topic,
        payload: packet.payload.toString(),
      };
      messageSubject.next(message);

      // @ts-ignore
      this.roomAvailability.find(entry => entry.room == message.topic.split('/')[1]).availability = message.payload.toString() == 'FREE'

      console.log(
        `Received message ${message.payload} from topic ${message.topic}`
      );
    });

    connectionSubject.asObservable().subscribe((isConnected) => {
      console.log(
        `Connection status: ${isConnected ? 'Connected' : 'Disconnected'}`
      );
    });

    messageSubject.asObservable().subscribe((message) => {
      console.log(`New message on topic ${message.topic}: ${message.payload}`);
    });
  }

  doSubscribe(): void {
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

  destroyConnection(): void {
    try {
      this.client?.disconnect(true);
      this.isConnection = false;
      console.log('Successfully disconnected!');
    } catch (error: any) {
      console.log('Disconnect failed', error.toString());
    }
  }
}
