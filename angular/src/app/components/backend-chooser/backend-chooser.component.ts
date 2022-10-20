import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-backend-chooser',
  templateUrl: './backend-chooser.component.html',
  styleUrls: ['./backend-chooser.component.css']
})
export class BackendChooserComponent implements OnInit {
  open: boolean;
  constructor(private authService: AuthService) {
    this.open = false;
  }

  ngOnInit(): void {
  }

  toggle = () => {
    this.open = !this.open;
  }

  close = () => {
    this.open = false;
  }

  isChecked = (name: string) => {
    return this.authService.isBackendActive(name);
  }

  changeBackend = (name: string) => {
    this.authService.changeBackendLocation(name);
  }
}
