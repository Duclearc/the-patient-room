import { Injectable } from "@angular/core";
import {  Observable } from "rxjs";
import { WebSocketSubject } from "rxjs/webSocket";
import { Patient } from 'src/models/patient.model';
import { SocketData } from '../../models/socketData.model';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  public wsServerRequests = new Array<any>();
  private socket$: WebSocketSubject<SocketData>;
  public socketListener$: Observable<SocketData | Patient[] | string>;

  constructor() {

    this.socket$ = new WebSocketSubject<SocketData>({
      url: 'ws://localhost:4000',
      deserializer: (rawMessage) => JSON.parse(rawMessage.data),
    });
  }

  getSocket(): Observable<SocketData> {
    return this.socket$.asObservable();
  }
  public wsRequest(data: SocketData["data"], action: SocketData["type"]) {
    const wsData: SocketData = {
      data: data,
      type: action,
    };
    this.send(wsData);
  }

  private send(data: SocketData): void | Patient[] {
    this.wsServerRequests.push(data);
    this.socket$.next(data); // trigger to update patient in DB
  }
}
