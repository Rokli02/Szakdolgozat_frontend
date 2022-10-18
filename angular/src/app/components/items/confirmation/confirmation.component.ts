import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from 'src/app/models/menu.model';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  constructor(public dialog: MatDialogRef<ConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  close = () => {
    this.dialog.close(false);
  }

  accept = () => {
    this.dialog.close(true);
  }
}
