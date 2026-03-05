package com.rige.dto.response;

import com.rige.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {

    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private Role role;
}
