import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  form: FormGroup;
  apiUrl = 'http://localhost:7044/api/Authentication/login'; // Update with your API URL
  notification: string | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notification = 'Please fill in all fields correctly.';
      return;
    }

    this.http.post(this.apiUrl, this.form.value).subscribe({
      next: () => {
        this.notification = 'Login successful!';
        setTimeout(() => this.router.navigate(['/dashboard']), 2000); // Redirect to dashboard on success
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.notification = 'Invalid email or password. Please try again.';
      },
    });
  }
}
