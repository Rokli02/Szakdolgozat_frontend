import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/components/items/confirmation/confirmation.component';
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
  seriesOptions: DropdownItem[];
  statusOptions: DropdownItem[];
  seasonOptions: DropdownItem[];
  episodeOptions: DropdownItem[];
  selectedSeason?: Season;
  selectedEpisode?: number;
  selectedStatus?: Status;
  selectedUserSeries?: UserSeries;
  private statuses: Status[];
  constructor(private userSeriesService: UserSeriesService,
              private statusService: StatusService,
              private snackbar: MatSnackBar,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) {
    this.seriesOptions = [];
    this.statusOptions = [];
    this.seasonOptions = [];
    this.episodeOptions = [];
    this.statuses = [];
  }

  async ngOnInit() {
    const tempId = this.route.snapshot.paramMap.get("id");
    if(tempId) {
      this.seriesId = Number(tempId);
      try {
        this.statuses = await this.statusService.getStatuses();
        this.selectedUserSeries = await this.userSeriesService.getUserSeries(this.seriesId);
        if(!this.selectedUserSeries) {
          this.snackbar.open("Váratlan hiba, töltsd újra a módosítandó sorozatot!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
          this.router.navigateByUrl("user/handle/series", { replaceUrl: true });
          return;
        }

        this.setStatusOption(this.selectedUserSeries.status.id as number);
        const season: Season = this.selectedUserSeries.series.seasons.find((season) => season.season === this.selectedUserSeries?.season) as Season;
        if(season) {
          this.setSeasonOption(season)
        }
        this.setEpisodeOption(this.selectedUserSeries.episode);
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
        // this.resetSelectedDatas()
      }
    }
  }

  submit = async () => {
    let updateUserSeries: UserSeries = {} as UserSeries;
    if(this.selectedSeason && this.selectedSeason.season !== this.selectedUserSeries?.season) {
      updateUserSeries.season = this.selectedSeason?.season;
    }

    if(this.selectedEpisode && this.selectedEpisode !== this.selectedUserSeries?.episode) {
      updateUserSeries.episode = this.selectedEpisode;
    }

    if(this.selectedStatus && this.selectedStatus.id !== this.selectedUserSeries?.status.id) {
      updateUserSeries.status = { id: this.selectedStatus.id } as Status;
    }

    if(!this.changeHappened() || !this.seriesId) {
      this.snackbar.open("Eddig nem történt adat változtatás!", 'X', { duration: 4000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      return;
    }
    try {
      const result = await this.userSeriesService.updateUserSeries(this.seriesId, updateUserSeries);
      if(result) {
        this.snackbar.open(result, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        this.router.navigateByUrl("/user/series");
        return;
      }
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  remove = () => {
      const dialogRef = this.dialog.open(ConfirmationComponent, { data: { question: "Biztos szeretnéd törölni a sorozatot?" }});

      dialogRef.afterClosed().subscribe(async (response) => {
        if(response) {
          if(!this.seriesId) {
            this.snackbar.open("Váratlan hiba merült fel, töltsd újra a törlendő sorozatot!", 'X', { duration: 4000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
            return;
          }
          try {
            const res = await this.userSeriesService.deleteUserSeries(this.seriesId);
            if(res) {
              this.snackbar.open(res, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
              this.router.navigateByUrl("/user/series");
              return;
            }
          } catch(err) {
            this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
          }
        }
      });
  }

  changeHappened = (): boolean | undefined => {
    return (this.selectedSeason && this.selectedUserSeries && this.selectedSeason.season !== this.selectedUserSeries?.season) ||
      (this.selectedEpisode && this.selectedUserSeries && this.selectedEpisode !== this.selectedUserSeries?.episode) ||
      (this.selectedStatus && this.selectedUserSeries && this.selectedStatus.id !== this.selectedUserSeries?.status.id);
  }

  captureValue = async (value: string) => {
    try {
      const response = await this.userSeriesService.getUserSerieses(1, 10, undefined, value);
      this.seriesOptions = response.serieses
      ? response.serieses
        .map((userseries) => ({
          value: userseries.series.id,
          shownValue: `${userseries.series.title}, ${userseries.series.prodYear}`
        }) as DropdownItem)
      : [];
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  autocompleteValue = async (value: any) => {
    this.seriesId = value;
    if(this.seriesId) {
      this.selectedUserSeries = await this.userSeriesService.getUserSeries(this.seriesId);
      this.router.navigateByUrl(`user/handle/series/${this.seriesId}`, { replaceUrl: true });
      this.resetSelectedDatas();
      this.getSeasonOptions();
      this.getEpisodeOptions();
      this.getStatusOptions();
    }
  }

  seriesDoesntHaveSeasons = () => {
    return !this.selectedUserSeries?.series.seasons || this.selectedUserSeries?.series.seasons.length < 1;
  }

  getSeasonOptions = () => {
    if(this.selectedUserSeries) {
      if(this.seriesDoesntHaveSeasons()) {
        this.seasonOptions = [];
        return;
      }

      this.seasonOptions = this.selectedUserSeries.series.seasons?.map((season) => ({ value: season, shownValue: `${season.season}. Évad`, highlight: season.season === this.selectedSeason?.season }) as DropdownItem);
      return;
    }

    this.seasonOptions = [];
  }

  setSeasonOption = (season: Season) => {
    this.selectedSeason = season;
    this.setEpisodeOption(1);
    this.getSeasonOptions();
  }

  getEpisodeOptions = () => {
    if(this.selectedUserSeries && this.selectedSeason && !this.seriesDoesntHaveSeasons()) {
      const options: DropdownItem[] = [];
      for (let index = 1; index <= this.selectedSeason.episode; index++) {
        options.push({ value: index, shownValue: `${index}. Epizód`, highlight: index === this.selectedEpisode });
      }
      this.episodeOptions =  options;
      return;
    }

    this.episodeOptions = [];
  }

  setEpisodeOption = (episode: number) => {
    this.selectedEpisode = episode;
    this.getEpisodeOptions();
  }

  getStatusOptions = async () => {
    this.statusOptions = this.statuses.map((status) => ({ value: status.id, shownValue: status.name, highlight: status.id === this.selectedStatus?.id }));
  }

  setStatusOption = (statusId: number) => {
    this.selectedStatus = this.statuses.find(status => status.id === statusId);
    this.getStatusOptions();
  }

  getCategories = (): string => {
    if(this.selectedUserSeries) {
      return this.selectedUserSeries.series.categories.map((category) => category.name).join(", ") as string;
    }
    return "";
  }

  resetSelectedDatas = () => {
    if(this.selectedUserSeries && this.selectedUserSeries.series.seasons && this.selectedUserSeries.series.seasons.length > 0) {
      this.selectedSeason = this.selectedUserSeries.series.seasons.find((season) => season.season === this.selectedUserSeries?.season);
      this.selectedEpisode = this.selectedUserSeries?.episode;
      this.selectedStatus = this.selectedUserSeries?.status;
    }
  }
}
