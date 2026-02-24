package com.rige.filters;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HotelFilter {
    private String name;
    private String city;
    private Double minRating;
    private Boolean active;
}