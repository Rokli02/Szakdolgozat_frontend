import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DropdownItem } from 'src/app/models/menu.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() options: DropdownItem[];
  @Input() header: string;
  @Input() width: string;
  @Output() searchValue = new EventEmitter<string>();
  @Output() selectedValue = new EventEmitter<any>();
  inputValue = new FormControl('');
  private clockId!: NodeJS.Timeout;
  constructor() {
    this.options = [];
    this.header = "Keresőmező"
    this.width = '350px'
  }

  ngOnInit(): void {
  }

  setAutocompleteValue = (event: any) => {
    this.selectedValue.emit(event.option.value);
    this.options = [];
    this.inputValue.setValue("");
  }

  startTimer = () => {
    if(this.clockId) {
      clearTimeout(this.clockId);
    }
    this.clockId = setTimeout(() => {
      this.searchValue.emit(this.inputValue.value);
      clearTimeout(this.clockId);
    }, 620);
  }
}
