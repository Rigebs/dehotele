export interface UserUpdateRequest {
  fullName: string;
  email: string;
}

export interface PasswordUpdateRequest {
  oldPassword: string;
  newPassword: string;
}
