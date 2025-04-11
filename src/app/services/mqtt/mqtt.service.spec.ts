import { TestBed } from '@angular/core/testing';

import { MqttHackService } from './mqtt.service';

describe('MqttService', () => {
  let service: MqttHackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttHackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
