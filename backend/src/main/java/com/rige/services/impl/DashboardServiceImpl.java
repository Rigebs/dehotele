package com.rige.services.impl;

import com.rige.dto.response.DashboardResponse;
import com.rige.mappers.ReservationMapper;
import com.rige.mappers.ReviewMapper;
import com.rige.repositories.*;
import com.rige.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ReservationRepository reservationRepository;
    private final HotelRepository hotelRepository;
    private final ReviewRepository reviewRepository;
    private final ReservationMapper reservationMapper;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getAdminDashboardStats() {
        // 1. Obtener KPIs (Usando los métodos que agregamos al repo)
        BigDecimal revenue = reservationRepository.calculateTotalRevenue();
        long activeRes = reservationRepository.countActiveReservationsNow(LocalDate.now());
        long activeHotels = hotelRepository.countByActiveTrue();
        
        // Calculamos rating promedio global de todos los hoteles
        double avgRating = hotelRepository.getGlobalAverageRating();
        
        var recentReservations = reservationRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(reservationMapper::toResponseDTO)
                .collect(Collectors.toList());

        var criticalReviews = reviewRepository.findTop5ByRatingLessThanEqualOrderByCreatedAtDesc(2).stream()
                .map(reviewMapper::toResponseDTO)
                .collect(Collectors.toList());

        // 3. Datos para gráficos (Agrupación simple por ciudad)
        var hotelsByCity = hotelRepository.countHotelsByCity().stream()
                .collect(Collectors.toMap(
                    obj -> (String) obj[0],
                    obj -> (Long) obj[1]
                ));

        return DashboardResponse.builder()
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .activeReservationsCount(activeRes)
                .activeHotelsCount(activeHotels)
                .globalAverageRating(Math.round(avgRating * 10.0) / 10.0)
                .recentReservations(recentReservations)
                .criticalReviews(criticalReviews)
                .hotelsByCity(hotelsByCity)
                .build();
    }
}