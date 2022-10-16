import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { Category, Season, Series } from 'src/app/models/series.model';
import { CategoryService } from 'src/app/services/category.service';
import { SeriesService } from 'src/app/services/series.service';

@Component({
  selector: 'app-series-handler',
  templateUrl: './series-handler.component.html',
  styleUrls: ['./series-handler.component.css']
})
export class SeriesHandlerComponent implements OnInit {
  formGroup!: FormGroup;
  seasonControl!: FormControl;
  episodeControl!: FormControl;
  addNew!: boolean;
  seriesId?: number;
  seriesOptions: DropdownItem[];
  private categories!: Category[];
  private selectedSeries?: Series;
  constructor(private fb: FormBuilder,
              private seriesService: SeriesService,
              private categoryService: CategoryService,
              private snackbar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {
    this.addNew = true;
    this.seriesOptions = [];
  }

  async ngOnInit() {
    this.formGroup = this.fb.group({
      title: ["", [Validators.required]],
      length: ["", [Validators.required, Validators.min(1)]],
      prodYear: ["", [Validators.required, Validators.min(1900)]],
      ageLimit: ["", [Validators.required, Validators.min(1), Validators.max(24)]],
      seasons: [[]],
      categories: [[]]
    });
    this.seasonControl = this.fb.control('', [Validators.min(1)]);
    this.episodeControl = this.fb.control('', [Validators.min(1)]);
    this.categories = await this.categoryService.getCategories();

    const tempId = this.route.snapshot.paramMap.get("id");
    if(tempId) {
      this.addNew = false;
      this.seriesId = Number(tempId);

      try {
        this.selectedSeries = await this.seriesService.getSeries(this.seriesId);
        this.setValues(this.selectedSeries);
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  submit = () => {
    // Logika eldönteni, hogy mentés, vagy módosítás
    // Amennyiben módosítás, akkor melyik mezőket küldje el
    console.log(this.formGroup.value);
  }

  autocompleteValue = async (value: any) => {
    if(!isNaN(value)) {
      this.seriesId = value as number;
      this.router.navigateByUrl(`/admin/series/${this.seriesId}`, { replaceUrl: true });
      this.selectedSeries = await this.seriesService.getSeries(this.seriesId);
      this.setValues(this.selectedSeries);
    }
  }

  captureValue = async (value: string) => {
    try {
      const response = await this.seriesService.getSerieses(1, 10, value);
      this.seriesOptions = response.serieses
      ? response.serieses
        .map((series) => ({
          value: series.id,
          shownValue: `${series.id}. ${series.title}, ${series.prodYear}`
        }) as DropdownItem)
      : [];
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  saveSeason = () => {
    if(this.seasonControl.value && this.episodeControl.value) {
      const seasonArray: Season[] = this.formGroup.get("seasons")?.value;
      const newSeasons: Season = { season: this.seasonControl.value, episode: this.episodeControl.value }

      if(!seasonArray) {
        this.formGroup.get("seasons")?.setValue([]);
      }

      let index = -1;
      let i = 0;
      for(const season of seasonArray) {
        if(season.season === this.seasonControl.value) {
          index = i;
          break;
        }
        i++;
      }

      if(index === -1) {
        seasonArray.push(newSeasons);
      } else {
        seasonArray[index] = newSeasons;
      }
      this.seasonControl.setValue("");
      this.episodeControl.setValue("");
      this.formGroup.get("seasons")?.setValue(seasonArray);
    }
  }

  removeSeason = (season: number) => {
    if(!season) {
      return;
    }

    const seasonArray: Season[] = this.formGroup.get("seasons")?.value.filter((sn: Season) => sn.season !== season);
    this.formGroup.get("seasons")?.setValue(seasonArray);
  }

  handleCategory = (id: number) => {
    if(!id) {
      return;
    }

    const categoryArray: Category[] = this.formGroup.get("categories")?.value ?? [];
    // Eldönteni, hogy szerepel-e már a listában, vagy sem
    if(categoryArray.find((category) => category.id === id)) {
      this.formGroup.get("categories")?.setValue(categoryArray.filter((ct) => ct.id !== id));
    } else {
      const category = this.categories.find((ct) => ct.id === id);
      this.formGroup.get("categories")?.setValue([...categoryArray, category]);
    }


  }

  getSeasonOptions = () => {
    if(this.formGroup.get("seasons")?.value) {
      return this.formGroup.get("seasons")?.value.sort((a: Season, b: Season) => a.season - b.season).map((season: Season) => ({
        value: season.season,
        shownValue: `${season.season}. évad, ${season.episode} rész`
      }) as DropdownItem)
    }

    return [];
  }

  getCategoryOptions = () => {
    const formCategories: Category[] = this.formGroup.get("categories")?.value;
    if(!this.categories) {
      return [];
    }

    return this.categories.map((category) => {
      if(formCategories.find((ct) => ct.id === category.id)) {
        return {
          shownValue: category.name,
          value: category.id,
          highlight: true
        } as DropdownItem;
      }
      return {
        shownValue: category.name,
        value: category.id
      } as DropdownItem;
    });
  }

  resetValues = () => {
    this.selectedSeries = undefined;
    this.seriesId = undefined;
    this.seriesOptions = [];

    this.seasonControl.setValue("");
    this.episodeControl.setValue("");
    this.formGroup.setValue({
      title: "",
      length: "",
      prodYear: "",
      ageLimit: "",
      seasons: [],
      categories: []
    });
  }

  setValues = (series: Series) => {
    this.formGroup.setValue({
      title: series.title,
      length: series.length,
      prodYear: series.prodYear,
      ageLimit: series.ageLimit,
      seasons: series.seasons,
      categories: series.categories
    });
  }

  routeTo = (type: string) => {

    switch (type) {
      case "new":
        this.addNew = true;
        this.resetValues();
        this.router.navigateByUrl("/admin/series", { replaceUrl: true });
        return;
      case "change":
        this.addNew = false;
        this.resetValues();
        this.router.navigateByUrl(`/admin/series`, { replaceUrl: true });
        return;
      default:
        return;
    }
  }
}
