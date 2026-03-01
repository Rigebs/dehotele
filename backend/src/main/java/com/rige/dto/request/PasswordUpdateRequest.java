package com.rige.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordUpdateRequest(
        @NotBlank(message = "Current password is required")
        String oldPassword,

        @NotBlank(message = "New password cannot be empty")
        @Size(min = 8, message = "New password must be at least 8 characters long")
        String newPassword
) {}