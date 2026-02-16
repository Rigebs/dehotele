package com.rige.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class RoomResponse {

    private Long id;
    private String name;
    private BigDecimal pricePerNight;
    private Integer capacity;
}
