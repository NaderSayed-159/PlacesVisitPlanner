import { Component, Input, input, output } from '@angular/core';

import { Place } from './place.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './places.component.html',
  styleUrl: './places.component.css',
})
export class PlacesComponent {
  places = input.required<Place[]>();
  selectPlace = output<Place>();

  @Input() showDeleteBtn: boolean = false;

  deleteBtnVisible: boolean = false;

  ngOnInit() {
    this.deleteBtnVisible = this.showDeleteBtn;
  }

  onSelectPlace(place: Place) {
    this.selectPlace.emit(place);
  }

}
