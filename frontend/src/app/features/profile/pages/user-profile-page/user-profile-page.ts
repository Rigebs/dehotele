import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile-page.html',
  styleUrl: './user-profile-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfilePage {
  protected readonly userService = inject(UserService);
  private readonly fb = inject(NonNullableFormBuilder);

  isLoading = signal(false);
  message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  profileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
  });

  passwordForm = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.profileForm.patchValue({
          fullName: user.fullName,
          email: user.email,
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    this.userService.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.message.set({ type: 'success', text: 'Profile updated successfully' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.message.set({ type: 'error', text: err.error?.error || 'Update failed' });
      },
    });
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading.set(true);
    this.userService.updatePassword(this.passwordForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.passwordForm.reset();
        this.message.set({ type: 'success', text: 'Password changed successfully' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.message.set({ type: 'error', text: err.error?.error || 'Password update failed' });
      },
    });
  }
}
