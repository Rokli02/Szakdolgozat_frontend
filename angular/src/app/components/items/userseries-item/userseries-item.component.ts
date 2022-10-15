import { Component, Input, OnInit } from '@angular/core';
import { UserSeries } from 'src/app/models/series.model';

@Component({
  selector: 'app-userseries-item',
  templateUrl: './userseries-item.component.html',
  styleUrls: ['./userseries-item.component.css']
})
export class UserseriesItemComponent implements OnInit {
  @Input() userseries!: UserSeries;
  constructor() { }

  ngOnInit(): void {
  }

  getCategories = (): string => {
    if(!this.userseries.series.categories) {
      return "";
    }
    return this.userseries.series.categories.map((category) => category.name).join(', ');
  }

  getLimitColor = (): string => {
    if(!this.userseries.series || this.userseries.series.ageLimit >= 18) {
      return 'var(--red)';
    }

    if(this.userseries.series.ageLimit >= 16) {
      return '#F19F24'
    }

    if(this.userseries.series.ageLimit >= 12) {
      return '#FCFF5A'
    }

    return '#51D911'
  }
}
