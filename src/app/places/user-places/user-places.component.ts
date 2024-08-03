import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  public isFetching = false;
  private destoryRef = inject(DestroyRef)
  private placeService = inject(PlacesService);
  places = this.placeService.loadedUserPlaces;

  error = '';


  ngOnInit() {
    this.isFetching = true;
    const subscription = this.placeService.loadUserPlaces()
      .subscribe({
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

  onRemovePlace(place:Place){
    const subscription = this.placeService.removeUserPlace(place) .subscribe();

    this.destoryRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }

}
