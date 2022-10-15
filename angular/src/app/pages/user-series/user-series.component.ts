import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropdownItem, ErrorMessage, UserSeriesPageOptions, UserSeriesPageOptionsKeys } from 'src/app/models/menu.model';
import { UserSeries } from 'src/app/models/series.model';
import { UserSeriesService } from 'src/app/services/user-series.service';

@Component({
  selector: 'app-user-series',
  templateUrl: './user-series.component.html',
  styleUrls: ['./user-series.component.css']
})
export class UserSeriesComponent implements OnInit {
  userserieses: UserSeries[];
  count: number;
  opts: UserSeriesPageOptions;
  constructor(private userSeriesService: UserSeriesService,
              private snackbar: MatSnackBar) {
    this.userserieses = [];
    this.count = -1;
    this.opts = {
      page: 1,
      size: 10,
      direction: true
    }
  }

  ngOnInit(): void {
    this.getUserSerieses(25);
  }

  getUserSerieses = async (initSize?: number) => {
    try {
      const response = await this.userSeriesService.getUserSerieses(this.opts.page, initSize ? initSize : this.opts.size, this.opts.status, this.opts.filter, this.opts.order, this.opts.direction);
      this.userserieses = response.userserieses ?? [];
      this.count = response.count;
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  pushUserSerieses = async () => {
    try {
      const response = await this.userSeriesService.getUserSerieses(this.opts.page, this.opts.size, this.opts.status, this.opts.filter, this.opts.order, this.opts.direction);
      this.userserieses.push(...response.userserieses);
      this.count = response.count;

    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  setOption = (name: UserSeriesPageOptionsKeys, value: string | number | boolean) => {
    this.opts[name] = value as never;
    this.getUserSerieses(25);
  }

  getOrderOptions = (): DropdownItem[] => {
    return this.userSeriesService.getOrders();
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if(this.userserieses.length !== this.count) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight - 100;

      if(pos >= max)   {
        this.opts["page"] += 1;
        this.pushUserSerieses();
      }
    }
  }
}
