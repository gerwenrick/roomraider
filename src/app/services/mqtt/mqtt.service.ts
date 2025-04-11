import { inject, Injectable } from '@angular/core';
import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttService as NgxMqttService,
  IPublishOptions,
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
  public receiveNews = '';

  public subscription = {
    topic: 'hello/topic',
    qos: 0,
  };

  public publish = {
    topic: 'hello/topic',
    qos: 0,
    payload: '{ "msg": "Hello, I am browser." }',
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
      this.receiveNews = this.receiveNews.concat(
        [message.payload, '\n'].join()
      );
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

  doUnSubscribe(): void {
    this.curSubscription?.unsubscribe();
    this.subscribeSuccess = false;
  }

  doPublish(): void {
    const { topic, qos, payload } = this.publish;
    console.log(this.publish);
    this.client?.unsafePublish(topic, payload, { qos } as IPublishOptions);
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
