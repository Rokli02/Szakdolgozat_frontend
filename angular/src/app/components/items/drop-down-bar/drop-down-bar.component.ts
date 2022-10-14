import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownItem } from 'src/app/models/menu.model';

@Component({
  selector: 'app-drop-down-bar',
  templateUrl: './drop-down-bar.component.html',
  styleUrls: ['./drop-down-bar.component.css']
})
export class DropDownBarComponent implements OnInit {
  open: boolean;
  @Input() header: string;
  @Input() options: DropdownItem[];
  @Input() action: boolean;
  @Output() selected = new EventEmitter<any>();
  selectedValue!: string | number;

  constructor() {
    this.open = false;
    this.action = false;
    this.options = [];
    this.header = "Unknown";
  }

  ngOnInit(): void {
    this.selectedValue = this.header;
  }

  toggle = ():void => {
    this.open = !this.open;
  }

  close = (): void => {
    this.open = false;
  }

  onClick = (selectedValue: DropdownItem) => {
    if(!this.action) {
      return;
    }
    if(!selectedValue.value) {
      this.selectedValue = this.header;
    } else {
      this.selectedValue = selectedValue.shownValue;
    }
    this.selected.emit(selectedValue.value);
  }

  getIcon = (): string => {
    return this.open ? "expand_less" : "expand_more";
  }
}
