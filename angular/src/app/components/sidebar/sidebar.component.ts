import { Component, Input, OnInit } from '@angular/core';
import { SidebarItem } from 'src/app/models/menu.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  closed: boolean;
  @Input() items: SidebarItem[];
  constructor() {
    this.closed = true;
    this.items = [];
  }

  ngOnInit(): void {
  }

  toggle = () => {
    this.closed = !this.closed;
  }
}
