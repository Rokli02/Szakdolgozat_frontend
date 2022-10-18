import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DropdownItem, ErrorMessage, PageOptions, PageOptionsKeys } from 'src/app/models/menu.model';
import { Newsfeed } from 'src/app/models/newsfeed.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  newsfeeds: Newsfeed[];
  count: number;
  opts: PageOptions;
  private isPersonal!: boolean;
  constructor(private newsfeedService: NewsfeedService,
              private snackbar: MatSnackBar,
              private route: Router) {
    this.newsfeeds = [];
    this.count = -1;
    this.opts = {
      page: 1,
      size: 10,
      direction: true
    };
  }

  ngOnInit(): void {
    if(this.route.url === "/user/newsfeed") {
      this.isPersonal = true;
    } else {
      this.isPersonal = false;
    }
    this.getNewsfeeds();
  }

  getNewsfeeds = async () => {
    this.opts["page"] = 1;
    try {
      const response = this.isPersonal
      ? await this.newsfeedService.getPersonalNewsfeeds(this.opts.page, this.opts.size, this.opts.filter, this.opts.order, this.opts.direction)
      : await this.newsfeedService.getNewsfeeds(this.opts.page, this.opts.size, this.opts.filter, this.opts.order, this.opts.direction);
      this.newsfeeds = response.newsfeeds ?? [];
      this.count = response.count;
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  pushNewsfeeds = async () => {
    if(this.newsfeeds.length === this.count) {
      return;
    }

    try {
      const response = this.isPersonal
      ? await this.newsfeedService.getPersonalNewsfeeds(this.opts.page, this.opts.size, this.opts.filter, this.opts.order, this.opts.direction)
      : await this.newsfeedService.getNewsfeeds(this.opts.page, this.opts.size, this.opts.filter, this.opts.order, this.opts.direction);
      this.newsfeeds.push(...response.newsfeeds);
      this.count = response.count;

    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  setOption = (name: PageOptionsKeys, value: string | number | boolean) => {
    this.opts[name] = value as never;
    this.getNewsfeeds();
  }

  getOrderOptions = (): DropdownItem[] => {
    return this.newsfeedService.getOrders();
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if(this.newsfeeds.length !== this.count) {
      let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
      let max = document.documentElement.scrollHeight - 100;

      if(pos >= max)   {
        this.opts["page"] += 1;
        this.pushNewsfeeds();
      }
    }
  }
}
