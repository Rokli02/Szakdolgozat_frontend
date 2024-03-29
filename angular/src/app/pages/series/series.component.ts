import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropdownItem, ErrorMessage, PageOptions, PageOptionsKeys } from 'src/app/models/menu.model';
import { Series } from 'src/app/models/series.model';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  serieses: Series[];
  count: number;
  opts: PageOptions;
  orderOpts: DropdownItem[];
  constructor(private seriesService: SeriesService,
              private snackbar: MatSnackBar) {
    this.serieses = [];
    this.count = -1;
    this.opts = {
      page: 1,
      size: 12,
      direction: true
    };
    this.orderOpts = [];
  }

  async ngOnInit() {
    this.getSerieses();
    this.orderOpts = this.seriesService.getOrders();
  }

  setOption = (name: PageOptionsKeys, value: string | number | boolean) => {
    this.opts[name] = value as never;
    this.getSerieses();
  }

  getSerieses = async () => {
    this.opts["page"] = 1;
    try {
      const response = await this.seriesService.getSerieses(this.opts.page, this.opts.size, this.opts.filter, this.opts.order, this.opts.direction);
      this.serieses = response.serieses ?? [];
      this.count = response.count;

    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  pushSerieses = async () => {
    if(this.serieses.length === this.count) {
      return;
    }

    try {
      const response = await this.seriesService.getSerieses(this.opts.page, this.opts.size, this.opts.filter, this.opts.order, this.opts.direction);
      this.serieses.push(...response.serieses);
      this.count = response.count;

    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if(this.serieses.length !== this.count) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight - 100;

      if(pos >= max)   {
        this.opts["page"] += 1;
        this.pushSerieses();
      }
    }
  }

}
