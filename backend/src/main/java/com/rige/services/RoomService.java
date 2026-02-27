package com.rige.services;

import com.rige.dto.request.RoomRequest;
import com.rige.dto.response.RoomResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {

    Page<RoomResponse> findByHotel(Long hotelId, Pageable pageable);

    RoomResponse findById(Long roomId);

    RoomResponse create(RoomRequest dto);

    RoomResponse update(Long roomId, RoomRequest dto);

    void delete(Long roomId);
}
