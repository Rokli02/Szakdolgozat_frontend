import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropdownItem } from 'src/app/models/menu.model';

@Component({
  selector: 'app-drop-down-bar',
  templateUrl: './drop-down-bar.component.html',
  styleUrls: ['./drop-down-bar.component.css']
})
export class DropDownBarComponent implements OnInit, OnChanges {
  open: boolean;
  @Input() header: string;
  @Input() width: string;
  @Input() changeHeader: boolean;
  @Input() options: DropdownItem[];
  @Input() action: boolean;
  @Output() selected = new EventEmitter<any>();
  selectedValue!: string | number;

  constructor() {
    this.open = false;
    this.action = false;
    this.width = '280px';
    this.changeHeader = true;
    this.options = [];
    this.header = "Unknown";
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['header'] && this.changeHeader) {
      this.selectedValue = changes['header'].currentValue;
    }
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
    if(this.changeHeader) {
      if(!selectedValue.value) {
        this.selectedValue = this.header;
      } else {
        this.selectedValue = selectedValue.shownValue;
      }
    }
    this.selected.emit(selectedValue.value);
  }

  getIcon = (): string => {
    return this.open ? "expand_less" : "expand_more";
  }
}
