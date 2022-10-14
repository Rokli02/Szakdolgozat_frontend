import { Component, Input, OnInit } from '@angular/core';
import { DropdownItem } from 'src/app/models/menu.model';
import { Series } from 'src/app/models/series.model';

@Component({
  selector: 'app-series-item',
  templateUrl: './series-item.component.html',
  styleUrls: ['./series-item.component.css']
})
export class SeriesItemComponent implements OnInit {
  @Input() series!: Series;

  constructor() {
  }

  ngOnInit(): void {
  }

  getOptions = (): DropdownItem[] => {
    const options: DropdownItem[] = [];
    if(!this.series || !this.series.seasons) {
      return [];
    }

    for(const season of this.series.seasons.sort((a, b) => a.season - b.season)) {
      options.push({
        shownValue: `${season.season}.évad, ${season.episode} rész`,
        value: season.id
      });
    }
    return options;
  }

  getCategories = (): string => {
    return this.series.categories.map((category) => category.name).join(', ');
  }

  getLimitColor = (): string => {
    if(!this.series || this.series.ageLimit >= 18) {
      return 'var(--red)';
    }

    if(this.series.ageLimit >= 16) {
      return '#F19F24'
    }

    if(this.series.ageLimit >= 12) {
      return '#FCFF5A'
    }

    return '#51D911'
  }
}
