package com.rige.services;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.filters.ReservationFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReservationService {

    ReservationResponse create(ReservationRequest dto);

    List<ReservationResponse> findByUser(Long userId);

    void cancel(Long reservationId);

    Page<ReservationResponse> findAll(ReservationFilter filter, Pageable pageable);
}
