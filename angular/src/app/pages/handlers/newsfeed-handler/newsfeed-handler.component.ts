import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/components/items/confirmation/confirmation.component';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { Newsfeed } from 'src/app/models/newsfeed.model';
import { Series } from 'src/app/models/series.model';
import { NewsfeedService } from 'src/app/services/newsfeed.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-newsfeed-handler',
  templateUrl: './newsfeed-handler.component.html',
  styleUrls: ['./newsfeed-handler.component.css']
})
export class NewsfeedHandlerComponent implements OnInit {
  formGroup!: FormGroup;
  addNew: boolean;
  newsfeedId?: number;
  series?: Series;
  newsfeedOptions: DropdownItem[];
  seriesOptions: DropdownItem[];
  private selectedNewsfeed?: Newsfeed;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private snackbar: MatSnackBar,
              private fb: FormBuilder,
              private newsfeedService: NewsfeedService,
              private seriesService: SeriesService,
              private dialog: MatDialog) {
    this.addNew = true;
    this.newsfeedOptions = [];
    this.seriesOptions = [];
  }

  async ngOnInit() {
    this.formGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });

    const tempId = this.route.snapshot.paramMap.get("id");
    if(tempId) {
      this.addNew = false;
      this.newsfeedId = Number(tempId);

      try {
        this.selectedNewsfeed = await this.newsfeedService.getNewsfeed(this.newsfeedId);
        this.setValues(this.selectedNewsfeed);
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
        this.router.navigateByUrl(`/admin/newsfeed`, { replaceUrl: true });
      }
    }
  }

  isValid = () => {
    return this.formGroup.valid && this.series !== undefined;
  }

  submit = async () => {
    if(!this.formGroup.valid || this.series === undefined) {
      return;
    }

    const formNewsfeed: Newsfeed = {
      title: this.formGroup.get("title")?.value,
      description: this.formGroup.get("description")?.value,
      series: {
        id: this.series?.id as number,
        title: this.series.title,
        prodYear: this.series.prodYear,
      }
    } as Newsfeed;
    if(this.addNew) {
      try {
        const response = await this.newsfeedService.saveNewsfeed(formNewsfeed);
        if(response) {
          this.snackbar.open("Újdonság hozzáadása sikeres!", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
        this.resetValues();
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    } else {
      if(!this.newsfeedId) {
        this.snackbar.open("Hiba lépett fel, töltsd újra a módosítandó újdonságot", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
        return;
      }
      try {
        const response = await this.newsfeedService.updateNewsfeed(this.newsfeedId, formNewsfeed);
        if(response) {
          this.snackbar.open(response, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  remove = async () => {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        question: "Biztos hogy szeretnéd törölni?"
    }})

    dialogRef.afterClosed().subscribe(async (response) => {
      if(response) {
        if(!this.newsfeedId) {
          this.snackbar.open("Nem sikerült törölni, töltsd újra a törlendő újdonságot!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
          return;
        }

        try {
          const res = await this.newsfeedService.deleteNewsfeed(this.newsfeedId);
          if(res) {
            this.snackbar.open(res, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
            this.router.navigateByUrl(`/admin/newsfeed`, { replaceUrl: true });
          }
        } catch(err) {
          this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
        }
      }
    });
  }

  autocompleteValue = async (value: any) => {
    if(!isNaN(value)) {
      this.newsfeedId = value as number;
      await this.router.navigateByUrl(`/admin/newsfeed/${this.newsfeedId}`, { replaceUrl: true });
      try {
        this.setValues(await this.newsfeedService.getNewsfeed(this.newsfeedId));
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  captureValue = async (value: string) => {
    try {
      const response = await this.newsfeedService.getNewsfeeds(1, 10, value);
      this.newsfeedOptions = response.newsfeeds
      ? response.newsfeeds
        .map((newsfeed) => ({
          value: newsfeed.id,
          shownValue: `${newsfeed.title} | ${newsfeed.series.title}`
        }) as DropdownItem)
      : [];
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  autocompleteSeriesValue = async (value: any) => {
    if(!isNaN(value)) {
      try {
        this.series = await this.seriesService.getSeries(value);
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  captureSeriesValue = async (value: string) => {
    try {
      const response = await this.seriesService.getSerieses(1, 10, value);
      this.seriesOptions = response.serieses
      ? response.serieses
        .map((series) => ({
          value: series.id,
          shownValue: `${series.title}, ${series.prodYear}`
        }) as DropdownItem)
      : [];
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  setValues = (newsfeed: Newsfeed) => {
    this.formGroup.setValue({
      title: newsfeed.title,
      description: newsfeed.description
    });

    this.series = newsfeed.series as Series;
  }

  resetValues = () => {
    this.formGroup.setValue({
      title: '',
      description: ''
    })

    this.series = undefined;
    this.newsfeedId = undefined;
    this.selectedNewsfeed = undefined;
  }

  routeTo = (type: string) => {
    switch (type) {
      case "new":
        this.addNew = true;
        this.resetValues();
        this.router.navigateByUrl("/admin/newsfeed", { replaceUrl: true });
        return;
      case "change":
        this.addNew = false;
        this.resetValues();
        this.router.navigateByUrl(`/admin/newsfeed`, { replaceUrl: true });
        return;
      default:
        return;
    }
  }
}
