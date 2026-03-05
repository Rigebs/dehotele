package com.rige.services;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.request.UpdateReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.filters.ReservationFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    ReservationResponse create(ReservationRequest dto);

    List<ReservationResponse> findByUser(Long userId);

    boolean isAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);

    ReservationResponse update(Long id, UpdateReservationRequest dto);

    void cancel(Long reservationId);

    Page<ReservationResponse> findAll(ReservationFilter filter, Pageable pageable);
}
