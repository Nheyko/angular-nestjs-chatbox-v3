import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Emitters } from '../emitters/emitters';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent implements OnInit, OnDestroy {

  logoutSubscription: Subscription;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit() {
    Emitters.authEmitter.subscribe(
      (auth: boolean) => {
        this.authService.isAuthenticated = auth;
      }
    )
  }

  logout() {
    this.logoutSubscription = this.authService.logout().subscribe({
      next:() => {
        this.authService.isAuthenticated = false;
        localStorage.setItem('authenticated', '');
      }
    });
  }

  ngOnDestroy(): void {
    if(this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }
}
