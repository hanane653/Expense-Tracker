import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  styleUrls: ['./register.component.css'],
})
export class RegistrationComponent {
  form: FormGroup;
  apiUrl = 'http://localhost:7044/api/Authentication/register'; // Update with your API base URL
  notification: string | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      budget: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notification = 'Please fill in all required fields correctly.';
      return;
    }

    this.http.post(this.apiUrl, this.form.value).subscribe({
      next: () => {
        this.notification = 'Registration successful!';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect to login after success
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.notification = 'Registration failed. Please try again.';
      },
    });
  }
}
