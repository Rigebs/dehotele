package com.rige.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    // KPIs
    private BigDecimal totalRevenue;
    private long activeReservationsCount;
    private long activeHotelsCount;
    private double globalAverageRating;

    private List<ReservationResponse> recentReservations;
    private List<ReviewResponse> criticalReviews;

    private Map<String, Long> hotelsByCity;
}