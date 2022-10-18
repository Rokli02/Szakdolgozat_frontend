import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { Category, Status } from 'src/app/models/series.model';
import { CategoryService } from 'src/app/services/category.service';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-misc-handler',
  templateUrl: './misc-handler.component.html',
  styleUrls: ['./misc-handler.component.css']
})
export class MiscHandlerComponent implements OnInit {
  statusControl!: FormControl;
  categoryControl!: FormControl;
  statusOptions: DropdownItem[];
  categoryOptions: DropdownItem[];
  selectedCategory?: Category;
  selectedStatus?: Status;
  private categories: Category[];
  private statuses: Status[];
  constructor(private statusService: StatusService,
              private categoryService: CategoryService,
              private fb: FormBuilder,
              private snackbar: MatSnackBar) {
    this.categories = [];
    this.statuses = [];
    this.statusOptions = [];
    this.categoryOptions = [];
  }

  async ngOnInit() {
    this.categoryControl = this.fb.control("", [Validators.required]);
    this.statusControl = this.fb.control("", [Validators.required]);
    try {
      this.categories = await this.categoryService.getCategories();
      this.statuses = await this.statusService.getStatuses();
      this.setCategoryOptions();
      this.setStatusOptions();
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  setCategoryOptions = () => {
    if(!this.categories || this.categories.length < 1) {
      return;
    }

    this.categoryOptions = [{ value: 0, shownValue: "+" } as DropdownItem,
      ...this.categories.map((category) => ({ value: category.id, shownValue: category.name }) as DropdownItem)];
  }

  selectCategory = (id: number) => {
    if(id === 0) {
      this.selectedCategory = undefined;
      this.categoryControl.setValue("");
      return;
    }

    this.selectedCategory = this.categories.find((category) => category.id === id);
    if(!this.selectedCategory) {
      this.snackbar.open("Nem sikerült kiválasztani az állapotot!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      return;
    }

    this.categoryControl.setValue(this.selectedCategory.name);
  }

  submitCategory = async () => {
    if(!this.categoryControl.valid) {
      return;
    }

    if(this.selectedCategory && this.selectedCategory.id) {
      try {
        const response = await this.categoryService.updateCategory(this.selectedCategory.id, { name: this.categoryControl.value });
        if(response) {
          this.snackbar.open(response, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    } else {
      try {
        const response = await this.categoryService.saveCategory({ name: this.categoryControl.value });
        if(response) {
          this.snackbar.open("Kategória mentés sikeres!", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
    this.selectedCategory = undefined;
    this.categoryControl.setValue("");
    this.categoryControl.markAsUntouched({ onlySelf: true });
    try {
      this.categories = await this.categoryService.getCategories();
      this.setCategoryOptions();
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  setStatusOptions = () => {
    if(!this.statuses || this.statuses.length < 1) {
      return;
    }

    this.statusOptions = [{ value: 0, shownValue: "+" } as DropdownItem,
    ...this.statuses.map((status) => ({ value: status.id, shownValue: status.name }) as DropdownItem)];
  }

  selectStatus = (id: number) => {
    if(id === 0) {
      this.selectedStatus = undefined;
      this.statusControl.setValue("");
      return;
    }

    this.selectedStatus = this.statuses.find((status) => status.id === id);
    if(!this.selectedStatus) {
      this.snackbar.open("Nem sikerült kiválasztani az állapotot!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      return;
    }
    this.statusControl.setValue(this.selectedStatus.name);
  }

  submitStatus = async () => {
    if(!this.statusControl.valid) {
      return;
    }

    if(this.selectedStatus && this.selectedStatus.id) {
      try {
        const response = await this.statusService.updateStatus(this.selectedStatus.id, { name: this.statusControl.value });
        if(response) {
          this.snackbar.open(response, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    } else {
      try {
        const response = await this.statusService.saveStatus({ name: this.statusControl.value });
        if(response) {
          this.snackbar.open("Sorozat állapot mentés sikeres!", 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
        }
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }

    this.selectedStatus = undefined;
    this.statusControl.setValue("");
    this.statusControl.markAsUntouched({ onlySelf: true });
    try {
      this.statuses = await this.statusService.getStatuses();
      this.setStatusOptions();
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }
}
