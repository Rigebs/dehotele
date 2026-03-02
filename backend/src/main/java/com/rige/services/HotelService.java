package com.rige.services;

import com.rige.dto.request.HotelRequest;
import com.rige.dto.response.HotelResponse;
import com.rige.filters.HotelFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface HotelService {

    Page<HotelResponse> findAll(HotelFilter filter, Pageable pageable);

    HotelResponse findById(Long id);

    Page<HotelResponse> findAvailableHotels(String city, Integer capacity,
                                            LocalDate checkIn, LocalDate checkOut,
                                            Pageable pageable);

    HotelResponse findHotelWithAvailableRooms(Long id, Integer capacity,
                                              LocalDate checkIn, LocalDate checkOut);

    HotelResponse create(HotelRequest dto);

    HotelResponse update(Long id, HotelRequest dto);

    void delete(Long id);
}
