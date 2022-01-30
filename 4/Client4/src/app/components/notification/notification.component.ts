import { Component, Input, OnInit } from '@angular/core';
import { NotificationI } from 'src/Models/Notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  @Input() data: NotificationI | null = { text: 'Nema text', important: true };
  constructor() {}

  ngOnInit(): void {}

  hide(event: Event) {
    const el = event.target as HTMLInputElement;
    if (el.parentElement) el.parentElement.style.opacity = '0';
    setTimeout(this.destroyNotification, 1000, el.parentElement);
  }

  destroyNotification(el: HTMLElement) {
    el.style.display = 'None';
  }
}
