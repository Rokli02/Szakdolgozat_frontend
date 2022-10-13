import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  open: boolean;
  @Input() user?: User;
  constructor(private authService: AuthService) {
    this.open = false;
  }

  ngOnInit(): void {
  }

  toggle = () => {
    this.open = !this.open;
  }

  exit = () => {
    this.authService.logout();
  }
}
