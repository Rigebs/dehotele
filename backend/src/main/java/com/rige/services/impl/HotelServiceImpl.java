package com.rige.services.impl;

import com.rige.dto.request.HotelRequest;
import com.rige.dto.response.HotelResponse;
import com.rige.entities.HotelEntity;
import com.rige.exceptions.ResourceNotFoundException;
import com.rige.mappers.HotelMapper;
import com.rige.repositories.HotelRepository;
import com.rige.services.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final HotelMapper hotelMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<HotelResponse> findAll(Pageable pageable) {
        return hotelRepository.findAll(pageable)
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
