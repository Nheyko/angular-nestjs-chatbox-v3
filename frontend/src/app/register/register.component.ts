import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private readonly http: HttpClient,
    private readonly formBuilder: FormBuilder,
    private router: Router
  ) { }

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      confirmEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  confirmEmail() {

    const email = this.form.get('email').value;
    const confirmEmail = this.form.get('confirmEmail').value

    if(email !== confirmEmail) {
      return false;
    }
    return true;
  }

  confirmPassword() {

    const password = this.form.get('password').value;
    const confirmPassword = this.form.get('confirmPassword').value

    if(password !== confirmPassword) {
      return false;
    }
    return true;
  }

  onSubmit(): void {

    const emailConfirmed = this.confirmEmail();
    const passwordConfirmed = this.confirmPassword()

    if(emailConfirmed === true && passwordConfirmed === true) {
      this.http.post('http://localhost:3000/auth/register', this.form.getRawValue()).subscribe((res) => {
        this.router.navigate(['/login'])
      })
    } else
    {
      throw new Error("Invalid form");
    }
  }
}
