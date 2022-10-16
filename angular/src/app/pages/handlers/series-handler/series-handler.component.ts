import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Series } from 'src/app/models/series.model';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series-handler',
  templateUrl: './series-handler.component.html',
  styleUrls: ['./series-handler.component.css']
})
export class SeriesHandlerComponent implements OnInit {
  seriesId?: number;
  private selectedSeries?: Series;
  constructor(private seriesService: SeriesService,
              private router: Router) {
    this.seriesId = 20;
  }

  ngOnInit(): void {
  }

  captureValue = (value: string) => {
    console.log(value);
  }

  routeTo = (type: string) => {

    switch (type) {
      case "new":
        this.router.navigateByUrl("/admin/series", { replaceUrl: true });
        return;
      case "change":
        if(!this.seriesId) {
          return;
        }
        this.router.navigateByUrl(`/admin/series/${this.seriesId}`, { replaceUrl: true });
        return;
      default:
        return;
    }
  }
}
