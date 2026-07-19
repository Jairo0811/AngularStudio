import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RandomUserResponse } from '../models/random-user.model';

@Injectable({ providedIn: 'root' })
export class RandomUserService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://randomuser.me/api/';

  getUsers(results = 24, page = 1, seed = 'angularstudio'): Observable<RandomUserResponse> {
    const params = new HttpParams()
      .set('results', results)
      .set('page', page)
      .set('seed', seed)
      .set('inc', 'gender,name,location,email,login,dob,phone,cell,picture,nat');

    return this.http.get<RandomUserResponse>(this.endpoint, { params });
  }
}
