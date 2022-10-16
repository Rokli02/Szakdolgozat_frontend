import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { Season, Status, UserSeries } from 'src/app/models/series.model';
import { StatusService } from 'src/app/services/status.service';
import { UserSeriesService } from 'src/app/services/user-series.service';

@Component({
  selector: 'app-userseries-handler',
  templateUrl: './userseries-handler.component.html',
  styleUrls: ['./userseries-handler.component.css']
})
export class UserseriesHandlerComponent implements OnInit {
  seriesId?: number;
  selectedUserSeries?: UserSeries;
  seriesOptions: DropdownItem[];
  statusOptions: DropdownItem[];
  private selectedSeason?: Season;
  private selectedEpisode?: number;
  private selectedStatusId?: number;
  constructor(private userSeriesService: UserSeriesService,
              private statusService: StatusService,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute) {
    this.seriesOptions = [];
    this.statusOptions = [];
  }

  async ngOnInit() {
    const tempId = this.route.snapshot.paramMap.get("id");
    if(tempId) {
      this.seriesId = Number(tempId);
      this.selectedUserSeries = await this.userSeriesService.getUserSeries(this.seriesId);
      this.resetSelectedDatas()
    }
    this.getStatusOptions();
  }

  submit = () => {
    let updateUserSeries: UserSeries = {} as UserSeries;
    if(this.selectedSeason) {
      updateUserSeries.season = this.selectedSeason?.season;
    }

    if(this.selectedEpisode) {
      updateUserSeries.episode = this.selectedEpisode;
    }

    if(this.selectedStatusId) {
      updateUserSeries.status = { id: this.selectedStatusId } as Status;
    }

    console.log(updateUserSeries);
  }

  getSeasonHeader = () => {
    return `${this.selectedUserSeries?.season}. évad`;
  }

  getEpisodeHeader = () => {
    return `${this.selectedUserSeries?.episode}. epizód`;
  }

  getCategories = (): string => {
    if(this.selectedUserSeries) {
      return this.selectedUserSeries.series.categories.map((category) => category.name).join(", ") as string;
    }
    return "";
  }

  autocompleteValue = async (value: any) => {
    this.seriesId = value;
    if(this.seriesId) {
      this.selectedUserSeries = await this.userSeriesService.getUserSeries(this.seriesId);
      if(this.selectedUserSeries && this.selectedUserSeries.series.seasons && this.selectedUserSeries.series.seasons.length > 0) {
        this.selectedSeason = this.selectedUserSeries.series.seasons[0];
      }
    }
  }

  captureValue = async (value: string) => {
    try {
      const response = await this.userSeriesService.getUserSerieses(1, 10, undefined, value);
      this.seriesOptions = response.serieses
      ? response.serieses
        .map((userseries) => ({
          value: userseries.series.id,
          shownValue: `${userseries.series.id}. ${userseries.series.title}, ${userseries.series.prodYear}`
        }) as DropdownItem)
      : [];
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  seriesDoesntHaveSeasons = () => {
    return !this.selectedUserSeries?.series.seasons || this?.selectedUserSeries.series.seasons.length < 1;
  }

  getSeasonOptions = () => {
    if(this.selectedUserSeries) {
      if(this.seriesDoesntHaveSeasons()) {
        return [];
      }

      const options: DropdownItem[] = [];
      options.push(...this.selectedUserSeries.series.seasons?.map((season) => ({ value: season, shownValue: `${season.season}. évad` }) as unknown as DropdownItem));
      return this.seriesOptions;
    }

    return [];
  }

  setSeasonOption = (season: Season) => {
    this.selectedSeason = season;
  }

  getEpisodeOptions = () => {
    if(this.selectedUserSeries && this.selectedSeason && !this.seriesDoesntHaveSeasons()) {
      const options: DropdownItem[] = [];
      for (let index = 1; index < this.selectedSeason.episode; index++) {
        options.push({ value: index, shownValue: `${index}. epizód` });
      }
      return this.seriesOptions;
    }

    return [];
  }

  setEpisodeOption = (episode: number) => {
    this.selectedEpisode = episode;
  }

  getStatusOptions = async () => {
    this.statusOptions = (await this.statusService.getStatuses()).map((status) => ({ value: status.id, shownValue: status.name }));
  }

  setStatusOption = (statusId: number) => {
    this.selectedStatusId = statusId;
  }

  resetSelectedDatas = () => {
    if(this.selectedUserSeries && this.selectedUserSeries.series.seasons && this.selectedUserSeries.series.seasons.length > 0) {
      this.selectedSeason = this.selectedUserSeries.series.seasons.find((season) => season.season === this.selectedUserSeries?.season);
    }

    this.selectedEpisode = undefined;
    this.selectedStatusId = undefined;
  }
}
