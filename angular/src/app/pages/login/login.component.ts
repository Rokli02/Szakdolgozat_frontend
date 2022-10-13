import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(private fb: FormBuilder,
              private snackbar: MatSnackBar,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  submit = async () => {
    if(!this.formGroup.valid) {
      return;
    }

    const { login, password } = this.formGroup.value;
    try {
      const response = await this.authService.login(login, password);
      this.snackbar.open(response.message, "X", { verticalPosition: "bottom", duration: 3000, panelClass: ["snackbar-success"] });
      this.router.navigate(['/'], { replaceUrl: true });
    } catch(err) {
      this.snackbar.open((err as { message: string }).message, "X", { verticalPosition: "bottom", duration: 3000, panelClass: ["snackbar-error"] });
      this.formGroup.get("password")?.setValue("");
    }
  }
}
