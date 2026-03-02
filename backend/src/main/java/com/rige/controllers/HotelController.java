package com.rige.controllers;

import com.rige.dto.request.ReviewRequest;
import com.rige.dto.response.HotelResponse;
import com.rige.dto.response.ReviewResponse;
import com.rige.filters.HotelFilter;
import com.rige.services.HotelService;
import com.rige.services.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;
    private final ReviewService reviewService;

    @GetMapping
    public Page<HotelResponse> getAll(@ParameterObject HotelFilter filter, Pageable pageable) {
        return hotelService.findAll(filter, pageable);
    }

    @GetMapping("/{id}")
    public HotelResponse getById(@PathVariable Long id) {
        return hotelService.findById(id);
    }

    @GetMapping("/available")
    public Page<HotelResponse> getAvailableHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) LocalDate checkIn,
            @RequestParam(required = false) LocalDate checkOut,
            Pageable pageable) {
        return hotelService.findAvailableHotels(city, capacity, checkIn, checkOut, pageable);
    }

    @GetMapping("/{id}/availability")
    public HotelResponse getHotelWithAvailability(
            @PathVariable Long id,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return hotelService.findHotelWithAvailableRooms(id, capacity, checkIn, checkOut);
    }

    @PostMapping("/{id}/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public void addReview(
            @PathVariable Long id,
            @RequestBody @Valid ReviewRequest request,
            Principal principal
    ) {
        reviewService.addReview(id, principal.getName(), request);
    }

    @GetMapping("/{id}/reviews")
    public Page<ReviewResponse> getReviews(@PathVariable Long id, Pageable pageable) {
        return reviewService.findByHotelId(id, pageable);
    }
}
