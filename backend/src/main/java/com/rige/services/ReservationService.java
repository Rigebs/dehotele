package com.rige.services;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.request.UpdateReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.filters.ReservationFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface ReservationService {

    ReservationResponse create(ReservationRequest dto);

    ReservationResponse findById(Long id);

    Page<ReservationResponse> findByUser(Long userId, ReservationFilter filter, Pageable pageable);

    boolean isAvailable(Long roomId, LocalDate checkIn, LocalDate checkOut);

    void complete(Long id);

    ReservationResponse update(Long id, UpdateReservationRequest dto);

    void cancel(Long reservationId);

    Page<ReservationResponse> findAll(ReservationFilter filter, Pageable pageable);
}
