import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './IUser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) { }

  getUsers(): Observable<any> {
    return this.http.get<User[]>(`http://localhost:3000/users`, { withCredentials: true});
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }

  updatePatch(id: number, user: User): Observable<Object> {
    return this.http.patch(`http://localhost:3000/users/${id}`, user);
  }
}
