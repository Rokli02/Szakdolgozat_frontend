import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Newsfeed } from 'src/app/models/newsfeed.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-newsfeed-item',
  templateUrl: './newsfeed-item.component.html',
  styleUrls: ['./newsfeed-item.component.css']
})
export class NewsfeedItemComponent implements OnInit {
  @Input() newsfeed!: Newsfeed;
  canAccess: boolean;
  constructor(private router: Router,
              private authService: AuthService) {
    this.canAccess = false;
  }

  ngOnInit(): void {
    this.canAccess = this.authService.hasRight(["siteManager", "admin"]);
  }

  editNewsfeed = () => {
    this.router.navigateByUrl(`/admin/newsfeed/${this.newsfeed.id}`);
  }
}
