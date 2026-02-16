package com.rige.services.impl;

import com.rige.dto.request.RoomRequest;
import com.rige.dto.response.RoomResponse;
import com.rige.entities.HotelEntity;
import com.rige.entities.RoomEntity;
import com.rige.exceptions.ResourceNotFoundException;
import com.rige.mappers.RoomMapper;
import com.rige.repositories.HotelRepository;
import com.rige.repositories.RoomRepository;
import com.rige.services.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final RoomMapper roomMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<RoomResponse> findByHotel(Long hotelId, Pageable pageable) {

        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found");
        }

        return roomRepository.findAll(
                (root, query, cb) ->
                        cb.equal(root.get("hotel").get("id"), hotelId),
                pageable
        ).map(roomMapper::toResponseDTO);
    }

    @Override
    public RoomResponse create(Long hotelId, RoomRequest dto) {

        HotelEntity hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        RoomEntity room = roomMapper.toEntity(dto);
        room.setHotel(hotel);
        room.setActive(true);

        return roomMapper.toResponseDTO(roomRepository.save(room));
    }

    @Override
    public RoomResponse update(Long roomId, RoomRequest dto) {

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setName(dto.getName());
        room.setPricePerNight(dto.getPricePerNight());
        room.setCapacity(dto.getCapacity());

        return roomMapper.toResponseDTO(room);
    }

    @Override
    public void delete(Long roomId) {

        RoomEntity room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setActive(false);
    }
}
