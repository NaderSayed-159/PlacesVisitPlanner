import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, tap } from 'rxjs';

import { Place } from './place.model';
import { ErrorService } from '../shared/error.service';
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);



  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Error Fetching Available Places !!')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Error Fetching User Fav. Places !!')
      .pipe(tap({
        next: (places) => this.userPlaces.set(places),
      }))
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place])
    }else {
      this.errorService.showError('Place Is Already Added!!!')
    }

    return this.httpClient.put("http://localhost:3000/user-places", {
      placeId: place.id
    })
      .pipe(
        catchError(error => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError('Failed to add place !!')
          return throwError(() => new Error('Failed to add place !!'))
        })
      )
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();

    if (prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces.set(prevPlaces.filter(p=>p.id !== place.id))
    } else {
      this.errorService.showError("Place doesn't exist")
    }
    return this.httpClient.delete("http://localhost:3000/user-places/" + place.id)
      .pipe(
        catchError(error => {
          this.userPlaces.set(prevPlaces);
          this.errorService.showError('Failed to add place !!')
          return throwError(() => new Error('Failed to add place !!'))
        })
      )
  }

  fetchPlaces(url: string, erroMsg: string) {
    return this.httpClient
      .get<{ places: Place[] }>(url)
      .pipe(
        map(resData => resData.places),
        catchError(error => {
          return throwError(
            () => new Error(erroMsg)
          );
        })
      )
  }
}
