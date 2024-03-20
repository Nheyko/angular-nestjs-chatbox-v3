import { Injectable } from '@angular/core';
import { User } from '../users/IUser';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _is_authenticated: boolean = false;
  private _role_id: number = 0;

  constructor(private http: HttpClient) {

    const authenticated = localStorage.getItem('authenticated')
    
    if(authenticated) {
      this._is_authenticated = true;
      firstValueFrom(this.getUser()).then((user: User) => {
        this._role_id = user.role_id;
      })
    } else 
      this._is_authenticated = false;
  }

  public getUser(): Observable<User> {
    return this.http.get<User>('http://localhost:3000/auth/user', { withCredentials: true })
  }

  public get roleId(): number {
    return this._role_id;
  }

  public set roleId(value: number) {
    this._role_id = value;
  }

  public get isAuthenticated(): boolean {
    return this._is_authenticated;
  }

  public set isAuthenticated(value: boolean) {
    this._is_authenticated = value;
  }

  public login(form: FormGroup) {
    return this.http.post('http://localhost:3000/auth/login', form, {withCredentials: true});
  }

  public logout() {
    return this.http.post('http://localhost:3000/auth/logout', {}, {withCredentials: true});
  }
}
