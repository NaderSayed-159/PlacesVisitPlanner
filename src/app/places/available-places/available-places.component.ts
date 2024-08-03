import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  public isFetching = false;
  private destoryRef = inject(DestroyRef)
  // private httpClient = inject(HttpClient);
  private placeService = inject(PlacesService);
  error = '';


  ngOnInit() {
    this.isFetching = true;
    const subscription = this.placeService.loadAvailablePlaces()
      .subscribe({
        next: (res) => {
          this.places.set(res);
        },
        error: (err: Error) => {
          console.log(err)
          this.error = err.message;
        },
        complete: () => {
          this.isFetching = false;
        }
      });
    this.destoryRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placeService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (res) => console.log(res),
    })

    this.destoryRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}
