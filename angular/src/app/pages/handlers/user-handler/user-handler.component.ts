import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/components/items/confirmation/confirmation.component';
import { DropdownItem, ErrorMessage } from 'src/app/models/menu.model';
import { NewUser, Role, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-handler',
  templateUrl: './user-handler.component.html',
  styleUrls: ['./user-handler.component.css']
})
export class UserHandlerComponent implements OnInit {
  lockPassword: boolean;
  activated: boolean;
  formGroup!: FormGroup;
  filter: string;
  userId?: number;
  selectedUser?: User;
  private roles: Role[];
  constructor(private router: Router,
              private route: ActivatedRoute,
              private snackbar: MatSnackBar,
              private fb: FormBuilder,
              private userService: UserService,
              private dialog: MatDialog) {
    this.filter = "";
    this.roles = [];
    this.lockPassword = true;
    this.activated = true;
  }

  async ngOnInit() {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      birthdate: [undefined, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: [{id: 0, name: 'unknown'}],
      password: [{value: '', disabled: true}]
    });

    this.roles = await this.userService.getRoles();
    const tempId = this.route.snapshot.paramMap.get("id");
    if(tempId) {
      this.setValues(Number(tempId));
    }
  }

  submit = async () => {
    if(!this.activated) {
      const dialogRef = this.dialog.open(ConfirmationComponent, { data: {question: "Biztos szeretnéd deaktiválni?"} });

      dialogRef.afterClosed().subscribe(async (response) => {
        if(response) {
          if(!this.userId) {
            this.snackbar.open("Nem sikerült deaktiválni, töltsd újra a deaktiválandó felhasználót!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
            return;
          }

          try {
            const res = await this.userService.deleteUser(this.userId);
            if(res) {
              this.snackbar.open(res, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
              this.router.navigateByUrl(`/admin/user`, { replaceUrl: true });
            }
          } catch(err) {
            this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
          }
        }
      });

      return;
    }
    const updatedUser: NewUser = {} as NewUser;
    const formUser: User = this.formGroup.value;
    if(formUser.name && formUser.name !== this.selectedUser?.name) {
      updatedUser.name = formUser.name;
    }

    if(formUser.birthdate && formUser.birthdate !== this.selectedUser?.birthdate) {
      updatedUser.birthdate = formUser.birthdate;
    }

    if(formUser.email && formUser.email !== this.selectedUser?.email) {
      updatedUser.email = formUser.email;
    }

    if(formUser.role.id && formUser.role.id !== this.selectedUser?.role.id) {
      updatedUser.role = formUser.role;
    }

    if(formUser.password && formUser.password !== this.selectedUser?.password) {
      updatedUser.password = formUser.password;
    }

    if(!this.selectedUser?.active) {
      updatedUser.active = true;
    }

    try {
      if(!this.userId) {
        this.snackbar.open("Nem sikerült frissíteni, töltsd újra a módosítandú felhasználót!", 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
        return;
      }
      const res = await this.userService.updateUser(this.userId, updatedUser);
      this.snackbar.open(res, 'X', { duration: 3000, verticalPosition: 'bottom', panelClass: ['snackbar-success'] });
      await this.router.navigateByUrl("/admin/user", { skipLocationChange: true, replaceUrl: true });
      await this.router.navigateByUrl(`/admin/user/${this.userId}`, { replaceUrl: true });
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
    }
  }

  captureValue = async (value: string) => {
    this.filter = value;
  }

  setValues = async (userId: number) => {
    try {
      this.userId = userId;
      this.selectedUser = await this.userService.getUser(userId);
      this.formGroup.setValue({
        name: this.selectedUser.name,
        birthdate: this.selectedUser.birthdate,
        email: this.selectedUser.email,
        role: this.selectedUser.role,
        password: ''
      });
      if(typeof this.selectedUser.active === "boolean") {
        this.activated = this.selectedUser.active;
      }
      if(this.activated) {
        this.formGroup.enable({ onlySelf: true });
      } else {
        this.formGroup.disable({ onlySelf: true });
      }
      this.router.navigateByUrl(`/admin/user/${userId}`, { replaceUrl: true });
    } catch(err) {
      this.snackbar.open((err as ErrorMessage).error.message, 'X', { duration: 6000, verticalPosition: 'bottom', panelClass: ['snackbar-error'] });
      this.router.navigateByUrl(`/admin/user`, { replaceUrl: true });
      this.resetValue();
    }
  }

  resetValue = () => {
    this.userId = undefined;
    this.selectedUser = undefined;
    this.formGroup.setValue({
      name: '',
    });
  }

  getRoleOptions = () => {
    return this.roles.map((role) => ({ value: role.id, shownValue: role.name, highlight: role.id === this.formGroup?.value.role.id }) as DropdownItem);
  }

  setRole = (roleId: number) => {
    if(!this.activated) {
      return;
    }

    const role = this.roles.find((rl) => rl.id === roleId);
    if(role) {
      this.formGroup.get("role")?.setValue(role);
    }
  }

  togglePasswordLock = () => {
    if(this.activated) {
      this.lockPassword = !this.lockPassword;
      if(this.lockPassword) {
        this.formGroup.get("password")?.disable({ onlySelf: true });
      } else {
        this.formGroup.get("password")?.enable({ onlySelf: true });
      }
    }
  }

  toggleActivate = () => {
    this.activated = !this.activated;
    if(this.activated) {
      this.formGroup.enable({ onlySelf: true });

    } else {
      this.formGroup.disable({ onlySelf: true });
    }
    this.lockPassword = true;
    this.formGroup.get("password")?.disable({ onlySelf: true });
  }
}
