import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Emitters } from '../emitters/emitters';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css'
})
export class ForbiddenComponent implements OnInit {
  ngOnInit(): void {
    const auth = localStorage.getItem('authenticated');

    if (auth) {
      Emitters.authEmitter.emit(true)
    } else {
      Emitters.authEmitter.emit(false)
    }
  }
}
