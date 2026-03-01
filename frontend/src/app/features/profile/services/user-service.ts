import { inject, Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../../../core/services/api-service';
import { User } from '../../../core/models/auth.model';
import { PasswordUpdateRequest, UserUpdateRequest } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly endpoint = 'users';

  user = this.authService.currentUser;

  fetchProfile() {
    return this.apiService
      .get<User>(this.endpoint)
      .pipe(tap((user) => this.authService.updateUserManually(user)));
  }

  updateProfile(request: UserUpdateRequest) {
    return this.apiService
      .put<User, UserUpdateRequest>(this.endpoint, request)
      .pipe(tap((updatedUser) => this.authService.updateUserManually(updatedUser)));
  }

  updatePassword(request: PasswordUpdateRequest) {
    return this.apiService.patch<void, PasswordUpdateRequest>(`${this.endpoint}/password`, request);
  }
}
