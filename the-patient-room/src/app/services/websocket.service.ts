import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WebSocketSubject } from "rxjs/webSocket";
import { Patient } from 'src/models/patient.model';
import { SocketData } from 'src/models/socketData.model';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  //? properties
  public wsServerRequests = new Array<any>();
  private socket$: WebSocketSubject<SocketData>;
  public socketListener$: Observable<SocketData | Patient[] | string>;

  constructor() {
    //? connects to WS at the specified URL
    this.socket$ = new WebSocketSubject<SocketData>({
      url: 'ws://localhost:4000',
      deserializer: (rawMessage) => JSON.parse(rawMessage.data),
    });
  }

  //? shares current WS connection
  getSocket(): Observable<SocketData> {
    return this.socket$.asObservable();
  };

  //? sends data to WS
  private send(data: SocketData): void {
    this.wsServerRequests.push(data);
    this.socket$.next(data); // trigger to update patient in DB
  };

  //? formats request data before sending to WS
  public wsRequest(data: SocketData["data"], action: SocketData["type"]): void {
    const wsData: SocketData = {
      data: data,
      type: action,
    };
    this.send(wsData);
  };
}
