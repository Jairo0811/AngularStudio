import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  RandomUserResponse,
} from '../models/random-user.model';

@Injectable({
  providedIn: 'root',
})
export class RandomUserService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiUrl = 'https://randomuser.me/api/';

  getUsers(
    results = 30,
  ): Observable<RandomUserResponse> {
    const params = new HttpParams()
      .set('results', results)
      .set('noinfo', 'false');

    return this.httpClient.get<RandomUserResponse>(
      this.apiUrl,
      { params },
    );
  }
}