package com.rige.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HotelResponse {

    private Long id;
    private String name;
    private String city;
    private String address;
    private String description;
}
