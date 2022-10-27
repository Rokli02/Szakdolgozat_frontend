import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { Series } from 'src/app/models/series.model';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { UserSeriesService } from 'src/app/services/user-series.service';

@Component({
  selector: 'app-series-item',
  templateUrl: './series-item.component.html',
  styleUrls: ['./series-item.component.css']
})
export class SeriesItemComponent implements OnInit, OnChanges {
  @Input() series!: Series;
  canEdit: boolean;
  canAdd: boolean;
  imageUrl: string;
  options: DropdownItem[];
  offset: { x: string, y: string };
  constructor(private router: Router,
              private snackbar: MatSnackBar,
              private authService: AuthService,
              private userSeriesService: UserSeriesService,
              public imageService: ImageService,) {
    this.canEdit = false;
    this.canAdd = false;
    this.imageUrl = "";
    this.offset = { x: '25px', y: '-10px'};
    this.options = [];
  }

  async ngOnInit() {
    this.canEdit = this.authService.hasRight(["siteManager", "admin"]);
    this.canAdd = this.authService.hasRight(["user"]);
    if(this.series.image) {
      this.imageUrl = await this.imageService.getImageUrl(this.series.image?.name);
      this.offset = {
        x: this.series.image.x_offset as string,
        y: this.series.image.y_offset as string
      };
    } else {
      this.imageUrl = this.imageService.getDefaultImageUrl();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["series"]) {
      this.getOptions();
    }
  }

  getOptions = () => {
    if(!this.series || !this.series.seasons) {
      this.options = [];
    }

    for(const season of this.series.seasons.sort((a, b) => a.season - b.season)) {
      this.options.push({
        shownValue: `${season.season}.évad, ${season.episode} rész`,
        value: season.id
      });
    }
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

  editSeries = () => {
    this.router.navigateByUrl(`/admin/series/${this.series.id}`);
  }

  addSeries = async () => {
    try {
      if(this.series.id) {
        const response = await this.userSeriesService.defaultSaveUserSeries(this.series.id);
        if(response) {
          this.snackbar.open("Sorozat sikeresen felvéve!", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      }
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }
}
