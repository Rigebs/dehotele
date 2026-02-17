package com.rige.services;

import com.rige.dto.request.LoginRequest;
import com.rige.dto.request.RefreshRequest;
import com.rige.dto.request.RegisterRequest;
import com.rige.dto.response.AuthResponse;

public interface AuthService {

  AuthResponse register(RegisterRequest request);

  AuthResponse login(LoginRequest request);

  AuthResponse refreshToken(RefreshRequest refreshToken);
}
