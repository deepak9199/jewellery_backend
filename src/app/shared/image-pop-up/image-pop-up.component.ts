import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-pop-up',
  templateUrl: './image-pop-up.component.html',
  styleUrl: './image-pop-up.component.css'
})
export class ImagePopUpComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
  }
}
