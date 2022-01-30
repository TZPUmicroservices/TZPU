import { JsonPipe, Time } from '@angular/common';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { SchElement } from 'src/Models/SchElement';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'asd';
  startTime: Date = new Date(2022, 1, 5, 7, 15, 0);
  casovi: SchElement[] = [];
  constructor(private socket: Socket) {}

  ngOnInit() {
    // this.socket.emit('connection', "");
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
        });
      this.socket
        .fromEvent('U' + channel)
        .pipe(map((data) => JSON.parse(data as string)))
        .subscribe((data) => {
          let bio: boolean = false;
          this.rstTime();
          this.casovi.forEach((c) => {
            if (c.name == data.name) this.incTime(data.time);
            c.t1 = this.getTime();
            c.t2 = this.incTime(c.trajanje);
            this.incTime(15);
            //   this.casovi.push({name:e.ime,t1:this.getTime(),t2:this.incTime(e.trajanje),classrooms:e.ucionice, trajanje:e.trajanje})
          });
        });
      this.socket.emit('login', channel);
    }
  }

  SelectDay(day: string) {
    this.socket.emit('selectDay', day);
  }

  getTime() {
    return '' + this.startTime.getHours() + ':' + this.startTime.getMinutes();
  }
  incTime(num: number) {
    this.startTime.setMinutes(this.startTime.getMinutes() + num);
    return '' + this.startTime.getHours() + ':' + this.startTime.getMinutes();
  }
  rstTime() {
    this.startTime.setHours(7);
    this.startTime.setMinutes(15);
    this.startTime.setSeconds(0);
  }

  parseSchedule(
    data: { ime: string; trajanje: number; ucionice: []; brstudenata: number }[]
  ) {
    this.rstTime();
    if (data.length > 0) {
      this.casovi = [];
      data.forEach((e) => {
        this.casovi.push({
          name: e.ime,
          t1: this.getTime(),
          t2: this.incTime(e.trajanje),
          classrooms: e.ucionice,
          trajanje: e.trajanje,
        });
        this.incTime(15);
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
    let h = document.createElement('h1');
    h.innerHTML = schelement.t1;
    cas.appendChild(h);
    h = document.createElement('h1');
    h.innerHTML = schelement.name;
    cas.appendChild(h);
    h = document.createElement('h1');
    h.innerHTML = schelement.t2;
    cas.appendChild(h);

    const cr = document.createElement('div');
    cas.appendChild(cr);

    schelement.classrooms.forEach((e) => {
      h = document.createElement('h3');
      h.innerHTML = e;
      cr.appendChild(h);
    });

    host.appendChild(cas);
  }
}
