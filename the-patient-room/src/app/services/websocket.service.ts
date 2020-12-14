import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { WebSocketSubject } from "rxjs/webSocket";
import { Patient } from 'src/models/patient.model';
import { SocketMessage, SocketRequest, SocketResponse } from '../../models/socketData.model';
import { PatientService } from './patient.service';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  public wsServerRequests = new Array<any>();

  // private socket$: WebSocketSubject<SocketRequest | Patient[] | string>;
  // private socket$: WebSocketSubject<MessageEvent<SocketMessage>>;
  private socket$: WebSocketSubject<SocketMessage>;
  public socketListener$: Observable<SocketRequest | Patient[] | string>; //<any>  <- same as here

  constructor() {

    this.socket$ = new WebSocketSubject<SocketMessage>({
    // this.socket$ = new WebSocketSubject<MessageEvent<SocketMessage>>({
      url: 'ws://localhost:4000',
      deserializer: (rawMessage) => JSON.parse(rawMessage.data),
    });
    // this.socketListener$ = this.socket$.asObservable();

    // this.socket$
    //   .subscribe(
    //     (wsData: string) => {
    //       console.log('🟡 Angular: received -> ', wsData)
    //       console.log(typeof wsData);

    //       const socketRES = JSON.parse(wsData) as Patient[];
    //       console.log(socketRES, 'sock RES');
    //       //  ?????????
    //       // HOW DO I PASS socketRES TO patients IN patient.service.ts
    //       //  ??????????

    //     },
    //     (err) => {
    //       console.error(err);
    //     },
    //     () => console.warn('Completed!')
    //   );
  }

  getSocket(): Observable<SocketMessage> {
    return this.socket$.asObservable();//.pipe(tap(wsData => console.log('message received:', wsData)));
  }

  public send(data: SocketMessage): void | Patient[] {
    this.wsServerRequests.push(data);
    this.socket$.next(data);
    console.log('SEND ACTIVATED. data -> ', data);
    // //❌//❌//❌//❌//❌
  }
}
