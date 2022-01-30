import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  public hubConnection: signalR.HubConnection =
    new signalR.HubConnectionBuilder()
      .withUrl('https://100.125.44.11:44344/Notification')
      .build();

  constructor() {
    this.hubConnection.start().then(() => {
      console.log('Connection started ');
      // this.hubConnection.invoke("SendCoordinates").catch(err => console.log('greska : ' + err));
    });
  }
}
