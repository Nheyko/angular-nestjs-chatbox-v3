import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from './IUser';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {

  users$: Observable<User[]>
  usersSubscription: Subscription;

  constructor(
    private readonly usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.users$ = this.usersService.getUsers();
  }

  ngOnDestroy(): void {
    if (this.usersSubscription)
      this.usersSubscription.unsubscribe();
  }
}
