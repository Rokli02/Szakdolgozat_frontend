import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TempUploadedImage, UploadableFile } from 'src/app/models/image.model';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { Category, Season, Series } from 'src/app/models/series.model';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
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
  xOffset!: FormControl;
  yOffset!: FormControl;
  addNew: boolean;
  seriesId?: number;
  seriesOptions: DropdownItem[];
  selectedSeries?: Series;
  private categories!: Category[];
  private removableSeasons: Season[];
  private tempImage?: TempUploadedImage;
  constructor(private fb: FormBuilder,
              private seriesService: SeriesService,
              private categoryService: CategoryService,
              private imageService: ImageService,
              private snackbar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {
    this.addNew = true;
    this.seriesOptions = [];
    this.removableSeasons = [];
  }

  async ngOnInit() {
    this.formGroup = this.fb.group({
      title: ["", [Validators.required]],
      length: ["", [Validators.required, Validators.min(1)]],
      prodYear: ["", [Validators.required, Validators.min(1900)]],
      ageLimit: ["", [Validators.required, Validators.min(1), Validators.max(99)]],
      seasons: [[]],
      categories: [[]]
    });
    this.seasonControl = this.fb.control('', [Validators.min(1)]);
    this.episodeControl = this.fb.control('', [Validators.min(1)]);
    this.xOffset = this.fb.control('');
    this.yOffset = this.fb.control('');
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
        this.router.navigateByUrl(`/admin/series`, { replaceUrl: true });
      }
    }
  }

  submit = async () => {
    if(!this.formGroup.valid) {
      return;
    }

    const formSeries: Series = {
      title: this.formGroup.get("title")?.value,
      prodYear: this.formGroup.get("prodYear")?.value,
      length: this.formGroup.get("length")?.value,
      ageLimit: this.formGroup.get("ageLimit")?.value,
      seasons: this.formGroup.get("seasons")?.value,
      categories: this.formGroup.get("categories")?.value,
    }
    if(this.tempImage) {
      formSeries.image = { ...this.tempImage };
      if(this.xOffset.value !== "" || this.xOffset.value !== undefined) {
        formSeries.image.x_offset = this.xOffset.value;
      }
      if(this.yOffset.value !== "" || this.yOffset.value !== undefined) {
        formSeries.image.y_offset = this.yOffset.value;
      }
    }

    if(this.addNew) {
      try {
        const response = await this.seriesService.saveSeries(formSeries);
        if(response) {
          this.snackbar.open("Sorozat sikeresen mentve!", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
        this.resetValues();
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    } else {
      const updateSeries: Series = {} as Series;

      if(formSeries.title !== this.selectedSeries?.title) {
        updateSeries.title = formSeries.title;
      }
      if(formSeries.prodYear !== this.selectedSeries?.prodYear) {
        updateSeries.prodYear = formSeries.prodYear;
      }
      if(formSeries.length !== this.selectedSeries?.length) {
        updateSeries.length = formSeries.length;
      }
      if(formSeries.ageLimit !== this.selectedSeries?.ageLimit) {
        updateSeries.ageLimit = formSeries.ageLimit;
      }
      if(formSeries.image) {
        updateSeries.image = formSeries.image;
      }
      if(!this.tempImage && this.selectedSeries?.image) { // Valami ellenőrzés, hogy történt-e változás
        if(this.xOffset.value && this.selectedSeries.image.x_offset !== this.xOffset.value) {
          if(!updateSeries.image) {
            updateSeries.image = {
              id: this.selectedSeries?.image?.id,
              name: this.selectedSeries?.image?.name
            };
          }
          updateSeries.image.x_offset = this.xOffset.value;
        }
        if(this.yOffset.value && this.selectedSeries.image.y_offset !== this.yOffset.value) {
          if(!updateSeries.image) {
            updateSeries.image = {
              id: this.selectedSeries?.image?.id,
              name: this.selectedSeries?.image?.name
            };
          }
          updateSeries.image.y_offset = this.yOffset.value;
        }
      }
      if(this.selectedSeries?.categories && this.selectedSeries?.categories.length > 0) {
        updateSeries.categories = [];
        const categoryMap: Map<number, Category> = new Map<number, Category>();
        for(let ct of this.selectedSeries?.categories) {
          if(ct.id)
            categoryMap.set(ct.id, { ...ct, remove: true });
        }

        for(let category of formSeries.categories) {
          if(category.id)
            categoryMap.set(category.id, category);
        }

        categoryMap.forEach((value, id) => {
          updateSeries.categories.push(value);
        });

      } else if(formSeries.categories && formSeries.categories.length > 0) {
        updateSeries.categories = formSeries.categories
      }

      if(!this.selectedSeries?.seasons || this.selectedSeries?.seasons.length < 0) {
        updateSeries.seasons = formSeries.seasons;
      } else {
        updateSeries.seasons = [];

        for(let season of formSeries.seasons) {
          if((!season.id && season.season && season.episode)
          || (season.id && season.season && season.episode)) {
            updateSeries.seasons.push(season);
          }
        }
      }
      updateSeries.seasons.push(...this.removableSeasons);

      try {
        if(!this.seriesId) {
          this.snackbar.open("Hiányzó ID, nyisd meg újra a módosítandó sorozatot!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
          return;
        }
        const response = await this.seriesService.updateSeries(this.seriesId, updateSeries);
        if(response) {
          this.snackbar.open("Sorozat sikeresen módosítva!", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
          this.router.navigateByUrl("/series");
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  autocompleteValue = async (value: any) => {
    if(!isNaN(value)) {
      this.seriesId = value as number;
      await this.router.navigateByUrl(`/admin/series/${this.seriesId}`, { replaceUrl: true });
      try {
        this.setValues(await this.seriesService.getSeries(this.seriesId));
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  captureValue = async (value: string) => {
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

  uploadFile = async (fileEvent: any) => {
    const uploadableFile = fileEvent.target.files[0] ?? null;
    if(uploadableFile) {
      try {
        const response = await this.imageService.upload(uploadableFile)
        if(response) {
          this.tempImage = response;
          this.snackbar.open("Sikeres képfeltöltés", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  removeImage = async () => {
    if(this.selectedSeries && this.selectedSeries.id) {
      try {
        const response = await this.seriesService.deleteImage(this.selectedSeries.id);
        if(response) {
          this.resetImageValues();
          this.snackbar.open(response, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  saveSeason = () => {
    if(this.seasonControl.value && this.episodeControl.value) {
      const seasonArray: Season[] = this.formGroup.get("seasons")?.value;
      const newSeason: Season = { season: this.seasonControl.value, episode: this.episodeControl.value }

      let index = -1;
      let i = 0;
      for(const season of seasonArray) {
        if(season.season === this.seasonControl.value) {
          index = i;
          newSeason.id = season.id;
          break;
        }
        i++;
      }

      if(index === -1) {
        seasonArray.push(newSeason);
      } else {
        seasonArray[index] = newSeason;
      }

      this.seasonControl.setValue("");
      this.episodeControl.setValue("");
      this.seasonControl.markAsUntouched({ onlySelf: true });
      this.episodeControl.markAsUntouched({ onlySelf: true });
      this.formGroup.get("seasons")?.setValue(seasonArray);
    }
  }

  removeSeason = (season: number) => {
    if(!season) {
      return;
    }

    const seasonArray: Season[] = this.formGroup.get("seasons")?.value.filter((sn: Season) => {
      if(sn.season === season) {
        if(sn.id) {
          this.removableSeasons.push({ id: sn.id} as Season);
        }
        return false;
      }
      return true;
    });
    this.formGroup.get("seasons")?.setValue(seasonArray);
  }

  handleCategory = (id: number) => {
    if(!id) {
      return;
    }

    const categoryArray: Category[] = this.formGroup.get("categories")?.value ?? [];
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
    this.removableSeasons = [];
    this.tempImage = undefined;

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
    this.resetImageValues();
  }

  resetImageValues = () => {
    if(this.selectedSeries) {
      this.selectedSeries.image = undefined;
    }
    this.tempImage = undefined;
    this.xOffset.setValue("");
    this.yOffset.setValue("");
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

    if(series.image) {
      if(series.image.x_offset) {
        this.xOffset.setValue(series.image.x_offset);
      }
      if(series.image.y_offset) {
        this.yOffset.setValue(series.image.y_offset);
      }
    }
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
