package com.rige.filters;

import com.rige.enums.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationFilter {
    private Long userId;
    private Long roomId;
    private ReservationStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String search;
}