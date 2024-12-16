import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  CheckUserNameResponseData,
  CreateUserDataParams,
  CreateUserDataResponse,
} from './user-name.api.entities';

@Injectable()
export class UserNameApiService {
  constructor(private httpClient: HttpClient) {}

  validateUserName(username: string): Observable<boolean | null> {
    /*

    For now the solution simply includes direct usage of httpClient method
    However, the usual practise to create dedicated service to send all the requests
    and implement error handling/retires etc

    */

    return this.httpClient
      .post<CheckUserNameResponseData>('/api/checkUsername', {
        username,
      })
      .pipe(
        map((response) => {
          return response.isAvailable;
        }),
        catchError((err) => of(null)),
      );
  }

  createUsers(users: CreateUserDataParams): Observable<string | null> {
    return this.httpClient
      .post<CreateUserDataResponse>('/api/submitForm', {
        users,
      })
      .pipe(
        map((response) => {
          return response.result;
        }),
        catchError((err) => of(null)),
      );
  }
}
