package com.rige.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RoomRequest {

    @NotBlank
    private String name;

    @NotNull
    @Positive
    private BigDecimal pricePerNight;

    @NotNull
    @Positive
    private Integer capacity;
}
