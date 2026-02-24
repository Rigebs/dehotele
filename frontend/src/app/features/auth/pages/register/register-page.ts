import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service';
import { Router } from '@angular/router';
import { Card } from '../../../../shared/ui/card/card';
import { Input } from '../../../../shared/ui/input/input';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Input, Button],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal<string | null>(null);

  readonly isLoading = computed(() => this._isLoading());
  readonly errorMessage = computed(() => this._errorMessage());

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this._isLoading.set(true);
    this._errorMessage.set(null);

    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this._isLoading.set(false);
        this.router.navigateByUrl('/');
        console.log('skdfjs');
      },
      error: () => {
        this._isLoading.set(false);
        this._errorMessage.set('Registration failed');
      },
    });
  }
}
