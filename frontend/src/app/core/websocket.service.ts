import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { ActivityDto } from '../model/restObject';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private client: Client;

  private readonly _activities$ = new Subject<ActivityDto>();
  private readonly _acceptEntries$ = new Subject<ActivityDto>();

  readonly activities$ = this._activities$.asObservable();
  readonly acceptEntries$ = this._acceptEntries$.asObservable();

  constructor() {
    const base = (environment.production ? window.location.origin : environment.api) + environment.apiPrefix;
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${base}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        this.client.subscribe('/topic/activities', (msg: IMessage) =>
          this._activities$.next(JSON.parse(msg.body))
        );
        this.client.subscribe('/topic/acceptentries', (msg: IMessage) =>
          this._acceptEntries$.next(JSON.parse(msg.body))
        );
      }
    });
  }

  connect(): void {
    this.client.activate();
  }

  disconnect(): void {
    this.client.deactivate();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
