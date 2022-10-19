import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserSeries } from 'src/app/models/series.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userseries-item',
  templateUrl: './userseries-item.component.html',
  styleUrls: ['./userseries-item.component.css']
})
export class UserseriesItemComponent implements OnInit {
  @Input() userseries!: UserSeries;
  canEdit: boolean;
  constructor(private router: Router,
              private authService: AuthService) {
    this.canEdit = false;
  }

  ngOnInit(): void {
    this.canEdit = this.authService.hasRight(['user']);
  }

  getCategories = (): string => {
    if(!this.userseries.series.categories) {
      return "";
    }
    return this.userseries.series.categories.map((category) => category.name).join(', ');
  }

  getLimitColor = (): string => {
    if(!this.userseries.series || this.userseries.series.ageLimit >= 18) {
      return 'var(--red)';
    }

    if(this.userseries.series.ageLimit >= 16) {
      return '#F19F24'
    }

    if(this.userseries.series.ageLimit >= 12) {
      return '#FCFF5A'
    }

    return '#51D911'
  }

  editSeries = () => {
    this.router.navigateByUrl(`/user/handle/series/${this.userseries.series.id}`);
  }
}
