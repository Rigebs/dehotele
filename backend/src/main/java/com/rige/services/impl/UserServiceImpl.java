package com.rige.services.impl;

import com.rige.dto.request.PasswordUpdateRequest;
import com.rige.dto.request.UserUpdateRequest;
import com.rige.dto.response.UserResponse;
import com.rige.entities.UserEntity;
import com.rige.repositories.UserRepository;
import com.rige.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyProfile() {
        UserEntity user = getAuthenticatedUser();
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UserUpdateRequest request) {
        UserEntity user = getAuthenticatedUser();

        if (!user.getEmail().equalsIgnoreCase(request.email()) &&
                userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email address is already in use by another account");
        }

        user.setFullName(request.fullName());
        user.setEmail(request.email());

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void updatePassword(PasswordUpdateRequest request) {
        UserEntity user = getAuthenticatedUser();

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new RuntimeException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private UserEntity getAuthenticatedUser() {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserResponse mapToResponse(UserEntity entity) {
        return UserResponse.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .role(entity.getRole())
                .build();
    }
}