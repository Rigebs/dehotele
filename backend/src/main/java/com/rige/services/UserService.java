package com.rige.services;

import com.rige.dto.request.PasswordUpdateRequest;
import com.rige.dto.request.UserUpdateRequest;
import com.rige.dto.response.UserResponse;

public interface UserService {

  UserResponse getMyProfile();
  UserResponse updateProfile(UserUpdateRequest request);
  void updatePassword(PasswordUpdateRequest request);
}