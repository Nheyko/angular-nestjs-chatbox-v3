import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    UsersComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

}
