import { inject, Injectable } from '@angular/core';
import {
  IMqttMessage,
  IMqttServiceOptions,
  MqttService as NgxMqttService,
} from 'ngx-mqtt';
import { IClientSubscribeOptions } from 'mqtt-browser';
import { Subject } from 'rxjs';

export const connection: IMqttServiceOptions = {
  hostname: '10.50.0.181',
  port: 9001,
  path: '/',
  clean: true,
  connectTimeout: 2000,
  reconnectPeriod: 2000,
  clientId: 'custom_roomraiders',
  protocol: 'ws',
  connectOnCreate: true,
};

@Injectable({
  providedIn: 'root',
})
export class MqttHackService {
  private readonly _mqttService: NgxMqttService = inject(NgxMqttService);
  private readonly client: NgxMqttService | undefined = this._mqttService;
  public isConnection = false;
  public roomAvailability: Record<string, boolean> = {
    'lovelace': true,
    'hamilton': false
  };

  public subscriptions = [{
    topic: 'europalaan/lovelace',
    qos: 1,
  },{
    topic: 'europalaan/engelbart',
    qos: 1,
  },{
    topic: 'europalaan/shannon',
    qos: 1,
  },{
    topic: 'europalaan/turing',
    qos: 1,
  },{
    topic: 'europalaan/conway',
    qos: 1,
  },{
    topic: 'europalaan/hopper',
    qos: 1,
  },{
    topic: 'europalaan/hamilton',
    qos: 1,
  },{
    topic: 'europalaan/torvalds',
    qos: 1,
  },{
    topic: 'europalaan/ritchie',
    qos: 1,
  },{
    topic: 'europalaan/stallman',
    qos: 1,
  },{
    topic: 'europalaan/cerfkahn',
    qos: 1,
  },{
    topic: 'europalaan/bernerslee',
    qos: 1,
  },{
    topic: 'europalaan/hinton',
    qos: 1,
  }];

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
      const roomUpdate = {
        topic: packet.topic,
        payload: packet.payload.toString(),
      };
      messageSubject.next(roomUpdate);

      // @ts-ignore
      this.roomAvailability[roomUpdate.topic.split('/')[1]] = roomUpdate.payload === 'free';

      console.log(
        `Received message ${roomUpdate.payload} from topic ${roomUpdate.topic}`
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
    if (!this.client) {
      return;
    }
    this.subscriptions.forEach(({ topic, qos }) => {
      this.client
        ?.observe(topic, { qos } as IClientSubscribeOptions)
        .subscribe((message: IMqttMessage) => {
          console.log(message);
        });
    }
  )

  }
}
