import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessage } from 'src/app/models/menu.model';
import { UserTableElement } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, OnChanges {
  @Input() searchValue: string;
  @Output() selectedUserId = new EventEmitter<number>();

  userTableElements: UserTableElement[];
  page: number;
  size: number;
  order?: string;
  asc?: boolean;
  dataCount: number;
  columns: string[];
  constructor(private userService: UserService,
              private snackbar: MatSnackBar) {
    this.userTableElements = [];
    this.page = 0;
    this.size = 10;
    this.searchValue = "";
    this.dataCount = 0;
    this.columns = ["id", "name", "email", "birthdate", "role", "active", "created"]
  }
  async ngOnChanges(changes: SimpleChanges) {
    if(changes['searchValue']) {
      try {
        this.userTableElements = await this.getUsers();
      } catch(err) {
        this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      }
    }
  }

  async ngOnInit() {
    try {
      this.userTableElements = await this.getUsers();
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  getUsers = async (): Promise<UserTableElement[]> => {
    const userResponse = await this.userService.getUsers(this.page + 1, this.size, this.searchValue, this.order, this.asc);
    this.dataCount = userResponse.count;
    return userResponse.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      role: user.role.name,
      active: user.active,
      created: user.created
    }) as UserTableElement);
  }

  selectUser = (user: UserTableElement) => {
    this.selectedUserId.emit(user.id);
  }

  selectOrder = async (data?: string) => {
    if(data === this.order) {
      if(this.asc) {
        this.asc = undefined;
      } else {
        this.asc = true;
      }
    } else {
      this.order = data;
      this.asc = undefined;
    }

    try {
      this.userTableElements = await this.getUsers();
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  setPageData = async (data: any) => {
    this.page = data.pageIndex;
    this.size = data.pageSize;
    try {
      this.userTableElements = await this.getUsers();
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }
}
