import { Component, OnInit } from '@angular/core';
import { Emitters } from '../emitters/emitters';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient,
    private readonly authService: AuthService) {}

  ngOnInit(): void {
    const auth = localStorage.getItem('authenticated');

    if (auth) {
      Emitters.authEmitter.emit(true)

      this.http.get('http://localhost:3000/auth/user', { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.authService.roleId = res.role_id;
    }})

    } else {
      Emitters.authEmitter.emit(false)
    }
  }
}