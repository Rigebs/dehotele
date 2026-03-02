package com.rige.services.impl;

import com.rige.dto.request.HotelRequest;
import com.rige.dto.response.HotelResponse;
import com.rige.entities.HotelEntity;
import com.rige.entities.RoomEntity;
import com.rige.exceptions.ResourceNotFoundException;
import com.rige.filters.HotelFilter;
import com.rige.mappers.HotelMapper;
import com.rige.repositories.HotelRepository;
import com.rige.repositories.RoomRepository;
import com.rige.services.HotelService;
import com.rige.specifications.HotelSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final HotelMapper hotelMapper;
    private final RoomRepository roomRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<HotelResponse> findAll(HotelFilter filter, Pageable pageable) {
        Specification<HotelEntity> spec = HotelSpecification.build(filter);

        return hotelRepository.findAll(spec, pageable)
                .map(hotelMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public HotelResponse findById(Long id) {
        HotelEntity hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        return hotelMapper.toResponseDTO(hotel);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<HotelResponse> findAvailableHotels(String city, Integer capacity,
                                                   LocalDate checkIn, LocalDate checkOut,
                                                   Pageable pageable) {
        return hotelRepository.findAvailableHotels(city, capacity, checkIn, checkOut, pageable)
                .map(hotelMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public HotelResponse findHotelWithAvailableRooms(Long id, Integer capacity,
                                                     LocalDate checkIn, LocalDate checkOut) {
        HotelEntity hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        List<RoomEntity> availableRooms = roomRepository.findAvailableRoomsByHotel(
                id, capacity, checkIn, checkOut);

        hotel.setRooms(availableRooms);

      return hotelMapper.toResponseDTO(hotel);
    }

    @Override
    public HotelResponse create(HotelRequest dto) {
        HotelEntity hotel = hotelMapper.toEntity(dto);
        hotel.setActive(true);
        return hotelMapper.toResponseDTO(hotelRepository.save(hotel));
    }

    @Override
    public HotelResponse update(Long id, HotelRequest dto) {
        HotelEntity hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        hotel.setName(dto.getName());
        hotel.setCity(dto.getCity());
        hotel.setAddress(dto.getAddress());
        hotel.setDescription(dto.getDescription());

        return hotelMapper.toResponseDTO(hotel);
    }

    @Override
    public void delete(Long id) {
        HotelEntity hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        hotel.setActive(false);
    }
}
