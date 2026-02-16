package com.rige.services;

import com.rige.dto.request.HotelRequest;
import com.rige.dto.response.HotelResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HotelService {

    Page<HotelResponse> findAll(Pageable pageable);

    HotelResponse findById(Long id);

    HotelResponse create(HotelRequest dto);

    HotelResponse update(Long id, HotelRequest dto);

    void delete(Long id);
}
