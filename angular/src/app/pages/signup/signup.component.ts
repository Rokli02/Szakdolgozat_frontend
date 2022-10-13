import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NewUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  showPassword: boolean;
  formGroup!: FormGroup;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar) {
    this.showPassword = false;
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required]],
      birthdate: [null, [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      emailAgain: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordAgain: ['', [Validators.required]],
    });

    this.formGroup.get("emailAgain")?.addValidators((email) => {
      return this.formGroup.get("email")?.value === email.value
        ? null
        : { notSame: true };
    });
    this.formGroup.get("passwordAgain")?.addValidators((password) => {
      return this.formGroup.get("password")?.value === password.value
        ? null
        : { notSame: true };
    });
  }

  toggle = () => {
    this.showPassword = !this.showPassword;
  }

  submit = async () => {
    if(!this.formGroup.valid) {
      return;
    }

    const newUser: NewUser = {
      name: this.formGroup.value.name,
      birthdate: this.formGroup.value.birthdate,
      username: this.formGroup.value.username,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password
    };

    try {
      const response = await this.authService.signup(newUser);
      this.snackbar.open(response.message, "X", { verticalPosition: "bottom", duration: 3000, panelClass: ["snackbar-success"] });
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch(err) {
      this.snackbar.open((err as { message: string }).message, "X", { verticalPosition: "bottom", duration: 3000, panelClass: ["snackbar-error"] })
    }
  }

  getError = (controllName: string) => {
    if(this.formGroup.get(controllName)?.getError("required")) {
      return "Kötelező mező!"
    }
    if(this.formGroup.get(controllName)?.getError("notSame")) {
      return "Nem egyezik meg a megismételt mező a másikkal!"
    }

    return "Hibásan kitöltött mező!"
  }
}
