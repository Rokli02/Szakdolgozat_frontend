import { Component, Input, OnInit } from '@angular/core';
import { Newsfeed } from 'src/app/models/newsfeed.model';

@Component({
  selector: 'app-newsfeed-item',
  templateUrl: './newsfeed-item.component.html',
  styleUrls: ['./newsfeed-item.component.css']
})
export class NewsfeedItemComponent implements OnInit {
  @Input() newsfeed!: Newsfeed;
  constructor() { }

  ngOnInit(): void {
  }

}
