import { JsonPipe, Time } from '@angular/common';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { asapScheduler, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { SchElement } from 'src/Models/SchElement';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from './services/signal-r.service';
import { NotificationI } from 'src/Models/Notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'asd';
  allowClick: boolean = true;
  nowTime: string = '00:00';
  startTime: Date = new Date(2022, 1, 5, 7, 15, 0);
  startTimeHour: number = 7;
  StartTimeMinutes: number = 0;
  Notifications: (NotificationI | null)[] = [
    /*{ text: 'safdsgf', important: false }*/null,
    null,
    null,
    null,
    null,
  ];
  casovi: SchElement[] = [
    /* {
      name: 'TZPU',
      t1: '7:15',
      t2: '8:00',
      trajanje: 45,
      odmor: '8:00-8:15',
      classrooms: ['Ucionica1', 'Ucionica2'],
    },
    {
      name: 'TZPU',
      t1: '7:15',
      t2: '8:00',
      trajanje: 45,
      odmor: null,
      classrooms: ['Ucionica1', 'Ucionica2'],
    },*/
  ];
  constructor(
    private socket: Socket,
    private http: HttpClient,
    public signalRService: SignalRService
  ) {}

  ngOnInit() {
    // this.socket.emit('connection', "");
    this.ReDrawSchedule();
    interval(2000).subscribe(() => {
      var today = new Date();
      this.nowTime = today.getHours() + ':' + today.getMinutes();
    });
    this.startHttpRequest();
  }
  ngOnDestroy() {
    this.socket.emit('disconnect', '');
  }

  login(event: Event) {
    const element = event.target as HTMLInputElement;
    element.parentElement?.classList.add('hide');
    document.querySelector('.days')?.classList.remove('hide');
    const channel = '' + element.parentElement?.querySelector('input')?.value;
    if (channel) {
      this.socket
        .fromEvent(channel)
        .pipe(map((data) => JSON.parse(data as string)))
        .subscribe((data) => {
          console.log(data.casovi);
          this.parseSchedule(data.casovi);
          this.ReDrawSchedule();
          document.querySelector('.loading')?.classList.add('hide');
          this.allowClick = true;
        });
      this.socket
        .fromEvent('U' + channel)
        .pipe(map((data) => JSON.parse(data as string)))
        .subscribe((data) => {
          console.log(data);

          this.rstTime();
          this.casovi.forEach((c, i) => {
            if (c.classrooms.indexOf(data.name) >= 0)
              console.log(this.getTime() + '  ' + this.incTime(data.time));

            c.t1 = this.getTime();
            c.t2 = this.incTime(c.trajanje);
            if (i < this.casovi.length - 1) {
              c.odmor = c.t2 + '-' + this.incTime(15);
            } else {
              c.odmor = null;
              this.incTime(15);
            }
            //   this.casovi.push({name:e.ime,t1:this.getTime(),t2:this.incTime(e.trajanje),classrooms:e.ucionice, trajanje:e.trajanje})
          });
          this.ReDrawSchedule();
        });

      this.signalRService.hubConnection.on('N' + channel, (data) => {
        console.log(data);
        this.DrawNotification(data as string, false);
      });
      this.signalRService.hubConnection.on('I' + channel, (data) => {
        console.log(data);
        this.DrawNotification(data as string, true);
      });

      this.socket.emit('login', channel);
    }
  }

  SelectDay(day: string) {
    if (this.allowClick) {
      this.socket.emit('selectDay', day);
      document.querySelector('.loading')?.classList.remove('hide');
      this.allowClick = false;
    }
  }

  getTime() {
    return (
      '' +
      this.startTimeHour +
      ':' +
      (this.StartTimeMinutes < 10 ? '0' : '') +
      this.StartTimeMinutes
    );
  }
  incTime(num: number) {
    num = Number(num);
    this.startTimeHour =
      Math.floor(
        this.startTimeHour + Math.floor((this.StartTimeMinutes + num) / 60)
      ) % 24;
    this.StartTimeMinutes = Math.floor((this.StartTimeMinutes + num) % 60);
    return (
      '' +
      this.startTimeHour +
      ':' +
      (this.StartTimeMinutes < 10 ? '0' : '') +
      this.StartTimeMinutes
    );
  }
  rstTime() {
    this.startTimeHour = 7;
    this.StartTimeMinutes = 15;
  }

  parseSchedule(
    data: { ime: string; trajanje: number; ucionice: []; brstudenata: number }[]
  ) {
    this.rstTime();
    if (data.length > 0) {
      this.casovi = [];
      data.forEach((e, i) => {
        const pom: SchElement = {
          name: e.ime,
          t1: this.getTime(),
          t2: this.incTime(e.trajanje),
          classrooms: e.ucionice,
          trajanje: e.trajanje,
          odmor: null,
        };
        if (i < data.length - 1) pom.odmor = pom.t2 + '-' + this.incTime(15);
        else this.incTime(15);
        this.casovi.push(pom);
      });
    }
    console.log(this.casovi);
  }

  ReDrawSchedule() {
    const box = document.querySelector('.schedule');
    if (box) {
      box.innerHTML = '';
      this.casovi.forEach((e) => this.DrawScheculeElement(box, e));
    }
  }

  DrawScheculeElement(host: Element, schelement: SchElement) {
    const cas = document.createElement('div');
    cas.classList.add('cas');
    const podaci = document.createElement('div');
    cas.classList.add('podaci');
    const ucionice = document.createElement('div');
    cas.classList.add('ucionice');

    let h = document.createElement('h1');
    h.innerHTML = schelement.name;
    podaci.appendChild(h);

    h = document.createElement('h1');
    h.innerHTML = schelement.t1 + '-' + schelement.t2;
    podaci.appendChild(h);

    h = document.createElement('h2');
    h.innerHTML = 'Ucionice:';
    ucionice.appendChild(h);
    h = document.createElement('hr');
    ucionice.appendChild(h);

    schelement.classrooms.forEach((e) => {
      h = document.createElement('h3');
      h.innerHTML = e;
      ucionice.appendChild(h);
    });
    cas.appendChild(podaci);
    cas.appendChild(ucionice);

    host.appendChild(cas);
    if (schelement.odmor) {
      const odmor = document.createElement('div');
      odmor.classList.add('odmor');
      h = document.createElement('h1');
      h.innerHTML = 'ODMOR!';
      odmor.appendChild(h);
      h = document.createElement('h1');
      h.innerHTML = schelement.odmor;
      odmor.appendChild(h);
      host.appendChild(odmor);
    }
  }

  DrawNotification(text: string, important: boolean) {
    const ind = this.Notifications.indexOf(null);
    this.Notifications[ind] = { text: text, important: important };
  }

  private startHttpRequest = () => {
    this.http
      .get('https://100.125.44.11:44344/api/Notification')
      .subscribe((res) => {
        console.log(res);
      });
  };
}
