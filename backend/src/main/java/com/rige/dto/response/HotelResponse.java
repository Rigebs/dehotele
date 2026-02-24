package com.rige.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class HotelResponse {

    private Long id;
    private String name;
    private String city;
    private String address;
    private String description;
    private String imageUrl;
    private Double rating;
    private Integer reviewsCount;
    private List<String> amenities;
}