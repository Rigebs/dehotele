import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Button } from '../../../../shared/ui/button/button';
import { AuthService } from '../../../../core/services/auth-service';
import { Input } from '../../../../shared/ui/input/input';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, Button, Input, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _isLoading = signal(false);
  private readonly _errorMessage = signal<string | null>(null);

  readonly isLoading = computed(() => this._isLoading());
  readonly errorMessage = computed(() => this._errorMessage());

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) return;

    this._isLoading.set(true);
    this._errorMessage.set(null);

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this._isLoading.set(false);
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this._isLoading.set(false);
        this._errorMessage.set('Invalid credentials');
      },
    });
  }
}
