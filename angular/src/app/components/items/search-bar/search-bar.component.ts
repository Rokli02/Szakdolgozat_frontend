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
  @Output() searchValue = new EventEmitter<string>();
  @Output() selectedValue = new EventEmitter<any>();
  inputValue = new FormControl('');
  private clockId!: NodeJS.Timeout;
  constructor() {
    this.options = [];
  }

  ngOnInit(): void {
  }

  setAutocompleteValue = (event: any) => {
    this.selectedValue.emit(event.option.value);
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
