package com.rige.controllers;

import com.rige.dto.request.ReservationRequest;
import com.rige.dto.request.UpdateReservationRequest;
import com.rige.dto.response.ReservationResponse;
import com.rige.filters.ReservationFilter;
import com.rige.security.CustomUserDetails;
import com.rige.services.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> create(
            @Valid @RequestBody ReservationRequest dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.create(dto));
    }

    @GetMapping("/my")
    public Page<ReservationResponse> getMyReservations(
            @ParameterObject ReservationFilter filter,
            @AuthenticationPrincipal CustomUserDetails user,
            Pageable pageable) {

        return reservationService.findByUser(user.id(), filter, pageable);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        return ResponseEntity.ok(reservationService.isAvailable(roomId, checkIn, checkOut));
    }

    // ReservationController.java
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationRequest dto) {

        return ResponseEntity.ok(reservationService.update(id, dto));
    }

    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {

        reservationService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
